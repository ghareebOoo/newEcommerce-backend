import "dotenv/config";

import app from "./app.js";
import mongoose from "mongoose";
import morgan from "morgan";

const port = process.env.PORT;

const DB = process.env.DATABASE;

mongoose.connect(DB).then(() => {
  console.log("DB connection successful!");

  app.listen(port, () => {
    console.log(`app running on port ${port}`);
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("Api Working");
});

