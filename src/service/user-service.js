// untuk logic aplikasi
import { request } from "express";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  loginUserValidation,
  registerUserValidation,
  getUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  // cek apakah username sudah terpakai atau belum
  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  // hash passwordnya
  user.password = await bcrypt.hash(user.password, 10);

  // buat user baru jika berhasil
  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

const login = async (request) => {
  // panggil validate dengan validation requestnya
  const loginRequest = validate(loginUserValidation, request);

  // cari apakah ada user yang di minta
  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  // jika user tidak ada
  if (!user) {
    throw new ResponseError(401, "Incorrect username or password");
  }

  // apakah password valid
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Incorrect username or password");
  }

  // jika semua benar kita beri token uuid
  const token = uuid().toString();

  // simpan ke database

  return await prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });
};

// get user
// perlu ambil username saja
const get = async (username) => {
  // panggil validate dengan validation requestnya
  username = validate(getUserValidation, username);
  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }

  return user;
};

// update user
const update = async (request) => {
  const user = validate(updateUserValidation, request);

  const count = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "User is not found");
  }

  const data = {};
  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  return await prismaClient.user.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });
};

// logout user
const logout = async (username) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "Username is not found");
  }

  return await prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

// pakai default karena lebig dari satu
export default {
  register,
  login,
  get,
  update,
  logout,
};
