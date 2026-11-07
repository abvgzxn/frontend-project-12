import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_BUGSINK_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
  });
}