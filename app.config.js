// load environment variables from .env file and make them available in the Expo app
import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    BACKEND_URL: process.env.BACKEND_URL,
    BACKEND_TIMEOUT: process.env.BACKEND_TIMEOUT,
  },
});
