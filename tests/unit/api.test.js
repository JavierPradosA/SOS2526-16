import test from 'node:test';
import assert from 'node:assert';
import request from "supertest";
import express from "express";

import { evChargingInfrastructuresAPI } from "../../src/back/global-ev-charging-infrastructures.js";

const app = express();
app.use(express.json());
evChargingInfrastructuresAPI(app);

// ✅ TEST 1
test("GET base devuelve 200", async () => {
  const res = await request(app).get("/api/v1/global-ev-charging-infrastructures");
  assert.strictEqual(res.statusCode, 200);
});

// ✅ TEST 2
test("loadInitialData devuelve 201 o 409", async () => {
  const res = await request(app).get("/api/v1/global-ev-charging-infrastructures/loadInitialData");
  assert.ok([201, 409].includes(res.statusCode));
});

// ✅ TEST 3
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

// ✅ TEST 4
test("POST sin datos devuelve 400", async () => {
  const res = await request(app)
    .post("/api/v1/global-ev-charging-infrastructures")
    .send({});

  assert.strictEqual(res.statusCode, 400);
});