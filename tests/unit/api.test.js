import request from "supertest";
import express from "express";

import { evChargingInfrastructuresAPI } from "../../src/back/global-ev-charging-infrastructures.js";

const app = express();
app.use(express.json());
evChargingInfrastructuresAPI(app);

describe("API global-ev-charging-infrastructures", () => {

  test("GET base devuelve 200", async () => {
    const res = await request(app).get("/api/v1/global-ev-charging-infrastructures");
    expect(res.statusCode).toBe(200);
  });

  test("loadInitialData devuelve 201 o 409", async () => {
    const res = await request(app).get("/api/v1/global-ev-charging-infrastructures/loadInitialData");
    expect([201, 409]).toContain(res.statusCode);
  });

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

    expect([201, 409]).toContain(res.statusCode);
  });

  test("POST sin datos devuelve 400", async () => {
    const res = await request(app)
      .post("/api/v1/global-ev-charging-infrastructures")
      .send({});

    expect(res.statusCode).toBe(400);
  });

});