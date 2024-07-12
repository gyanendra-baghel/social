// @ts-nocheck

const config = {
  apiUrl: String(import.meta.env.VITE_API_URL),
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
