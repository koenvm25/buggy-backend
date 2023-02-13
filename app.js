import express from "express";
import dotenv from "dotenv";
import { issueRouter } from "./routes/issueRoute.js";
import { projectRouter } from "./routes/projectRoute.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/issues", issueRouter);
app.use("/projects", projectRouter);

app.get("/", (req, res) => {
  res.send("The buggy-backend is online!");
});

app.listen(port, () =>
  console.log(`The buggy-backend is running op port ${port}`)
);
