// untuk handle API
import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    res.status(200).json({
      code: "200",
      status: "Success",
      request: "POST",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json({
      code: "200",
      status: "Success",
      request: "POST",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    // kita perlu buat middleware
    // karena untuk get user perlu token login
    const username = req.user.username;
    const result = await userService.get(username);
    res.status(200).json({
      code: "200",
      status: "Success",
      request: "GET",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const username = req.user.username;
    const request = req.body;
    request.username = username;
    const result = await userService.update(request);
    res.status(200).json({
      code: "200",
      status: "Success",
      request: "PATCH",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logout(req.user.username);
    res.status(200).json({
      code: "200",
      status: "Success",
      request: "DELETE",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  get,
  update,
  logout,
};
