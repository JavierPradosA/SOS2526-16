let express = require("express");
let cool = require("cool-ascii-faces");
let path = require("path");

let app = express();

app.use(express.static("public"));

app.get("/cool", (req, res) => {
  res.send(cool());
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});