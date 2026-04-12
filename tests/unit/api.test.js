import test from 'node:test';
import assert from 'node:assert';
import request from "supertest";
import express from "express";

import { evChargingInfrastructuresAPI } from "../../src/back/global-ev-charging-infrastructures.js";

const app = express();
app.use(express.json());
evChargingInfrastructuresAPI(app);

// 🔹 GET BASE
test("GET base devuelve 200", async () => {
  const res = await request(app).get("/api/v1/global-ev-charging-infrastructures");
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 LOAD INITIAL DATA (201 / 409)
test("loadInitialData devuelve 201 o 409", async () => {
  const res = await request(app)
    .get("/api/v1/global-ev-charging-infrastructures/loadInitialData");
  assert.ok([201, 409].includes(res.statusCode));
});

// 🔹 POST OK
test("POST crea elemento", async () => {
  const res = await request(app)
    .post("/api/v1/global-ev-charging-infrastructures")
    .send({
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
  const res = await request(app)
    .post("/api/v1/global-ev-charging-infrastructures")
    .send({});

  assert.strictEqual(res.statusCode, 400);
});

// 🔹 GET FILTRO
test("GET con filtro country", async () => {
  const res = await request(app)
    .get("/api/v1/global-ev-charging-infrastructures?country=test");

  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET RECURSO EXISTENTE / INEXISTENTE
test("GET recurso inexistente devuelve 404", async () => {
  const res = await request(app)
    .get("/api/v1/global-ev-charging-infrastructures/xxx/9999");

  assert.strictEqual(res.statusCode, 404);
});

// 🔹 PUT OK
test("PUT actualiza elemento", async () => {
  // primero creamos
  await request(app).post("/api/v1/global-ev-charging-infrastructures").send({
    country: "update",
    year: 2020,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  const res = await request(app)
    .put("/api/v1/global-ev-charging-infrastructures/update/2020")
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

// 🔹 PUT ERROR (400)
test("PUT con datos inválidos devuelve 400", async () => {
  const res = await request(app)
    .put("/api/v1/global-ev-charging-infrastructures/update/2020")
    .send({});

  assert.strictEqual(res.statusCode, 400);
});

// 🔹 PUT 404
test("PUT inexistente devuelve 404", async () => {
  const res = await request(app)
    .put("/api/v1/global-ev-charging-infrastructures/no/9999")
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

// 🔹 DELETE UNO
test("DELETE elemento", async () => {
  await request(app).post("/api/v1/global-ev-charging-infrastructures").send({
    country: "del",
    year: 2021,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  const res = await request(app)
    .delete("/api/v1/global-ev-charging-infrastructures/del/2021");

  assert.strictEqual(res.statusCode, 200);
});

// 🔹 DELETE COLECCIÓN
test("DELETE colección", async () => {
  const res = await request(app)
    .delete("/api/v1/global-ev-charging-infrastructures");

  assert.strictEqual(res.statusCode, 200);
});