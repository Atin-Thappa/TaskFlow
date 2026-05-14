import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import Workflow from "../models/Workflow"; 

describe("Webhook Trigger", () => {
  const mockPath = "Fn1P_qSHCK";

  beforeAll(async () => {
    const url = process.env.MONGO_URI || "mongodb://localhost:27017/test_db";
    await mongoose.connect(url);

    await Workflow.findOneAndUpdate(
      { "trigger.webhookPath": mockPath },
      {
        userId: new mongoose.Types.ObjectId(),
        name: "Test Workflow",
        trigger: {
          type: "WEBHOOK",
          webhookPath: mockPath,
        },
        actions: [],
        isActive: true,
      },
      { upsert: true, new: true }
    );
  });

  afterAll(async () => {
    await Workflow.deleteMany({ "trigger.webhookPath": mockPath });
    await mongoose.connection.close();
  });

  it("should return 404 for a non-existent webhook", async () => {
    const res = await request(app)
      .post("/webhook/idontexist")
      .send({});
    
    expect(res.status).toBe(404);
  });

  it("should return 202 for a valid webhook", async () => {
    const res = await request(app)
      .post(`/webhook/${mockPath}`)
      .send({ test: "payload" });
    
    expect(res.status).toBe(202);
  });
});