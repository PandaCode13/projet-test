import { config } from "dotenv";

config();

export const envConfig = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRES_IN,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    cookie: {
        accessTokenName: process.env.ACCESS_TOKEN_COOKIE_NAME,
        refreshTokenName: process.env.REFRESH_TOKEN_COOKIE_NAME,
        accessTokenMaxAge: process.env.ACCESS_TOKEN_COOKIE_MAX_AGE,
        refreshTokenMaxAge: process.env.REFRESH_TOKEN_COOKIE_MAX_AGE,
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        // username: process.env.DB_USERNAME,
        // password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
};