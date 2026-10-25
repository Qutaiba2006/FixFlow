const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const healthRoutes = require("./routes/healthRoutes");
const authRouters = require("./routes/registerRout");
const login = require("./routes/loginRout");
const connectDB = require("./config/db");
const app = express();
let PORT = 5000;
app.use(express.json());
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRouters);
app.use("/api/auth", login);
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