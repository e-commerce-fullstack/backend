import express from 'express'

import productRoute from './routes/product.routes.js'
import connectDB from './database/connection.js'
const app = express()

app.use(express.json())


connectDB()

app.use("/api/v1/product", productRoute)


export default app