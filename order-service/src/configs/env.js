import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 4003;
export const MONGO_URL = process.env.MONGO_URL;
