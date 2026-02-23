let express = require("express");
let cool = require("cool-ascii-faces");
const PORT = process.env.PORT || 3000;

let app = express();
app.get("/cool", (req, res) => {
  res.send(cool());
}
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);
