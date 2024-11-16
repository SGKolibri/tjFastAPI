"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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

// src/modules/user/user.route.ts
var user_route_exports = {};
__export(user_route_exports, {
  default: () => user_route_default
});
module.exports = __toCommonJS(user_route_exports);

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

// src/modules/user/user.schema.ts
var import_zod = require("zod");
var import_fastify_zod = require("fastify-zod");
var userCore = {
  email: import_zod.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  name: import_zod.z.string()
};
var createUserSchema = import_zod.z.object(__spreadValues({}, userCore));
var createUserResponseSchema = import_zod.z.object(__spreadValues({
  id: import_zod.z.number()
}, userCore));
var userResponseSchema = import_zod.z.object(__spreadValues({
  id: import_zod.z.number()
}, userCore));
var { schemas: userSchemas, $ref } = (0, import_fastify_zod.buildJsonSchemas)(
  {
    createUserSchema,
    createUserResponseSchema
    // loginUserSchema,
    // loginUserResponseSchema,
  },
  { $id: "UserSchema" }
);

// src/modules/user/user.route.ts
function userRoutes(server) {
  return __async(this, null, function* () {
    server.post(
      "/",
      {
        preHandler: [server.authenticate],
        schema: {
          body: $ref("createUserSchema"),
          response: {
            201: $ref("createUserResponseSchema")
          }
        }
      },
      registerUserHandler
    );
    server.get(
      "/",
      {
        preHandler: [server.authenticate]
      },
      getUsersHandler
    );
    server.get(
      "/:id",
      {
        preHandler: [server.authenticate]
      },
      getUserByIdHandler
    );
  });
}
var user_route_default = userRoutes;
