import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";
import { logger } from "../src/application/logging.js";

export const removeUserTest = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createUserTest = async () => {
  await prismaClient.user.create({
    data: {
      username: "test",
      password: await bcrypt.hash("rahasia", 10),
      name: "test",
      token: "test",
    },
  });
};

export const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "test",
    },
  });
};

export const removeAllTestContact = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: "test",
      first_name: "test",
      last_name: "test",
      email: "test@gmail.com",
      phone: "12345",
    },
  });
};

export const createManyTestContact = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.contact.create({
      data: {
        username: "test",
        first_name: `test ${i}`,
        last_name: `test ${i}`,
        email: `test${i}@gmail.com`,
        phone: `12345${i}`,
      },
    });
  }
};
export const createManyTestAddress = async (id) => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.address.create({
      data: {
        street: `test${i}`,
        city: `test`,
        province: `test${i}`,
        country: `test`,
        postal_code: `test${i}`,
        contact_id: id,
      },
    });
  }
};

export const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: "test",
    },
  });
};

export const removeTestAddress = async () => {
  await prismaClient.address.deleteMany({
    where: {
      OR: [
        {
          country: "testlagi",
        },
        {
          country: "test",
        },
      ],
    },
  });
};
export const removeTestUpdateAddress = async () => {
  await prismaClient.address.deleteMany({
    where: {
      country: "testlagi",
    },
  });
};

export const createTestAddress = async () => {
  const contact = await getTestContact();
  await prismaClient.address.create({
    data: {
      street: "test",
      city: "test",
      province: "test",
      country: "test",
      postal_code: "test",
      contact_id: contact.id,
    },
  });
};

export const getTestAddress = async () => {
  return prismaClient.address.findFirst({
    where: {
      country: "test",
    },
  });
};
export default {
  removeUserTest,
  createUserTest,
  removeAllTestContact,
  createTestContact,
  getTestContact,
  createManyTestContact,
  removeTestAddress,
  createManyTestAddress,
  removeTestUpdateAddress,
};
