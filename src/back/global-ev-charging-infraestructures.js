import express from "express";
import dataStore from 'nedb';

let db = new dataStore();

const router = express.Router();

// Datos iniciales
const initialData = [
  { country: "germany", year: 2021, charging_point: 63898, ac_slow: 1809, dc_fast: 3451, total_power_kw: 1812933 },
  { country: "canada", year: 2023, charging_point: 26108, ac_slow: 15581, dc_fast: 2076, total_power_kw: 415585 },
  { country: "germany", year: 2019, charging_point: 31195, ac_slow: 416, dc_fast: 1975, total_power_kw: 836856 },
  { country: "germany", year: 2020, charging_point: 45073, ac_slow: 1047, dc_fast: 2814, total_power_kw: 1244489 },
  { country: "germany", year: 2022, charging_point: 90783, ac_slow: 2167, dc_fast: 4297, total_power_kw: 2748477 },
  { country: "malta", year: 2023, charging_point: 394, ac_slow: 0, dc_fast: 47, total_power_kw: 10164 },
  { country: "switzerland", year: 2023, charging_point: 13324, ac_slow: 1913, dc_fast: 887, total_power_kw: 470255 },
  { country: "turkiye", year: 2023, charging_point: 12084, ac_slow: 311, dc_fast: 2117, total_power_kw: 646699 },
  { country: "monaco", year: 2019, charging_point: 18, ac_slow: 3, dc_fast: 6, total_power_kw: 343 },
  { country: "germany", year: 2023, charging_point: 129456, ac_slow: 3017, dc_fast: 6467, total_power_kw: 4569267 }
];



// LOAD INITIAL DATA
router.get("/loadInitialData", (req, res) => {

  db.count({}, (err, count) => {
    if (count === 0) {
      db.insert(initialData, () => {
        res.sendStatus(201);
      });
    } else {
      res.sendStatus(409);
    }
  });
});

// GET COLECCIÓN
router.get("/", (req, res) => {

  db.find({}, { _id: 0 }, (err, result) => {

    // FILTROS STRING
    if (req.query.country) {
      result = result.filter(d =>
        d.country === req.query.country.toLowerCase()
      );
    }

    // FILTRO EXACTO AÑO
    if (req.query.year) {
      result = result.filter(d =>
        d.year == Number(req.query.year)
      );
    }

    // RANGO AÑO
    if (req.query.from) {
      result = result.filter(d =>
        d.year >= Number(req.query.from)
      );
    }

    if (req.query.to) {
      result = result.filter(d =>
        d.year <= Number(req.query.to)
      );
    }

    // ===== charging_point =====

    if (req.query.charging_point) {
      result = result.filter(d =>
        d.charging_point == Number(req.query.charging_point)
      );
    }

    if (req.query.charging_point_gt) {
      result = result.filter(d =>
        d.charging_point > Number(req.query.charging_point_gt)
      );
    }

    if (req.query.charging_point_lt) {
      result = result.filter(d =>
        d.charging_point < Number(req.query.charging_point_lt)
      );
    }

    // ===== ac_slow =====

    if (req.query.ac_slow) {
      result = result.filter(d =>
        d.ac_slow == Number(req.query.ac_slow)
      );
    }

    if (req.query.ac_slow_gt) {
      result = result.filter(d =>
        d.ac_slow > Number(req.query.ac_slow_gt)
      );
    }

    if (req.query.ac_slow_lt) {
      result = result.filter(d =>
        d.ac_slow < Number(req.query.ac_slow_lt)
      );
    }

    // ===== dc_fast =====

    if (req.query.dc_fast) {
      result = result.filter(d =>
        d.dc_fast == Number(req.query.dc_fast)
      );
    }

    if (req.query.dc_fast_gt) {
      result = result.filter(d =>
        d.dc_fast > Number(req.query.dc_fast_gt)
      );
    }

    if (req.query.dc_fast_lt) {
      result = result.filter(d =>
        d.dc_fast < Number(req.query.dc_fast_lt)
      );
    }

    // ===== total_power_kw =====

    if (req.query.total_power_kw) {
      result = result.filter(d =>
        d.total_power_kw == Number(req.query.total_power_kw)
      );
    }

    if (req.query.total_power_kw_gt) {
      result = result.filter(d =>
        d.total_power_kw > Number(req.query.total_power_kw_gt)
      );
    }

    if (req.query.total_power_kw_lt) {
      result = result.filter(d =>
        d.total_power_kw < Number(req.query.total_power_kw_lt)
      );
    }

    // PAGINACIÓN
    let offset = Number(req.query.offset);
    let limit = Number(req.query.limit);

    if (offset) {
      result = result.slice(offset);
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    res.json(result);
  });

});

// GET RECURSO
router.get("/:country/:year", (req, res) => {

  const country = req.params.country.toLowerCase();
  const year = Number(req.params.year);

  db.findOne(
    { country: country, year: year },
    { _id: 0 },
    (err, item) => {

      if (!item) {
        return res.sendStatus(404);
      }

      res.json(item);

    });
});

// POST
router.post("/", (req, res) => {

  const newItem = req.body;

  if (
    !newItem.country ||
    !newItem.year ||
    newItem.charging_point === undefined ||
    newItem.ac_slow === undefined ||
    newItem.dc_fast === undefined ||
    newItem.total_power_kw === undefined
  ) {
    return res.sendStatus(400);
  }

  db.findOne(
    { country: newItem.country.toLowerCase(), year: newItem.year },
    (err, existing) => {

      if (existing) {
        return res.sendStatus(409);
      }

      newItem.country = newItem.country.toLowerCase();

      delete newItem._id;

      db.insert(newItem, () => {
        res.sendStatus(201);
      });

    }
  );

});

// POST NO PERMITIDO
router.post("/:country/:year", (req, res) => {
  res.sendStatus(405);
});

// PUT
router.put("/:country/:year", (req, res) => {

  const country = req.params.country.toLowerCase();
  const year = Number(req.params.year);
  const body = req.body;

  if (
    !body.country ||
    !body.year ||
    body.country.toLowerCase() !== country ||
    Number(body.year) !== year
  ) {
    return res.sendStatus(400);
  }

  delete body._id;

  db.update(
    { country: country, year: year },
    body,
    {},
    (err, updated) => {

      if (updated === 0) {
        return res.sendStatus(404);
      }

      res.sendStatus(200);

    });

});

// PUT NO PERMITIDO
router.put("/", (req, res) => {
  res.sendStatus(405);
});

// DELETE COLECCIÓN
router.delete("/", (req, res) => {

  db.remove({}, { multi: true }, () => {

    res.sendStatus(200);

  });

});

// DELETE RECURSO
router.delete("/:country/:year", (req, res) => {

  const country = req.params.country.toLowerCase();
  const year = Number(req.params.year);

  db.remove(
    { country: country, year: year },
    {},
    (err, removed) => {

      if (removed === 0) {
        return res.sendStatus(404);
      }

      res.sendStatus(200);

    }
  );

});

// DOCS
router.get("/docs", (req, res) => {

  res.redirect("https://documenter.getpostman.com/view/52367690/2sBXigLt7Z");

});

export default router;