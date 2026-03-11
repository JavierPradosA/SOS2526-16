import express from "express";

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

let data = [];

// LOAD INITIAL DATA
router.get("/loadInitialData", (req, res) => {

  if (data.length === 0) {
    data = initialData.slice();
    res.status(201).json(data);
  } else {
    res.sendStatus(409);
  }

});

// GET COLECCIÓN
router.get("/", (req, res) => {

  let result = data;

  // FILTROS
  if (req.query.country) {
    result = result.filter(d =>
      d.country === req.query.country.toLowerCase()
    );
  }

  if (req.query.year) {
    result = result.filter(d =>
      d.year == Number(req.query.year)
    );
  }

  if (req.query.charging_point) {
    result = result.filter(d =>
      d.charging_point == Number(req.query.charging_point)
    );
  }

  if (req.query.ac_slow) {
    result = result.filter(d =>
      d.ac_slow == Number(req.query.ac_slow)
    );
  }

  if (req.query.dc_fast) {
    result = result.filter(d =>
      d.dc_fast == Number(req.query.dc_fast)
    );
  }

  if (req.query.total_power_kw) {
    result = result.filter(d =>
      d.total_power_kw == Number(req.query.total_power_kw)
    );
  }

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

// GET RECURSO
router.get("/:country/:year", (req, res) => {

  const country = req.params.country.toLowerCase();
  const year = Number(req.params.year);

  const item = data.find(d =>
    d.country === country &&
    d.year === year
  );

  if (!item) {
    return res.sendStatus(404);
  }

  res.json(item);

});

// POST
router.post("/", (req, res) => {

  const newItem = req.body;

  // VALIDACIÓN JSON
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

  newItem.country = newItem.country.toLowerCase();

  const exists = data.find(d =>
    d.country === newItem.country &&
    d.year == newItem.year
  );

  if (exists) {
    return res.sendStatus(409);
  }

  data.push(newItem);

  res.sendStatus(201);

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

  const index = data.findIndex(d =>
    d.country === country &&
    d.year === year
  );

  if (index === -1) {
    return res.sendStatus(404);
  }

  body.country = body.country.toLowerCase();

  data[index] = body;

  res.sendStatus(200);

});

// PUT NO PERMITIDO
router.put("/", (req, res) => {
  res.sendStatus(405);
});

// DELETE COLECCIÓN
router.delete("/", (req, res) => {

  data = [];

  res.sendStatus(200);

});

// DELETE RECURSO
router.delete("/:country/:year", (req, res) => {

  const country = req.params.country.toLowerCase();
  const year = Number(req.params.year);

  const before = data.length;

  data = data.filter(d =>
    !(d.country === country && d.year === year)
  );

  if (data.length === before) {
    return res.sendStatus(404);
  }

  res.sendStatus(200);

});

// DOCS
router.get("/docs", (req, res) => {

  res.redirect("url_postman");

});

export default router;