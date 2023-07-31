import supertest from "supertest";
import { web } from "../src/application/web.js";
import {
  createManyTestAddress,
  createTestAddress,
  createTestContact,
  createUserTest,
  getTestAddress,
  getTestContact,
  removeAllTestContact,
  removeTestAddress,
  removeTestUpdateAddress,
  removeUserTest,
} from "./test-util";
import { logger } from "../src/application/logging.js";

describe("POST /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
  });

  afterEach(async () => {
    await removeTestAddress();
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can create address", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .post("/api/contacts/" + contact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        street: "test",
        city: "test",
        province: "test",
        country: "test",
        postal_code: "test",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.street).toBe("test");
    expect(result.body.data.city).toBe("test");
    expect(result.body.data.country).toBe("test");
  });

  it("should can create address country only", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .post("/api/contacts/" + contact.id + "/addresses")
      .set("Authorization", "test")
      .send({
        country: "test",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.street).toBeNull();
    expect(result.body.data.city).toBeNull();
    expect(result.body.data.country).toBe("test");
  });

  it("should reject if id is not found", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .post("/api/contacts/" + (contact.id + 1) + "/addresses")
      .set("Authorization", "test")
      .send({
        country: "test",
      });

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeTestAddress();
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can get address", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.country).toBe("test");
  });

  it("should reject get address if contact id not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const result = await supertest(web)
      .get("/api/contacts/" + (contact.id + 1) + "/addresses/" + address.id)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });

  it("should reject get address if address id not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();
    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses/" + (address.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeTestAddress();
    await removeAllTestContact();
    await removeUserTest();
  });
  it("should can update address", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test")
      .send({
        street: "testlagi",
        city: "testlagi",
        province: "testlagi",
        country: "testlagi",
        postal_code: "testlagi",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("testlagi");
    expect(result.body.data.city).toBe("testlagi");
    expect(result.body.data.province).toBe("testlagi");
    expect(result.body.data.country).toBe("testlagi");
    expect(result.body.data.postal_code).toBe("testlagi");
  });
  it("should reject update address if id not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .put(
        "/api/contacts/" + (contact.id + 1) + "/addresses/" + (address.id + 1)
      )
      .set("Authorization", "test")
      .send({
        street: "testlagi",
        city: "testlagi",
        province: "testlagi",
        country: "testlagi",
        postal_code: "testlagi",
      });

    expect(result.status).toBe(404);
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async () => {
    await removeTestAddress();
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can remove address", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + contact.id + "/addresses/" + address.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("should reject remove address if id not found", async () => {
    const contact = await getTestContact();
    const address = await getTestAddress();

    const result = await supertest(web)
      .delete(
        "/api/contacts/" + (contact.id + 1) + "/addresses/" + (address.id + 1)
      )
      .set("Authorization", "test");
    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts/:contactId/addresses", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
  });

  afterEach(async () => {
    await removeTestAddress();
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can list address", async () => {
    const contact = await getTestContact();
    await createManyTestAddress(contact.id);

    const result = await supertest(web)
      .get("/api/contacts/" + contact.id + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(15);
  });

  it("should reject list address if id not found", async () => {
    const contact = await getTestContact();
    await createManyTestAddress(contact.id);

    const result = await supertest(web)
      .get("/api/contacts/" + (contact.id + 1) + "/addresses")
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});
