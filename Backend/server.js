const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const authRouters = require("./routes/registerRout");
const login = require("./routes/loginRout");
const location = require("./routes/locationRoutes");
const report = require("./routes/ReportRoutes");
const connectDB = require("./config/db");
const app = express();
let PORT = 5000;
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRouters);
app.use("/api/auth", login);
app.use("/api/locations", location);
app.use("/api/reports", report);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
startServer();
