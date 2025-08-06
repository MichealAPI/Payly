
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://e33668c7f4e568a7175d56b75eb9ad20@o4504045887029248.ingest.us.sentry.io/4509796424810496",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});