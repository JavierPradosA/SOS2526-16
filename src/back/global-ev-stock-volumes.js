import express from "express";
import dataStore from 'nedb';

let db = new dataStore();

//Buena Práctica: URL Base
let BASE_URL_API = "/api/v1";

function evStockAPI(app){
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

//Load initialData


//Get colección


//Get recurso


//Post
app.post(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
  let newRegister = req.body;
  //Comprobamos si tiene los atributos mínimos
  if (!newRegister.region_country || !newRegister.year) {
    return res.sendStatus(400)
  }
  db.find({}, () =>{
    if(){

    }
    db.insert(newRegister);
    res.sendStatus(201);
  })

});

//Post sobre dato. NO PERMITIDO
app.post(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
  res.sendStatus(405);
});

//Put 

//PUT sobre la lista general.NO VÁLIDO
app.put(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
  res.sendStatus(405);
});

//Delete individual
app.delete(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
  const { region_country, year } = req.params;
  
  db.find({ region_country : region_country , year: year}, (err, registros) => {
    if (registros.length === 0){
        res.sendStatus(404);
    }else{
        db.remove({region_country: region_country, year: year}, (err, numRemoved));
    }
  });  
  
});


//Delete colección
app.delete(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
 db.remove({}, { multi: true }, () => {
    res.sendStatus(200);
  });

});

}
export {evStockAPI};


