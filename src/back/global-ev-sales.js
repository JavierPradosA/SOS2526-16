import util from 'util';
util.isDate = util.isDate || function(d) { return d instanceof Date; };
util.isRegExp = util.isRegExp || function(re) { return re instanceof RegExp; };
import express from "express";
import dataStore from 'nedb';

// 1. Inicialización de la base de datos con persistencia
//const db = new dataStore({ filename: './db/global-ev-sales.db', autoload: true });
let db = new dataStore();
const router = express.Router();

// 2. Datos iniciales
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


function estructuraValida(body) {
  const camposEsperados = ['region', 'category', 'parameter', 'mode', 'powertrain', 'year', 'unit', 'value', 'economic_impact'];
  const camposBody = Object.keys(body);
  
  // Si no tiene exactamente 9 campos, es inválido
  if (camposBody.length !== camposEsperados.length) return false;
  
  // Comprobamos que todos los campos esperados estén presentes
  for (let campo of camposEsperados) {
    if (!camposBody.includes(campo)) return false;
  }
  return true;
}

// ==========================================
// ENDPOINTS
// ==========================================

// LOAD INITIAL DATA
// LOAD INITIAL DATA
router.get("/loadInitialData", (req, res) => {
  db.count({}, (err, count) => {
    if (err) {
      console.log("Error al contar:", err);
      return res.sendStatus(500);
    }
    
    if (count === 0) {

      const clonDatos = JSON.parse(JSON.stringify(datos));
      
      db.insert(clonDatos, (err, newDocs) => {
        if (err) {
          console.log("FALLO CRÍTICO AL INSERTAR DATOS INICIALES:", err);
          return res.sendStatus(500); // Si falla, que devuelva 500
        }
        res.sendStatus(201);
      });
    } else {
      res.sendStatus(409);
    }
  });
});

router.get("/docs", (req, res) => {
  // Aquí pondremos el enlace público que te dará Postman
  res.redirect("https://documenter.getpostman.com/view/52408123/2sBXiesa2T");
});

// GET COLECCIÓN (Con búsquedas y paginación)
router.get("/", (req, res) => {

  db.find({}, { _id: 0 }, (err, result) => {
    if (err) return res.sendStatus(500);

    // FILTROS POR TODOS LOS CAMPOS
    if (req.query.region) result = result.filter(d => d.region.toLowerCase() === req.query.region.toLowerCase());
    if (req.query.category) result = result.filter(d => d.category.toLowerCase() === req.query.category.toLowerCase());
    if (req.query.parameter) result = result.filter(d => d.parameter.toLowerCase() === req.query.parameter.toLowerCase());
    if (req.query.mode) result = result.filter(d => d.mode.toLowerCase() === req.query.mode.toLowerCase());
    if (req.query.powertrain) result = result.filter(d => d.powertrain.toLowerCase() === req.query.powertrain.toLowerCase());
    if (req.query.year) result = result.filter(d => d.year === Number(req.query.year));
    if (req.query.unit) result = result.filter(d => d.unit.toLowerCase() === req.query.unit.toLowerCase());
    if (req.query.value) result = result.filter(d => d.value === Number(req.query.value));
    if (req.query.economic_impact) result = result.filter(d => d.economic_impact === Number(req.query.economic_impact));

    // Búsquedas de rango de años
    if (req.query.from) result = result.filter(d => d.year >= Number(req.query.from));
    if (req.query.to) result = result.filter(d => d.year <= Number(req.query.to));

    // PAGINACIÓN
    let offset = Number(req.query.offset) || 0; 
    let limit = Number(req.query.limit);

    if (offset > 0) result = result.slice(offset);
    if (limit > 0) result = result.slice(0, limit);

    res.json(result);
  });
});

// GET POR REGIÓN (Tu requisito especial)
router.get("/:region", (req, res) => {
  const region = req.params.region;
  
  db.find({ region: region }, { _id: 0 }, (err, result) => {
    if (result.length === 0) return res.sendStatus(404);
    res.json(result);
  });
});

// GET RECURSO INDIVIDUAL
router.get("/:region/:year", (req, res) => {
  const region = req.params.region;
  const year = Number(req.params.year);

  db.findOne({ region: region, year: year }, { _id: 0 }, (err, item) => {
    if (!item) return res.sendStatus(404);
    res.json(item);
  });
});

// POST COLECCIÓN
router.post("/", (req, res) => {
  const newItem = req.body;

  if (!estructuraValida(newItem)) {
    return res.sendStatus(400);
  }

  // Aseguramos que el año se busca como Número por si Postman lo envía como Texto
  const yearBusqueda = Number(newItem.year);

  db.findOne({ region: newItem.region, year: yearBusqueda }, (err, existing) => {
    if (err) console.log("Error al buscar en POST:", err);
    
    if (existing) {
      return res.sendStatus(409);
    }
    
    db.insert(newItem, (err, docCreado) => {
      if (err) {
        console.log("FALLO CRÍTICO AL HACER EL POST:", err);
        return res.sendStatus(500);
      }
      res.sendStatus(201);
    });
  });
});

// POST MÉTODOS NO PERMITIDOS
router.post("/:region", (req, res) => res.sendStatus(405));
router.post("/:region/:year", (req, res) => res.sendStatus(405));

// PUT RECURSO INDIVIDUAL
router.put("/:region/:year", (req, res) => {
  const regionUrl = req.params.region;
  const yearUrl = Number(req.params.year);
  const body = req.body;

  if (
    !estructuraValida(body) || 
    body.region !== regionUrl || 
    Number(body.year) !== yearUrl
  ) {
    return res.sendStatus(400);
  }

  db.update(
    { region: regionUrl, year: yearUrl },
    body,
    {}, 
    (err, numReplaced) => {
      if (numReplaced === 0) {
        return res.sendStatus(404); 
      }
      res.sendStatus(200);
    }
  );
});

// PUT MÉTODOS NO PERMITIDOS
router.put("/", (req, res) => res.sendStatus(405));
router.put("/:region", (req, res) => res.sendStatus(405));

// DELETE COLECCIÓN
router.delete("/", (req, res) => {
  db.remove({}, { multi: true }, (err, numRemoved) => {
    res.sendStatus(200);
  });
});

// DELETE RECURSO INDIVIDUAL
router.delete("/:region/:year", (req, res) => {
  const region = req.params.region;
  const year = Number(req.params.year);

  db.remove({ region: region, year: year }, {}, (err, numRemoved) => {
    if (numRemoved === 0) {
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  });
});


export default router;