import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

describe("Webhook Trigger", () => {
  beforeAll(async () => {
    const url = process.env.MONGO_URI || "mongodb://localhost:27017/taskflow_test";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(url);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should return 404 for a non-existent webhook", async () => {
    const res = await request(app)
      .post("/webhook/nonexistentid")
      .send({});
    
    expect(res.status).toBe(404);
  });

  it("should return 202 for a valid webhook", async () => {
    const res = await request(app)
      .post("/webhook/Fn1P_qSHCK")
      .send({
        payload: { test: "data" }
      });

    expect(res.status).toBe(202);
  });
});