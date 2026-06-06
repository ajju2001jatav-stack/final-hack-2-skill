import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { startServer } from "../../server";

let listenerInstance: any;

beforeAll(async () => {
  // Use a unique port for integration tests
  process.env.PORT = "45678";
  process.env.NODE_ENV = "test";
  const { listener } = await startServer();
  listenerInstance = listener;
});

afterAll(async () => {
  if (listenerInstance) {
    await new Promise<void>((resolve) => {
      listenerInstance.close(() => resolve());
    });
  }
});

describe("API endpoints", () => {
  it("should successfully sync upload and download data", async () => {
    // 1. Upload mock data
    const uploadRes = await fetch("http://localhost:45678/api/sync/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        syncKey: "TEST-SYNC-KEY",
        data: JSON.stringify({ logs: [], targetExam: "NEET" })
      })
    });
    
    expect(uploadRes.status).toBe(200);
    const uploadData = await uploadRes.json();
    expect(uploadData.success).toBe(true);
    
    // 2. Download mock data
    const downloadRes = await fetch("http://localhost:45678/api/sync/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        syncKey: "TEST-SYNC-KEY"
      })
    });
    
    expect(downloadRes.status).toBe(200);
    const downloadData = await downloadRes.json();
    expect(downloadData.success).toBe(true);
    expect(JSON.parse(downloadData.data).targetExam).toBe("NEET");
  });

  it("should return 400 when syncKey or data is missing", async () => {
    const uploadRes = await fetch("http://localhost:45678/api/sync/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        syncKey: "TEST-SYNC-KEY"
      })
    });
    expect(uploadRes.status).toBe(400);
  });

  it("should return 404 when download syncKey does not exist", async () => {
    const downloadRes = await fetch("http://localhost:45678/api/sync/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        syncKey: "NON-EXISTENT-KEY"
      })
    });
    expect(downloadRes.status).toBe(404);
  });
});
