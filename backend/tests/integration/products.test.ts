import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/infrastructure/database/prisma.client";
import { signToken } from "../../src/infrastructure/auth/jwt.service";

const request = supertest(app);
const adminToken = signToken({ role: "admin" });

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.product.deleteMany();
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.product.deleteMany();
});

describe("GET /api/products", () => {
  it("returns only available products", async () => {
    await prisma.product.createMany({
      data: [
        {
          name: "P1",
          price: 30,
          category: "ANIME",
          imageUrl: "https://img.test/1.jpg",
          available: true,
        },
        {
          name: "P2",
          price: 20,
          category: "ANIMALS",
          imageUrl: "https://img.test/2.jpg",
          available: false,
        },
      ],
    });

    const res = await request.get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("P1");
    expect(res.body.total).toBe(1);
  });

  it("filters by category", async () => {
    await prisma.product.createMany({
      data: [
        {
          name: "Anime1",
          price: 30,
          category: "ANIME",
          imageUrl: "https://img.test/1.jpg",
          available: true,
        },
        {
          name: "Animal1",
          price: 20,
          category: "ANIMALS",
          imageUrl: "https://img.test/2.jpg",
          available: true,
        },
      ],
    });

    const res = await request.get("/api/products?category=ANIME");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("ANIME");
  });

  it("filters by price range", async () => {
    await prisma.product.createMany({
      data: [
        {
          name: "Cheap",
          price: 10,
          category: "ANIME",
          imageUrl: "https://img.test/1.jpg",
          available: true,
        },
        {
          name: "Mid",
          price: 30,
          category: "ANIME",
          imageUrl: "https://img.test/2.jpg",
          available: true,
        },
        {
          name: "Expensive",
          price: 80,
          category: "ANIME",
          imageUrl: "https://img.test/3.jpg",
          available: true,
        },
      ],
    });

    const res = await request.get("/api/products?minPrice=20&maxPrice=50");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("Mid");
  });

  it("serializes price as number not string", async () => {
    await prisma.product.create({
      data: {
        name: "P1",
        price: 35.5,
        category: "ANIME",
        imageUrl: "https://img.test/1.jpg",
        available: true,
      },
    });

    const res = await request.get("/api/products");

    expect(res.status).toBe(200);
    expect(typeof res.body.data[0].price).toBe("number");
    expect(res.body.data[0].price).toBe(35.5);
  });

  it("returns empty array when no products match", async () => {
    const res = await request.get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.total).toBe(0);
  });

  it("returns 400 with invalid category", async () => {
    const res = await request.get("/api/products?category=INVALID");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/products/:id", () => {
  it("returns product by id", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Pikachu",
        price: 35,
        category: "ANIME",
        imageUrl: "https://img.test/p.jpg",
        available: true,
      },
    });

    const res = await request.get(`/api/products/${product.id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Pikachu");
  });

  it("returns 404 for unavailable product", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Hidden",
        price: 35,
        category: "ANIME",
        imageUrl: "https://img.test/p.jpg",
        available: false,
      },
    });

    const res = await request.get(`/api/products/${product.id}`);
    expect(res.status).toBe(404);
  });

  it("returns 404 for non-existent id", async () => {
    const res = await request.get("/api/products/non-existent-id-xyz");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/admin/products", () => {
  it("creates product with valid data", async () => {
    const res = await request
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Totoro",
        price: 45,
        category: "ANIME",
        imageUrl: "https://img.test/t.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Totoro");
    expect(typeof res.body.price).toBe("number");
    expect(res.body.price).toBe(45);
  });

  it("returns 400 with invalid data", async () => {
    const res = await request
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "", price: -10 });

    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });

  it("returns 401 without token", async () => {
    const res = await request.post("/api/admin/products").send({ name: "Hacked" });
    expect(res.status).toBe(401);
  });

  it("returns 401 with invalid token", async () => {
    const res = await request
      .post("/api/admin/products")
      .set("Authorization", "Bearer invalid-token-xyz")
      .send({ name: "Hacked" });
    expect(res.status).toBe(401);
  });

  it("defaults available to true", async () => {
    const res = await request
      .post("/api/admin/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test",
        price: 20,
        category: "OTHERS",
        imageUrl: "https://img.test/t.jpg",
      });

    expect(res.status).toBe(201);
    expect(res.body.available).toBe(true);
  });
});

describe("PUT /api/admin/products/:id", () => {
  it("updates product fields", async () => {
    const product = await prisma.product.create({
      data: {
        name: "Old Name",
        price: 30,
        category: "ANIME",
        imageUrl: "https://img.test/1.jpg",
        available: true,
      },
    });

    const res = await request
      .put(`/api/admin/products/${product.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "New Name", price: 50 });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("New Name");
    expect(res.body.price).toBe(50);
  });

  it("updates availability", async () => {
    const product = await prisma.product.create({
      data: {
        name: "P1",
        price: 30,
        category: "ANIME",
        imageUrl: "https://img.test/1.jpg",
        available: true,
      },
    });

    const res = await request
      .put(`/api/admin/products/${product.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ available: false });

    expect(res.status).toBe(200);
    expect(res.body.available).toBe(false);
  });

  it("returns 404 for non-existent product", async () => {
    const res = await request
      .put("/api/admin/products/non-existent-id")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "New Name" });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/admin/products/:id", () => {
  it("deletes product and returns 204", async () => {
    const product = await prisma.product.create({
      data: {
        name: "ToDelete",
        price: 30,
        category: "ANIME",
        imageUrl: "https://img.test/1.jpg",
      },
    });

    const res = await request
      .delete(`/api/admin/products/${product.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);

    const found = await prisma.product.findUnique({ where: { id: product.id } });
    expect(found).toBeNull();
  });

  it("returns 404 for non-existent product", async () => {
    const res = await request
      .delete("/api/admin/products/non-existent-id")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

describe("GET /api/admin/products", () => {
  it("returns all products including unavailable", async () => {
    await prisma.product.createMany({
      data: [
        {
          name: "Available",
          price: 30,
          category: "ANIME",
          imageUrl: "https://img.test/1.jpg",
          available: true,
        },
        {
          name: "Unavailable",
          price: 20,
          category: "ANIMALS",
          imageUrl: "https://img.test/2.jpg",
          available: false,
        },
      ],
    });

    const res = await request
      .get("/api/admin/products")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
  });
});
