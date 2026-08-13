import "dotenv/config";

import app from "./app.js";
import mongoose from "mongoose";
import morgan from "morgan";

const port = process.env.PORT || 3000;
const DB = process.env.DATABASE;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API Working");
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful!");

    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });