//let express = require("express");
import express from 'express'

import path from 'path'
//let bodyParser = require("body-parser");
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

//Import apis
import chargingAPI from "./src/back/global-ev-charging-infraestructures.js";
import salesAPI from "./src/back/global-ev-sales.js";
import evStockAPI  from './src/back/global-ev-stock-volumes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());


app.use("/api/v1/global-ev-charging-infrastructures", chargingAPI);
app.use("/api/v1/global-ev-sales", salesAPI);
app.use("/api/v1/global-ev-stock-volumes", evStockAPI);

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
