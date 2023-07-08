const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
///
const register = require("./UserTransactions/register");
const auth = require("./UserTransactions/auth");
///
mongoose.set("strictQuery", true);

mongoose
  .connect(
    `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASS}@cluster0.1qncwqx.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Now connected to MongoDB!"))
  .catch((err) => console.error("Something went wrong", err));

app.use("/api/register", register);
app.use("/api/auth", auth);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get("/", (req, res) => {
  res.send("lojipass is online!");
});
