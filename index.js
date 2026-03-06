//let express = require("express");
import express from 'express'
//let cool = require("cool-ascii-faces");
import cool from 'cool-ascii-faces'
//let path = require("path");
import path from 'path'
//let bodyParser = require("body-parser");
import bodyParser from 'body-parser';

let app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

app.get("/cool", (req, res) => {
  res.send(cool());
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

//Buena Práctica: URL Base
let BASE_URL_API = "/api/v1";

//TAREA F04
const initialData = [
  { region_country: "Brazil", year: 2024, ev_stock: 214003, macroregion_stock: 1884600, worldwide_stock: 50000000, "oil_world_displacement": 58001 },
  { region_country: "Brazil", year: 2010, ev_stock: 0, macroregion_stock: 400, worldwide_stock: 20426, "oil_world_displacement": 25 },
  { region_country: "Canada", year: 2011, ev_stock: 555, macroregion_stock: 23800, worldwide_stock: 67526, "oil_world_displacement": 88 },
  { region_country: "Mexico", year: 2012, ev_stock: 91, macroregion_stock: 4671, worldwide_stock: 190026, "oil_world_displacement": 190 },
  { region_country: "China", year: 2013, ev_stock: 32600, macroregion_stock: 111000, worldwide_stock: 390027, "oil_world_displacement": 420 },
  { region_country: "China", year: 2014, ev_stock: 85000, macroregion_stock: 208000, worldwide_stock: 710087, "oil_world_displacement": 830 },
  { region_country: "Colombia", year: 2015, ev_stock: 124, macroregion_stock: 18620, worldwide_stock: 1250810, "oil_world_displacement": 1500 },
  { region_country: "Costa Rica", year: 2016, ev_stock: 12, macroregion_stock: 37990, worldwide_stock: 2003100, "oil_world_displacement": 2100 },
  { region_country: "Denmark", year: 2017, ev_stock: 10683, macroregion_stock: 570000, worldwide_stock: 3106800, "oil_world_displacement": 3500 },
  { region_country: "Finland", year: 2018, ev_stock: 15400, macroregion_stock: 820000, worldwide_stock: 5111000, "oil_world_displacement": 6000 },
  { region_country: "Finland", year: 2019, ev_stock: 29701, macroregion_stock: 1330000, worldwide_stock: 7219000, "oil_world_displacement": 8100 }
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


// index-IMM.js

// 1. Inicializar el array
const datos = [
  { region: 'Australia', category: 'Historical', parameter: 'EV stock share', mode: 'Cars', powertrain: 'EV', year: 2011, unit: 'Percent', value: 0.000039253245, economic_impact: 0 },
  { region: 'Finland', category: 'Historical', parameter: 'EV stock share', mode: 'Vans', powertrain: 'EV', year: 2021, unit: 'Percent', value: 0.3, economic_impact: 0 },
  { region: 'Finland', category: 'Historical', parameter: 'EV stock share', mode: 'Buses', powertrain: 'BEV', year: 2022, unit: 'Vehicles', value: 550, economic_impact: 154.9 },
  { region: 'USA', category: 'Projection-STEPS', parameter: 'EV charging points', mode: 'EV', powertrain: 'Publicly available fast', year: 2021, unit: 'Charging Points', value: 22000, economic_impact: 358.64 },
  { region: 'Netherlands', category: 'Historical', parameter: 'EV stock', mode: 'Trucks', powertrain: 'PHEV', year: 2020, unit: 'Vehicles', value: 41, economic_impact: 6.71 },
  { region: 'Finland', category: 'Historical', parameter: 'EV stock share', mode: 'Trucks', powertrain: 'EV', year: 2023, unit: 'Percent', value: 0.119, economic_impact: 0 },
  { region: 'Seychelles', category: 'Historical', parameter: 'EV sales', mode: 'Cars', powertrain: 'BEV', year: 2020, unit: 'Vehicles', value: 26, economic_impact: 1.07 },
  { region: 'Germany', category: 'Historical', parameter: 'EV stock', mode: 'Vans', powertrain: 'BEV', year: 2021, unit: 'Vehicles', value: 41000, economic_impact: 2340.04 },
  { region: 'Finland', category: 'Historical', parameter: 'EV sales', mode: 'Cars', powertrain: 'PHEV', year: 2013, unit: 'Vehicles', value: 170, economic_impact: 6.1 },
  { region: 'Finland', category: 'Historical', parameter: 'EV sales', mode: 'Buses', powertrain: 'BEV', year: 2016, unit: 'Vehicles', value: 13, economic_impact: 3.66 }
];

let dataII = [];


// LOAD INITIAL DATA
app.get("/api/v1/global-ev-sales/loadInitialData", (req, res) => {
  if (dataII.length === 0) {
    dataII = datos.slice();
    res.status(201).send("Los datos han sido cargados");
  } else {
    res.status(409).send("Ya hay datos cargados");
  }
});


// SAMPLE
app.get("/samples/IMM", (req, res) => {

  if (dataII.length === 0) {
    return res.send("Aún no hay datos cargados");
  }

  const regionObjetivo = "Finland";

  const filtrados = dataII.filter(d =>
    d.region.toLowerCase() === regionObjetivo.toLowerCase()
  );

  const media =
    filtrados.reduce((acc, d) => acc + d.economic_impact, 0) /
    filtrados.length;

  res.send(`La media de impacto económico de ${regionObjetivo} es ${media}`);
});


// GET COLECCIÓN
app.get("/api/v1/global-ev-sales", (req, res) => {

  let resulta = dataII;

  if (req.query.region) {
    resulta = resulta.filter(d =>
      d.region.toLowerCase() === req.query.region.toLowerCase()
    );
  }

  if (req.query.year) {
    resulta = resulta.filter(d =>
      d.year == Number(req.query.year)
    );
  }

  if (req.query.from) {
    resulta = resulta.filter(d =>
      d.year >= Number(req.query.from)
    );
  }

  if (req.query.to) {
    resulta = resulta.filter(d =>
      d.year <= Number(req.query.to)
    );
  }

  res.json(resulta);
});


// GET INDIVIDUAL
app.get("/api/v1/global-ev-sales/:region/:year", (req, res) => {

  const { region, year } = req.params;

  const item = dataII.find(d =>
    d.region.toLowerCase() === region.toLowerCase() &&
    d.year == Number(year)
  );

  if (!item) {
    return res.sendStatus(404);
  }

  res.json(item);
});


// POST
app.post("/api/v1/global-ev-sales", (req, res) => {

  const newItem = req.body;

  if (!newItem.region || !newItem.year) {
    return res.sendStatus(400);
  }

  newItem.region = newItem.region.toLowerCase();

  const exists = dataII.find(d =>
    d.region === newItem.region &&
    d.year == newItem.year
  );

  if (exists) {
    return res.sendStatus(409);
  }

  dataII.push(newItem);

  res.sendStatus(201);
});


// PUT
app.put("/api/v1/global-ev-sales/:region/:year", (req, res) => {

  const { region, year } = req.params;

  if (req.body.region) {
    req.body.region = req.body.region.toLowerCase();
  }

  const index = dataII.findIndex(d =>
    d.region === region.toLowerCase() &&
    d.year == Number(year)
  );

  if (index === -1) {
    return res.sendStatus(404);
  }

  dataII[index] = req.body;

  res.sendStatus(200);
});


// DELETE COLECCIÓN
app.delete("/api/v1/global-ev-sales", (req, res) => {

  dataII = [];

  res.sendStatus(200);
});


// DELETE INDIVIDUAL
app.delete("/api/v1/global-ev-sales/:region/:year", (req, res) => {

  const antes = dataII.length;

  dataII = dataII.filter(d =>
    !(d.region === req.params.region.toLowerCase() &&
      d.year == Number(req.params.year))
  );

  if (dataII.length === antes) {
    return res.sendStatus(404);
  }

  res.sendStatus(200);
});

//index-JPA.js
const dataJavi = [
  { country: "germany", year: 2021, charging_point: 63898, ac_slow: 1809, dc_fast: 3451, total_power_kw: 1812933 },
  { country: "canada", year: 2023, charging_point: 26108, ac_slow: 15581, dc_fast: 2076, total_power_kw: 415585 },
  { country: "germany", year: 2019, charging_point: 31195, ac_slow: 416, dc_fast: 1975, total_power_kw: 836856 },
  { country: "germany", year: 2020, charging_point: 45073, ac_slow: 1047, dc_fast: 2814, total_power_kw: 1244489 },
  { country: "germany", year: 2022, charging_point: 90783, ac_slow: 2167, dc_fast: 4297, total_power_kw: 2748477 },
  { country: "malta", year: 2023, charging_point: 394, ac_slow: 0, dc_fast: 47, total_power_kw: 10164 },
  { country: "switzerland", year: 2023, charging_point: 13324, ac_slow: 1913, dc_fast: 887, total_power_kw: 470255 },
  { country: "türkiye", year: 2023, charging_point: 12084, ac_slow: 311, dc_fast: 2117, total_power_kw: 646699 },
  { country: "monaco", year: 2019, charging_point: 18, ac_slow: 3, dc_fast: 6, total_power_kw: 343 },
  { country: "germany", year: 2023, charging_point: 129456, ac_slow: 3017, dc_fast: 6467, total_power_kw: 4569267 }
];
let dataIII = [];

app.get("/api/v1/global-ev-charging-infrastructures/loadInitialData", (req, res) => {
  if (dataIII.length === 0) {
    dataIII = dataJavi.slice();
    res.status(201).send("Los datos han sido cargados");

  } else {
    res.status(409).send("Ya hay datos cargados");
  }
}
);


app.get("/samples/JPA", (req, res) => {
  if (dataIII.length === 0) {
    return res.send(`Aun no hay datos cargados`)
  }
  //Filtrado de datos por el país
  let germany = dataIII.filter(d => d.country === "germany");

  /*Se usa reduce para que al acumulador inicado a 0 se 
  le vayan sumando los puntos de carga de los datos filtrados
  y luego se divide entre el total de datos filtrados*/
  let media_german_CP = germany.reduce((acc, d) => acc + d.charging_point, 0) / germany.length;

  //Mostramos la media por pantalla
  res.send(`The average charging point in Germany is ${media_german_CP}`);
})

//Get colección
app.get("/api/v1/global-ev-charging-infrastructures", (req, res) => {
  let result = dataIII;

  // filtro por country
  if (req.query.country) {
    result = result.filter(d =>
      d.country === req.query.country.toLowerCase()
    );
  }

  // filtro por year exacto
  if (req.query.year) {
    result = result.filter(d =>
      d.year == Number(req.query.year)
    );
  }

  // filtro desde
  if (req.query.from) {
    result = result.filter(d =>
      d.year >= Number(req.query.from)
    );
  }

  // filtro hasta
  if (req.query.to) {
    result = result.filter(d =>
      d.year <= Number(req.query.to)
    );
  }

  res.json(result); // siempre array
});

//Get individual
app.get("/api/v1/global-ev-charging-infrastructures/:country/:year", (req, res) => {
  const { country, year } = req.params;

  const item = dataIII.find(d =>
    d.country === country.toLowerCase() &&
    d.year == Number(year)
  );

  if (!item) {
    return res.sendStatus(404);
  }

  res.json(item);
});

//POST
app.post("/api/v1/global-ev-charging-infrastructures", (req, res) => {
  const newItem = req.body;
  if (!newItem.country || !newItem.year) {
    return res.sendStatus(400)
  }
  if (newItem.country) {
    newItem.country = newItem.country.toLowerCase();
  }

  // comprobar si ya existe (misma clave)
  const exists = dataIII.find(
    d => d.country === newItem.country &&
      d.year == newItem.year
  );

  if (exists) {
    return res.sendStatus(409); // ya existe
  }

  dataIII.push(newItem);
  res.sendStatus(201); // creado
});

//PUT
app.put("/api/v1/global-ev-charging-infrastructures/:country/:year", (req, res) => {
  const { country, year } = req.params;
  if (req.body.country) {
    req.body.country = req.body.country.toLowerCase();
  }

  const index = dataIII.findIndex(
    d => d.country === country.toLowerCase() &&
      d.year == Number(year)
  );

  if (index === -1) {
    return res.sendStatus(404); // no existe
  }

  dataIII[index] = req.body; // reemplazo completo
  res.sendStatus(200);
});

//Delete coleccion
app.delete("/api/v1/global-ev-charging-infrastructures", (req, res) => {
  dataIII = [];
  res.sendStatus(200);
});

//Delete individual
app.delete("/api/v1/global-ev-charging-infrastructures/:country/:year", (req, res) => {
  const before = dataIII.length;

  dataIII = dataIII.filter(d =>
    !(d.country === req.params.country.toLowerCase() &&
      d.year == Number(req.params.year))
  );

  if (dataIII.length === before) {
    return res.sendStatus(404); // no existía
  }

  res.sendStatus(200); // borrado correcto
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
