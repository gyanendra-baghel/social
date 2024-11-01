import dotenv from "dotenv";

dotenv.config();

const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
};

export function validateConfig(config) {
  for (const key of Object.keys(config)) {
    if (config[key] === undefined) {
      throw new Error(`Config error: ${key} is undefined`);
    }
  }
}

validateConfig(config);

export default config;
