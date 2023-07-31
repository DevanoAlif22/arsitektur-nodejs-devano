import supertest from "supertest";
import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import { removeUserTest, createUserTest, getTestUser } from "./test-util.js";
import bcrypt from "bcrypt";
import { prismaClient } from "../src/application/database.js";

describe("POST /api/users", () => {
  //  agar data nya di hilangkan setelah testing
  afterEach(async () => {
    await removeUserTest();
  });

  // success testing
  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  // error testing invalid
  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      password: "",
      name: "",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.status).toBe("Error");
  });

  // testing error duplicate
  it("should can't register duplicate user", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    result = await supertest(web).post("/api/users").send({
      username: "test",
      password: "rahasia",
      name: "test",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.status).toBe("Error");
  });
});

describe("POST API /api/users/login", () => {
  // buat akun untuk testing
  beforeEach(async () => {
    await createUserTest();
  });

  //  agar data nya di hilangkan setelah testing
  afterEach(async () => {
    await removeUserTest();
  });

  it("should can login user", async () => {
    let result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "rahasia",
    });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
  });

  // gagal login permintaan tidak valid (semisal kosong)
  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.status).toBe("Error");
  });

  // username benar password salah
  it("should reject login if only password wrong is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "test",
      password: "salah",
    });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.status).toBe("Error");
  });

  // username salah password salah
  it("should reject login if only password wrong is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "salah",
      password: "salah",
    });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.status).toBe("Error");
  });
});

describe("/api/users/current", () => {
  // buat akun untuk testing
  beforeEach(async () => {
    await createUserTest();
  });

  //  agar data nya di hilangkan setelah testing
  afterEach(async () => {
    await removeUserTest();
  });

  // success get user with authorization token
  it("should can get user current", async () => {
    // cek token
    let result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "test");

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("test");
  });

  // error get uset without authorization token
  it("should reject if token is invalid ", async () => {
    // cek token
    let result = await supertest(web).get("/api/users/current");

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.status).toBe("Error");
  });
});

describe("should can update user", () => {
  // buat akun untuk testing
  beforeEach(async () => {
    await createUserTest();
  });

  //  agar data nya di hilangkan setelah testing
  afterEach(async () => {
    await removeUserTest();
  });

  it("success update name and password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "firashinta",
        password: "rahasialagi",
      });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("firashinta");

    const getUser = await getTestUser();
    expect(await bcrypt.compare("rahasialagi", getUser.password)).toBe(true);
  });

  it("Error update name and password if Unauthorized", async () => {
    const result = await supertest(web).patch("/api/users/current").send({
      name: "firashinta",
      password: "rahasialagi",
    });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.status).toBe("Error");

    const getUser = await getTestUser();
    expect(await bcrypt.compare("rahasialagi", getUser.password)).toBe(false);
  });
});

describe("DELETE /api/users/logout", () => {
  beforeEach(async () => {
    await createUserTest();
  });

  afterEach(async () => {
    await removeUserTest();
  });

  it.only("success logout user", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it("should reject if token is not invalid", async () => {
    const result = await supertest(web).delete("/api/users/logout");

    expect(result.status).toBe(401);
    expect(result.body.status).toBe("Error");
  });
});

// cek apakah usrname di ganti atau tidak
