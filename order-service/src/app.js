import express from 'express'

import orderRoute from './routes/order.routes.js'
import connectDB from './database/connection.js'
const app = express()

app.use(express.json())

// --- ADD THIS SECTION ---
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});
// ------------------------

connectDB()

app.use("/api/v1/orders", orderRoute)


export default app