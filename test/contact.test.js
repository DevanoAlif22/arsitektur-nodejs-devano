import supertest from "supertest";
import { logger } from "../src/application/logging.js";
import {
  removeAllTestContact,
  removeUserTest,
  createUserTest,
  createTestContact,
  getTestContact,
  createManyTestContact,
} from "./test-util.js";
import { web } from "../src/application/web.js";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can create new contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "test",
        last_name: "test",
        email: "test@gmail.com",
        phone: "12345",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("test");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.phone).toBe("12345");
  });

  it("should reject if request is not valid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "test",
        email: "test",
        phone: "1234567891011121314151617181920",
      });

    expect(result.status).toBe(400);
    expect(result.body.status).toBe("Error");
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can get contact", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + contact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.first_name).toBe(contact.first_name);
    expect(result.body.data.last_name).toBe(contact.last_name);
    expect(result.body.data.email).toBe(contact.email);
    expect(result.body.data.phone).toBe(contact.phone);
  });

  it("should 404 if id is not found", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + (contact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("PUT /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
  });
  afterEach(async () => {
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can update contact", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send({
        first_name: "testlagi",
        last_name: "testlagi",
        email: "testlagi@gmail.com",
        phone: "11111",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(contact.id);
    expect(result.body.data.first_name).toBe("testlagi");
    expect(result.body.data.last_name).toBe("testlagi");
    expect(result.body.data.email).toBe("testlagi@gmail.com");
    expect(result.body.data.phone).toBe("11111");
  });

  it("should can update contact only change phone and first_name", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + contact.id)
      .set("Authorization", "test")
      .send({
        first_name: "testlagi",
        phone: "22222",
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.first_name).toBe("testlagi");
    expect(result.body.data.last_name).toBe("test");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.phone).toBe("22222");
  });

  it("should reject update contact if id not found", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + (contact.id + 1))
      .set("Authorization", "test")
      .send({
        first_name: "testlagi",
        phone: "22222",
      });

    expect(result.status).toBe(404);
    expect(result.body.status).toBe("Error");
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createUserTest();
    await createTestContact();
  });
  afterEach(async () => {
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can remove contact", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + contact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");
  });

  it("should 404 if id is not found", async () => {
    const contact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + (contact.id + 1))
      .set("Authorization", "test");

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await createUserTest();
    await createManyTestContact();
  });
  afterEach(async () => {
    await removeAllTestContact();
    await removeUserTest();
  });

  it("should can search contact without parameter", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_items).toBe(15);
  });
  it("should can search contact to page 2", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .query({
        page: 2,
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_items).toBe(15);
  });
  it("should can search contact using name", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .query({
        name: "test 10",
      })
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_items).toBe(1);
  });
});
