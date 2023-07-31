import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  createContactValidation,
  getContactValidation,
  removeContactValidation,
  updateContactValidation,
  searchContactValidation,
} from "../validation/contact-validation";
import { validate } from "../validation/validation.js";

const create = async (user, request) => {
  const contact = await validate(createContactValidation, request);

  contact.username = user.username;

  return prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const update = async (user, request) => {
  const contact = validate(updateContactValidation, request);

  const count = await prismaClient.contact.count({
    where: {
      id: contact.id,
      username: user.username,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "Contact is not found");
  }

  const data = {};
  data.id = contact.id;
  data.first_name = contact.first_name;
  if (contact.last_name) {
    data.last_name = contact.last_name;
  }
  if (contact.email) {
    data.email = contact.email;
  }
  if (contact.phone) {
    data.phone = contact.phone;
  }

  return prismaClient.contact.update({
    where: {
      id: contact.id,
    },
    data: data,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });
};

const get = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      id: contactId,
      username: user.username,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact is not found");
  }

  return contact;
};

const remove = async (user, contactId) => {
  contactId = validate(removeContactValidation, contactId);
  const count = await prismaClient.contact.count({
    where: {
      id: contactId,
      username: user.username,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  return prismaClient.contact.delete({
    where: {
      id: contactId,
      username: user.username,
    },
  });
};

const search = async (user, request) => {
  request = await validate(searchContactValidation, request);

  // 1 ((page -1) * size) = 0
  // 2 ((page -1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filter = [];

  filter.push({
    username: user.username,
  });

  if (request.name) {
    filter.push({
      OR: [
        {
          first_name: {
            contains: request.name,
          },
        },
        {
          last_name: {
            contains: request.name,
          },
        },
      ],
    });
  }

  if (request.email) {
    filter.push({
      email: {
        contains: request.email,
      },
    });
  }

  if (request.phone) {
    filter.push({
      phone: {
        contains: request.phone,
      },
    });
  }
  const contacts = await prismaClient.contact.findMany({
    where: {
      AND: filter,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.contact.count({
    where: {
      AND: filter,
    },
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_items: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

export default {
  create,
  get,
  update,
  remove,
  search,
};
