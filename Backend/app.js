require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const connectDB = require("./config/connectDB");
const transScriptRouter = require("./routes/transScriptRouter");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", transScriptRouter);
app.get("/inactive", (req, res) => {
  res.json({ message: "Activated" });
});

setInterval(function () {
  // do something here or leave it as it is
  console.log('INTERVAL', new Date().toLocaleString());
  fetch('http:localhost:5000/inactive')
}, 300000)


port = process.env.PORT || 5000;
(async () => {
  await connectDB(process.env.DATABASE_URI);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
})();
