require("dotenv").config({ path: ".env" });

const mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@cluster0.d1qayrv.mongodb.net/socialmediadb`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));
