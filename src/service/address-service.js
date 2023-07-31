import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";
import { ResponseError } from "../error/response-error.js";
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validation/address-validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

const create = async (user, request, contactId) => {
  contactId = validate(getContactValidation, contactId);
  const address = validate(createAddressValidation, request);
  const contact = await prismaClient.contact.findFirst({
    where: {
      id: parseInt(contactId),
      username: user.username,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact is not found");
  }

  const data = {};
  data.contact_id = contact.id;
  data.country = address.country;
  if (address.street) {
    data.street = address.street;
  }
  if (address.city) {
    data.city = address.city;
  }
  if (address.province) {
    data.province = address.province;
  }
  if (address.postal_code) {
    data.postal_code = address.postal_code;
  }
  return prismaClient.address.create({
    data: data,
    select: {
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const get = async (user, contactId, addressId) => {
  contactId = validate(getContactValidation, contactId);
  addressId = validate(getAddressValidation, addressId);

  //   logger.info("ini");
  //   logger.info(contactId);
  //   logger.info(addressId);

  const contact = await prismaClient.contact.count({
    where: {
      id: contactId,
      username: user.username,
    },
  });

  if (contact !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  const address = await prismaClient.address.findFirst({
    where: {
      id: addressId,
      contact_id: contactId,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "address is not found");
  }

  return address;
};

const update = async (user, request, contactId, addressId) => {
  contactId = await validate(getContactValidation, contactId);
  addressId = await validate(getAddressValidation, addressId);
  request = await validate(updateAddressValidation, request);

  const contact = await prismaClient.contact.count({
    where: {
      id: contactId,
      username: user.username,
    },
  });

  if (contact !== 1) {
    throw new ResponseError(404, "Contact is not found");
  }

  const address = await prismaClient.address.count({
    where: {
      id: addressId,
      contact_id: contactId,
    },
  });

  if (address !== 1) {
    throw new ResponseError(404, "Address is not found");
  }

  const data = {};
  data.id = addressId;
  data.contact_id = contactId;
  data.country = request.country;
  if (request.street) {
    data.street = request.street;
  }
  if (request.city) {
    data.city = request.city;
  }
  if (request.province) {
    data.province = request.province;
  }
  if (request.postal_code) {
    data.postal_code = request.postal_code;
  }
  return prismaClient.address.update({
    where: {
      id: addressId,
      contact_id: contactId,
    },
    data: data,
  });
};

const remove = async (user, contactId, addressId) => {
  contactId = await validate(getContactValidation, contactId);
  addressId = await validate(getAddressValidation, addressId);

  const contacts = await prismaClient.contact.count({
    where: {
      id: contactId,
      username: user.username,
    },
  });

  if (contacts !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  const address = await prismaClient.address.count({
    where: {
      id: addressId,
      contact_id: contactId,
    },
  });

  if (address !== 1) {
    throw new ResponseError(404, "address is not found");
  }

  return prismaClient.address.delete({
    where: {
      id: addressId,
      contact_id: contactId,
    },
  });
};

const list = async (user, contactId) => {
  contactId = await validate(getContactValidation, contactId);

  const contact = await prismaClient.contact.count({
    where: {
      id: contactId,
      username: user.username,
    },
  });
  if (contact !== 1) {
    throw new ResponseError(404, "contact is not found");
  }
  const address = await prismaClient.address.findMany({
    where: {
      contact_id: contactId,
    },
    select: {
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "address is not found");
  }

  return address;
};

export default {
  create,
  get,
  update,
  remove,
  list,
};
