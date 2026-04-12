import test from 'node:test';
import assert from 'node:assert';
import request from "supertest";
import express from "express";

import { evChargingInfrastructuresAPI } from "../../src/back/global-ev-charging-infrastructures.js";

const API = "/api/v1/global-ev-charging-infrastructures";

const app = express();
app.use(express.json());
evChargingInfrastructuresAPI(app);

// 🔹 GET BASE
test("GET base devuelve 200", async () => {
  const res = await request(app).get(API);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 LOAD INITIAL DATA
test("loadInitialData devuelve 201 o 409", async () => {
  const res = await request(app).get(`${API}/loadInitialData`);
  assert.ok([201, 409].includes(res.statusCode));
});

// 🔹 POST OK
test("POST crea elemento", async () => {
  const res = await request(app).post(API).send({
    country: "test",
    year: 2025,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  assert.ok([201, 409].includes(res.statusCode));
});

// 🔹 POST ERROR
test("POST sin datos devuelve 400", async () => {
  const res = await request(app).post(API).send({});
  assert.strictEqual(res.statusCode, 400);
});

// 🔹 POST DUPLICADO
test("POST duplicado devuelve 409", async () => {
  const data = {
    country: "dup",
    year: 2022,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  };

  await request(app).post(API).send(data);
  const res = await request(app).post(API).send(data);

  assert.strictEqual(res.statusCode, 409);
});

// 🔹 POST EN RECURSO
test("POST en recurso devuelve 405", async () => {
  const res = await request(app)
    .post(`${API}/spain/2020`)
    .send({});
  assert.strictEqual(res.statusCode, 405);
});

// 🔹 GET FILTRO
test("GET con filtro country", async () => {
  const res = await request(app).get(`${API}?country=test`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET RANGO
test("GET con rango de años", async () => {
  const res = await request(app).get(`${API}?from=2010&to=2030`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET FILTRO NUMÉRICO
test("GET con filtro mayor que", async () => {
  const res = await request(app).get(`${API}?charging_point_gt=0`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET COMBINADO
test("GET con múltiples filtros", async () => {
  const res = await request(app).get(`${API}?country=test&year=2025`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET INEXISTENTE
test("GET recurso inexistente devuelve 404", async () => {
  const res = await request(app).get(`${API}/xxx/9999`);
  assert.strictEqual(res.statusCode, 404);
});

// 🔹 PUT OK
test("PUT actualiza elemento", async () => {
  await request(app).post(API).send({
    country: "update",
    year: 2020,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  const res = await request(app)
    .put(`${API}/update/2020`)
    .send({
      country: "update",
      year: 2020,
      charging_point: 2,
      ac_slow: 2,
      dc_fast: 2,
      total_power_kw: 2
    });

  assert.strictEqual(res.statusCode, 200);
});

// 🔹 PUT ERROR 400
test("PUT con datos inválidos devuelve 400", async () => {
  const res = await request(app)
    .put(`${API}/update/2020`)
    .send({});
  assert.strictEqual(res.statusCode, 400);
});

// 🔹 PUT ID DISTINTO
test("PUT con ID distinto devuelve 400", async () => {
  const res = await request(app)
    .put(`${API}/test/2025`)
    .send({
      country: "otro",
      year: 2025,
      charging_point: 1,
      ac_slow: 1,
      dc_fast: 1,
      total_power_kw: 1
    });

  assert.strictEqual(res.statusCode, 400);
});

// 🔹 PUT 404
test("PUT inexistente devuelve 404", async () => {
  const res = await request(app)
    .put(`${API}/no/9999`)
    .send({
      country: "no",
      year: 9999,
      charging_point: 1,
      ac_slow: 1,
      dc_fast: 1,
      total_power_kw: 1
    });

  assert.strictEqual(res.statusCode, 404);
});

// 🔹 PUT COLECCIÓN
test("PUT en colección devuelve 405", async () => {
  const res = await request(app)
    .put(API)
    .send({});
  assert.strictEqual(res.statusCode, 405);
});

// 🔹 DELETE UNO
test("DELETE elemento", async () => {
  await request(app).post(API).send({
    country: "del",
    year: 2021,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  const res = await request(app)
    .delete(`${API}/del/2021`);

  assert.strictEqual(res.statusCode, 200);
});

// 🔹 DELETE INEXISTENTE
test("DELETE inexistente devuelve 404", async () => {
  const res = await request(app)
    .delete(`${API}/no/9999`);

  assert.strictEqual(res.statusCode, 404);
});

// 🔹 DELETE COLECCIÓN
test("DELETE colección", async () => {
  const res = await request(app).delete(API);
  assert.strictEqual(res.statusCode, 200);
});