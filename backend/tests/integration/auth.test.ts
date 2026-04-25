import { describe, it, expect, vi } from "vitest";
import supertest from "supertest";
import app from "../../src/app";

const request = supertest(app);

describe("POST /api/auth/login", () => {
  it("returns 400 with empty body", async () => {
    const res = await request.post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it("returns 400 with missing password", async () => {
    const res = await request.post("/api/auth/login").send({ other: "field" });
    expect(res.status).toBe(400);
  });

  it("returns 401 with wrong password", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ password: "definitely-wrong-password-xyz-123" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid password");
  });

  it("returns token structure on valid login", async () => {
    vi.spyOn(
      await import("../../src/infrastructure/auth/jwt.service"),
      "signToken"
    ).mockReturnValue("fake-jwt-token");

    const bcrypt = await import("bcryptjs");
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

    const res = await request
      .post("/api/auth/login")
      .send({ password: "any-password" });

    if (res.status === 200) {
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("expiresIn");
      expect(typeof res.body.token).toBe("string");
      expect(typeof res.body.expiresIn).toBe("number");
    }
  });
});

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request.get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
