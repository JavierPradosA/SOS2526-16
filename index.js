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

app.get("/api/v1/global-ev-stock-volumes/loadInitialData", (req, res) => {
  if(data.length === 0){
    data = initialData.slice();
    res.status(201).send("Los datos han sido cargados")

  }else{
    res.status(409).send("Ya hay datos cargados")
  }
}
);

app.get("/samples/ARH", (req, res) =>{
  //Lógica de index-ARH.js
  
  let targetCountry = "Finland";
  let targetColumn = "oil_world_displacement";


  let totalPerCountry = data.reduce((acum, fila) => {
    if (fila.region_country === targetCountry){
        acum.sum += fila[targetColumn];
        acum.count++;
    }
    return acum;
  }, {sum: 0 , count: 0}
  );

  let countryAverage = totalPerCountry.sum/totalPerCountry.count;

  res.send(`La media anual de barriles de crudo ahorrados por ${targetCountry} es de ${countryAverage}`)
});
//GET lista datos 
app.get("/api/v1/global-ev-stock-volumes", (req, res) => {
  res.json(data);
}
);
//GET dato
app.get("/api/v1/global-ev-stock-volumes", (req, res) => {
  
  if(resource) {
    res.json(data);
  }
  else{
    res.status(404).send("Recurso no encontrado")
  }
}
);

//POST Dato; No debe permitir realizar post sobre otro dato

//PUT dato; No debe permitir realizar put a la lista general

//DELETE lista datos

//DELETE dato

// index-IMM.js

// 1. Inicializar el array con los datos extraídos de la imagen
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

app.get("/samples/IMM", (req, res) =>{
// 2. Definir la región objetivo
const regionObjetivo = 'Finland';

let mediaImpacto = null;

// 3. Algoritmo usando iteradores (filter, map, reduce)
// Primero, filtramos las filas correspondientes a la región objetivo
const datosFiltrados = datos.filter(fila => fila.region === regionObjetivo);

if (datosFiltrados.length > 0) {
    // Usamos map para aislar los valores de 'economic_impact' en un nuevo array
    const impactos = datosFiltrados.map(fila => fila.economic_impact);

    // Usamos reduce para sumar todos esos valores
    const sumaTotal = impactos.reduce((acumulador, valorActual) => acumulador + valorActual, 0);

    // Calculamos la media aritmética
    mediaImpacto = sumaTotal / impactos.length;
}

res.send(`La media de impacto económico de ${regionObjetivo} es ${mediaImpacto}`)
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
