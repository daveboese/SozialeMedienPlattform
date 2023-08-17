const express = require("express");
const userRoutes = require("./routes/user.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");

const app = express();

app.use(express.json());

//routes
app.use("/api/user", userRoutes);

//Server
app.listen(process.env.PORT, () => {
  console.log(
    `Der Server ist unter http://localhost:${process.env.PORT} erreichbar.`
  );
});
