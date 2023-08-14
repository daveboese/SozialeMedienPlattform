const express = require("express");

const app = express();
const port = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hallo MDR");
});

app.listen(port, () => {
  console.log(`Der Server ist unter http://localhost:${port} erreichbar.`);
});
