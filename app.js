import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";
import connectDB from "./db/config.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, function () {
    console.log(`Server running. Use our API on port: ${PORT}\n`);
  });
});
