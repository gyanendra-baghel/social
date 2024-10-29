interface Config {
  apiUrl: string;
}

const config: Config = {
  apiUrl: String(import.meta.env.VITE_API_URL),
};

export function validateConfig(config: Config) {
  for (const key of Object.keys(config) as Array<keyof Config>) {
    if (config[key] === undefined) {
      throw new Error(`Config error: ${key} is undefined`);
    }
  }
}

validateConfig(config);

export default config;
