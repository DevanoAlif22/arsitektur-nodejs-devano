import { prismaClient } from "../application/database.js";

// authentikasi login
export const authMiddleware = async (req, res, next) => {
  // cek apakkah ada data token
  const token = req.get("Authorization");
  if (!token) {
    res
      .status(401)
      .json({
        code: "401",
        status: "Error",
        message: "Unauthorized",
      })
      .end();
  } else {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    // cek kalau ternyata usernya tidak ada dari token yang dikirim
    if (!user) {
      res
        .status(401)
        .json({
          code: "401",
          status: "Error",
          message: "Unauthorized",
        })
        .end();
    } else {
      req.user = user;
      next();
    }
  }
};
