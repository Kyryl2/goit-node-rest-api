import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
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
    console.log(`Server running. Use our API on port ${PORT}`);
  });
});
