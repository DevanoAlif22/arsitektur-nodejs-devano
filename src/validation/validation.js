// tempat validasi prisma
import { ResponseError } from "../error/response-error.js";

const validate = function (prisma, request) {
  const result = prisma.validate(request, {
    abortEarly: false,
    // jaga-jaga biar tidak ada yang memasukkan field tambahan
    allowUnknown: false,
  });
  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };
