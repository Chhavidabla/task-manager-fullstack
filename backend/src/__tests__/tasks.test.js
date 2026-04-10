const request = require("supertest");
const app = require("../../src/server");

describe("Task API", () => {
  let createdId;

  // ── POST /api/tasks ────────────────────────────────────────────────────────

  describe("POST /api/tasks", () => {
    it("creates a task with a valid title", async () => {
      const res = await request(app).post("/api/tasks").send({ title: "Buy groceries" });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: "Buy groceries",
        completed: false,
      });
      expect(res.body.data.id).toBeDefined();
      createdId = res.body.data.id;
    });

    it("rejects an empty title", async () => {
      const res = await request(app).post("/api/tasks").send({ title: "" });
      expect(res.statusCode).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeTruthy();
    });

    it("rejects a missing title", async () => {
      const res = await request(app).post("/api/tasks").send({});
      expect(res.statusCode).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  // ── GET /api/tasks ─────────────────────────────────────────────────────────

  describe("GET /api/tasks", () => {
    it("returns an array of tasks", async () => {
      const res = await request(app).get("/api/tasks");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ── PATCH /api/tasks/:id ───────────────────────────────────────────────────

  describe("PATCH /api/tasks/:id", () => {
    it("marks a task as completed", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdId}`)
        .send({ completed: true });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.completed).toBe(true);
    });

    it("updates a task title", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdId}`)
        .send({ title: "Buy organic groceries" });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe("Buy organic groceries");
    });

    it("returns 404 for unknown id", async () => {
      const res = await request(app)
        .patch("/api/tasks/nonexistent-id")
        .send({ completed: true });
      expect(res.statusCode).toBe(404);
    });
  });

  // ── DELETE /api/tasks/:id ──────────────────────────────────────────────────

  describe("DELETE /api/tasks/:id", () => {
    it("deletes a task", async () => {
      const res = await request(app).delete(`/api/tasks/${createdId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(createdId);
    });

    it("returns 404 for already-deleted task", async () => {
      const res = await request(app).delete(`/api/tasks/${createdId}`);
      expect(res.statusCode).toBe(404);
    });
  });
});
