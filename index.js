//let express = require("express");
import express from 'express'

import path from 'path'
import { fileURLToPath } from 'url';

//Import apis
import {evChargingInfrastructuresAPI} from "./src/back/global-ev-charging-infraestructures.js";
import salesAPI from "./src/back/global-ev-sales.js";
import { evStockAPI } from './src/back/global-ev-stock-volumes.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();


app.use(express.static("public"));
app.use(express.json());


app.use("/api/v1/global-ev-charging-infrastructures", evChargingInfrastructuresAPI());
app.use("/api/v1/global-ev-sales", salesAPI);
evStockAPI(app);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
