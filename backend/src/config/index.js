import dotenv from "dotenv";

dotenv.config({
  path: './.env'
})

const config = {
  port: process.env.PORT || 5000,
  mongoDbUri: process.env.MONGODB_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
}

export function validateConfig(config) {
  for (const key of Object.keys(config)) {
    if (config[key] === undefined) {
      throw new Error(`Config error: ${key} is undefined`);
    }
  }
}

validateConfig(config)

export default config;