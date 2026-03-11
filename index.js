//let express = require("express");
import express from 'express'

import path from 'path'
//let bodyParser = require("body-parser");
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

//Import apis
import chargingAPI from "./src/back/global-ev-charging-infraestructures.js";
import salesAPI from "./src/back/global-ev-sales.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());


app.use("/api/v1/global-ev-charging-infrastructures", chargingAPI);
app.use("/api/v1/global-ev-sales", salesAPI);

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

//Buena Práctica: URL Base
let BASE_URL_API = "/api/v1";

//TAREA F04
const initialData = [
  { region_country: "Brazil", year: 2024, ev_stock: 214003, macroregion_stock: 1884600, worldwide_stock: 50000000, oil_world_displacement: 58001 },
  { region_country: "Brazil", year: 2010, ev_stock: 0, macroregion_stock: 400, worldwide_stock: 20426, oil_world_displacement: 25 },
  { region_country: "Canada", year: 2011, ev_stock: 555, macroregion_stock: 23800, worldwide_stock: 67526, oil_world_displacement: 88 },
  { region_country: "Mexico", year: 2012, ev_stock: 91, macroregion_stock: 4671, worldwide_stock: 190026, oil_world_displacement: 190 },
  { region_country: "China", year: 2013, ev_stock: 32600, macroregion_stock: 111000, worldwide_stock: 390027, oil_world_displacement: 420 },
  { region_country: "China", year: 2014, ev_stock: 85000, macroregion_stock: 208000, worldwide_stock: 710087, oil_world_displacement: 830 },
  { region_country: "Colombia", year: 2015, ev_stock: 124, macroregion_stock: 18620, worldwide_stock: 1250810, oil_world_displacement: 1500 },
  { region_country: "Costa Rica", year: 2016, ev_stock: 12, macroregion_stock: 37990, worldwide_stock: 2003100, oil_world_displacement: 2100 },
  { region_country: "Denmark", year: 2017, ev_stock: 10683, macroregion_stock: 570000, worldwide_stock: 3106800, oil_world_displacement: 3500 },
  { region_country: "Finland", year: 2018, ev_stock: 15400, macroregion_stock: 820000, worldwide_stock: 5111000, oil_world_displacement: 6000 },
  { region_country: "Finland", year: 2019, ev_stock: 29701, macroregion_stock: 1330000, worldwide_stock: 7219000, oil_world_displacement: 8100 }
];

let data = [];

app.get(BASE_URL_API + "/global-ev-stock-volumes/loadInitialData", (req, res) => {
  if (data.length === 0) {
    data = initialData.slice();
    res.status(201).json(data); //.json()===.send() pero con cabeceras json. Creo que no es necesario mandar el 201, lo reconoce automáticamente

  } else {
    res.sendStatus(409);
  }
}
);

app.get("/samples/ARH", (req, res) => {
  //Lógica de index-ARH.js

  let targetCountry = "Finland";
  let targetColumn = "oil_world_displacement";

  let totalPerCountry = initialData.reduce((acum, fila) => {
    if (fila.region_country === targetCountry) {
      acum.sum += fila[targetColumn];
      acum.count++;
    }
    return acum;
  }, { sum: 0, count: 0 }
  );

  let countryAverage = totalPerCountry.sum / totalPerCountry.count;

  res.send(`La media anual de barriles de crudo ahorrados por ${targetCountry} es de ${countryAverage}`)
});


//GET lista datos 
app.get("/api/v1/global-ev-stock-volumes", (req, res) => {
  res.json(data);
}
);
//GET dato
app.get("/api/v1/global-ev-stock-volumes/:region_country/:year", (req, res) => {
  const { region_country, year } = req.params;
  //.find recorre el array y se para en el primer elemento que cumpla la condición
  const registro = data.find(d =>
    d.region_country.toLowerCase() === region_country.toLowerCase() &&
    Number(d.year) == Number(year)
  );
  //Si la búsqueda no devuelve nada, es que no existe nigún registro con dichos parámetros en el array
  if (!registro) {
    return res.sendStatus(404);
  }

  res.json(registro);

}
);
//Método no permitido, POST sobre dato
app.post(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
  res.sendStatus(405);
});


//POST Dato; No debe permitir realizar post sobre otro dato
app.post(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
  const newRegister = req.body;
  //Comprobamos si tiene los atributos mínimos
  if (!newRegister.region_country || !newRegister.year) {
    return res.sendStatus(400)
  }

  //Comprobamos si existe ya
  const exists = data.find(
    d => d.region_country.toLowerCase() === newRegister.region_countrycountry.toLowerCase() &&
      Number(d.year) == Number(newRegister.year)
  );

  //Si existe 409 CONFLICT
  if (exists) {
    return res.sendStatus(409);
  }

  data.push(newRegister);
  //Creo que no es necesario mandar 201, ya que lo detecta automáticamente
  res.sendStatus(201);

});

//Método no permitido, PUT sobre la lista general
app.put(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
  res.sendStatus(405);
});

//PUT dato; No debe permitir realizar put a la lista general
app.put(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
  const { region_country, year } = req.params;
  const updateData = req.body;
  //Comprobamos que el identificador a actualizar corresponde con algún registro
  if (region_country !== updateData.region_country || Number(year) !== Number(updateData.year)) {
    return res.sendStatus(400);
  }

  //Buscar el índice del registro en el array
  const index = data.findIndex(d =>
    d.region_country.toLowerCase() === region_country.toLowerCase() &&
    Number(d.year) === Number(year)
  );

  //Recorre el array y si no encuentra ningún índice que corresponde con el país y año, devuelve -1
  if (index === -1) {
    return res.sendStatus(404);
  }

  //
  data[index] = updateData;
  res.sendStatus(200);

}
);


//DELETE lista datos
app.delete(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
  data = [];
  res.sendStatus(200);
});

//DELETE dato
app.delete(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
  const { region_country, year } = req.params;

  //Comprobamos si existe el recurso
  const existe = data.find(d =>
    d.region_country.toLowerCase() === region_country.toLowerCase() &&
    Number(d.year) === Number(year)
  );
  //Si no existe 404 NOT FOUND
  if (!existe) {
    return res.sendStatus(404);
  }

  //Filtramos el array, quedandonos con todo excepto el registro a borrar
  data = data.filter(d =>
    !(d.region_country.toLowerCase() === region_country.toLowerCase() &&
      Number(d.year) === Number(year))
  );

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
