import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { evChargingInfrastructuresAPI } from "./src/back/global-ev-charging-infrastructures.js";
import salesAPI from "./src/back/global-ev-sales.js";
import { evStockAPI } from './src/back/global-ev-stock-volumes.js';

import cors from 'cors';
import { handler } from './src/front/build/handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

app.use(express.json());
app.use(cors());

// 🔹 APIs
evChargingInfrastructuresAPI(app);
app.use("/api/v1/global-ev-sales", salesAPI);
evStockAPI(app);

// 🔹 VUE (ANTES DE SVELTE)
app.use("/global-ev-charging-infrastructures-vue", express.static(path.join(__dirname, "frontend-vue/dist")));

// 🔹 SVELTE (AL FINAL)
app.use(handler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});