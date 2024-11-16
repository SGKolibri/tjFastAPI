"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/modules/user/user.controller.ts
var user_controller_exports = {};
__export(user_controller_exports, {
  getUserByIdHandler: () => getUserByIdHandler,
  getUsersHandler: () => getUsersHandler,
  registerUserHandler: () => registerUserHandler
});
module.exports = __toCommonJS(user_controller_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/user/user.services.ts
function createUser(input) {
  return __async(this, null, function* () {
    const { email, name } = input;
    const user = yield prisma_default.user.create({
      data: {
        email,
        name
      }
    });
    return user;
  });
}
function findUsers() {
  return __async(this, null, function* () {
    return prisma_default.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
  });
}
function findUserById(id) {
  return __async(this, null, function* () {
    return prisma_default.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true
      }
    });
  });
}

// src/modules/user/user.controller.ts
function registerUserHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const user = yield createUser(body);
      return reply.status(201).send(user);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getUsersHandler(request, reply) {
  return __async(this, null, function* () {
    const users = yield findUsers();
    return reply.send(users);
  });
}
function getUserByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const user = yield findUserById(Number(id));
      if (!user) return reply.status(404).send({ message: "User not found" });
      return reply.status(200).send(user);
    } catch (e) {
      console.error(e);
      return;
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserByIdHandler,
  getUsersHandler,
  registerUserHandler
});
