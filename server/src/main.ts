import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust the full proxy chain 
  app.set('trust proxy', true);

  const configService = app.get(ConfigService);
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  // Allow only your production origins with credentials
  const whiteList = [
    'https://app.payly.it',
    'https://www.payly.it',
  ];

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: (origin, callback) => {
      if (!origin || whiteList.indexOf(origin) !== -1) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Deny the request
      }
    },
    credentials: true, // Allow cookies to be sent
  });

  app.setGlobalPrefix('api');

  const sessionSecret = configService.get<string>('SESSION_SECRET');
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable not set');
  }

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      proxy: true, // critical behind proxies for secure cookies
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: isProd,                // true on prod
        sameSite: isProd ? 'lax' : 'lax',
        domain: isProd ? '.payly.it' : undefined, // keep frontend+api same-site
      },
      store: MongoStore.create({
        mongoUrl: configService.get<string>('MONGO_URI'),
        collectionName: 'sessions',
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
