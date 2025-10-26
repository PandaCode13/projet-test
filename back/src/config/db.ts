import { connect } from "mongoose";
import { envConfig } from "./index.js";

const connectDB = async () => {
    try {
        // Database connection logic here
        return await connect(envConfig.db.host!)
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
export default connectDB;