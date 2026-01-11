// import express from "express";
// import cors from "cors";
// import routes from "./routes/index.routes.js";
// import { PORT } from "./configs/env.js";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/", routes);

// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}`);
// });


import express from "express";
import cors from "cors";
import routes from "./routes/index.routes.js";
import { PORT } from "./configs/env.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",          
  "https://e-commerce-testing-tan.vercel.app", // updated new url
  "https://e-smart-shop.vercel.app"
];

// Simple fix for "unknown address space" PNA error
app.use((req, res, next) => {
  if (req.headers['access-control-request-private-network']) {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
  }
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ADD THIS SECTION HERE ---
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});
// -----------------------------

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});