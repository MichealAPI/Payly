import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Disable Express's X-Powered-By
  app.disable('x-powered-by');

  // Trust a single reverse proxy (set to true if you terminate TLS behind multiple proxies)
  app.set('trust proxy', 1);

  const configService = app.get(ConfigService);
  const nodeEnv = (configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? 'development').toLowerCase();
  const isProd = nodeEnv === 'production';

  console.log(`Running in ${nodeEnv} mode`);

  // Conservative body size limits to mitigate DoS
  app.use(bodyParser.json({ limit: '200kb' }));
  app.use(bodyParser.urlencoded({ limit: '200kb', extended: true }));

  // Helmet with modern, valid options
  app.use(
    helmet({
      // Strong CSP for an API (tweak if serving HTML/Swagger/static)
      contentSecurityPolicy: isProd
        ? {
            useDefaults: true,
            directives: {
              defaultSrc: ["'self'"],
              baseUri: ["'self'"],
              frameAncestors: ["'none'"],
              objectSrc: ["'none'"],
              formAction: ["'self'"],
              imgSrc: ["'self'", 'data:'],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              connectSrc: ["'self'"],
              upgradeInsecureRequests: [], // only meaningful over https
            },
          }
        : false, // keep local dev flexible
      referrerPolicy: { policy: 'no-referrer' },
      frameguard: { action: 'deny' },
      dnsPrefetchControl: { allow: false },
      hsts: isProd ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: false, // not needed for typical APIs; can break pages
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      // xssFilter/expectCt/featurePolicy/xContentTypeOptions options are deprecated or handled by defaults
    }),
  );

  // Explicit Permissions-Policy (replaces deprecated Feature-Policy)
  app.use((req, res, next) => {
    // Deny powerful features by default
    res.setHeader(
      'Permissions-Policy',
      [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'bluetooth=()',
        'xr-spatial-tracking=()',
        // Explicitly opt-out of FLoC/Topics if supported
        'interest-cohort=()',
      ].join(', '),
    );
    next();
  });

  // Basic rate limiting for the API
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300, // adjust per your traffic
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
    }),
  );

  const whiteList = [
    'https://app.payly.it',
    'https://www.payly.it',
    // add dev origins when not in prod
    ...(isProd ? [] : ['http://localhost:3000', "http://localhost:5000", 'http://localhost:5173']),
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whiteList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204,
    maxAge: 86400, // cache preflight for 1 day where supported
  });

  app.setGlobalPrefix('api');

  const sessionSecret = configService.get<string>('SESSION_SECRET');
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable not set');
  }

  app.use(
    session({
      name: isProd ? '__Secure-payly.sid' : 'payly.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      proxy: true, // critical behind proxies for secure cookies
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        domain: isProd ? '.payly.it' : undefined,
        path: '/', // explicit
      },
      store: MongoStore.create({
        mongoUrl: configService.get<string>('MONGO_URI'),
        collectionName: 'sessions',
        // ttl: 60 * 60 * 24, // optional: enforce TTL explicitly
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
