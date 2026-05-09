export interface AppConfig {
  port: string;
  mongoUri: string;
  jwtSecret: string;
}

const config: AppConfig = {
  port: process.env.PORT || "3000",
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
