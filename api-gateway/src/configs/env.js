import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5000;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
export const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;
export const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;
