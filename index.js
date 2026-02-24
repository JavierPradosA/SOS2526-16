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



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});