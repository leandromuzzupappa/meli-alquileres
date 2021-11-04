const express = require("express");

const app = express();
const PORT = 3001;

app.listen(PORT, () => console.log("Escuchando puerto " + PORT));

app.get("/", (req, res) => {
  res.send("Lenny was here");
});
