// load and validate environment variables from app.config.js
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

if (!extra?.BACKEND_URL) {
  throw new Error('BACKEND_URL is missing');
}

export const ENV = {
  BACKEND_URL: extra.BACKEND_URL as string,
  BACKEND_TIMEOUT: Number(extra.BACKEND_TIMEOUT ?? 10000),
};
