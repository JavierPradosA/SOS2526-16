import test from 'node:test';
import assert from 'node:assert';
import request from "supertest";
import express from "express";

import { evChargingInfrastructuresAPI } from "../../src/back/global-ev-charging-infrastructures.js";

const API = "/api/v1/global-ev-charging-infrastructures";

const app = express();
app.use(express.json());
evChargingInfrastructuresAPI(app);

// 🔹 RESET DB antes (opcional pero ayuda)
test("Reset DB", async () => {
  await request(app).delete(API);
});

// 🔹 LOAD INITIAL DATA
test("loadInitialData 201 y 409", async () => {
  const res1 = await request(app).get(`${API}/loadInitialData`);
  assert.strictEqual(res1.statusCode, 201);

  const res2 = await request(app).get(`${API}/loadInitialData`);
  assert.strictEqual(res2.statusCode, 409);
});

// 🔹 GET BASE
test("GET base", async () => {
  const res = await request(app).get(API);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 FILTROS STRING
test("GET filtro country", async () => {
  const res = await request(app).get(`${API}?country=germany`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 FILTRO EXACTO
test("GET filtro year", async () => {
  const res = await request(app).get(`${API}?year=2021`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 RANGO
test("GET from y to", async () => {
  const res = await request(app).get(`${API}?from=2019&to=2023`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 SOLO FROM
test("GET solo from", async () => {
  const res = await request(app).get(`${API}?from=2020`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 SOLO TO
test("GET solo to", async () => {
  const res = await request(app).get(`${API}?to=2022`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 NUMÉRICOS EQ
test("GET charging_point eq", async () => {
  const res = await request(app).get(`${API}?charging_point=18`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 NUMÉRICOS GT
test("GET charging_point_gt", async () => {
  const res = await request(app).get(`${API}?charging_point_gt=10`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 NUMÉRICOS LT
test("GET charging_point_lt", async () => {
  const res = await request(app).get(`${API}?charging_point_lt=100000`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 OTROS CAMPOS
test("GET ac_slow_gt", async () => {
  const res = await request(app).get(`${API}?ac_slow_gt=0`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 PAGINACIÓN
test("GET offset y limit", async () => {
  const res = await request(app).get(`${API}?offset=1&limit=2`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET RECURSO OK
test("GET recurso existente", async () => {
  const res = await request(app).get(`${API}/germany/2021`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 GET RECURSO 404
test("GET recurso inexistente", async () => {
  const res = await request(app).get(`${API}/no/9999`);
  assert.strictEqual(res.statusCode, 404);
});

// 🔹 POST OK
test("POST correcto", async () => {
  const res = await request(app).post(API).send({
    country: "test",
    year: 2025,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  assert.strictEqual(res.statusCode, 201);
});

// 🔹 POST 400
test("POST sin campos", async () => {
  const res = await request(app).post(API).send({});
  assert.strictEqual(res.statusCode, 400);
});

// 🔹 POST 409
test("POST duplicado", async () => {
  const data = {
    country: "dup",
    year: 2020,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  };

  await request(app).post(API).send(data);
  const res = await request(app).post(API).send(data);

  assert.strictEqual(res.statusCode, 409);
});

// 🔹 POST 405
test("POST no permitido en recurso", async () => {
  const res = await request(app).post(`${API}/spain/2020`);
  assert.strictEqual(res.statusCode, 405);
});

// 🔹 PUT OK
test("PUT correcto", async () => {
  await request(app).post(API).send({
    country: "update",
    year: 2020,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  const res = await request(app).put(`${API}/update/2020`).send({
    country: "update",
    year: 2020,
    charging_point: 2,
    ac_slow: 2,
    dc_fast: 2,
    total_power_kw: 2
  });

  assert.strictEqual(res.statusCode, 200);
});

// 🔹 PUT 400 (mismatch)
test("PUT id mismatch", async () => {
  const res = await request(app).put(`${API}/update/2020`).send({
    country: "otro",
    year: 2020
  });

  assert.strictEqual(res.statusCode, 400);
});

// 🔹 PUT 404
test("PUT inexistente", async () => {
  const res = await request(app).put(`${API}/no/9999`).send({
    country: "no",
    year: 9999,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  assert.strictEqual(res.statusCode, 404);
});

// 🔹 PUT 405
test("PUT colección", async () => {
  const res = await request(app).put(API);
  assert.strictEqual(res.statusCode, 405);
});

// 🔹 DELETE OK
test("DELETE elemento", async () => {
  await request(app).post(API).send({
    country: "del",
    year: 2021,
    charging_point: 1,
    ac_slow: 1,
    dc_fast: 1,
    total_power_kw: 1
  });

  const res = await request(app).delete(`${API}/del/2021`);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 DELETE 404
test("DELETE inexistente", async () => {
  const res = await request(app).delete(`${API}/no/9999`);
  assert.strictEqual(res.statusCode, 404);
});

// 🔹 DELETE COLECCIÓN
test("DELETE colección", async () => {
  const res = await request(app).delete(API);
  assert.strictEqual(res.statusCode, 200);
});

// 🔹 DOCS
test("GET docs redirect", async () => {
  const res = await request(app).get(`${API}/docs`);
  assert.strictEqual(res.statusCode, 302);
});