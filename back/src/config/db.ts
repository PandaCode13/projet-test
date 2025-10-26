import { connect } from "mongoose";
import { env } from "./index.js";

const connectDB = async () => {
    try {
        // Database connection logic here
        return await connect(`${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,{
            dbName: env.DB_NAME,
            autoIndex: true,
        })
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
export default connectDB;