import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { PORT } from "./configs/env.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
