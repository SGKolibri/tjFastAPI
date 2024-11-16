"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/modules/admin/admin.route.ts
var admin_route_exports = {};
__export(admin_route_exports, {
  default: () => adminRoutes
});
module.exports = __toCommonJS(admin_route_exports);

// src/utils/hash.ts
var import_crypto = __toESM(require("crypto"));
function hashPassword(password) {
  const salt = import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.pbkdf2Sync(password, salt, 1e3, 64, "sha512").toString("hex");
  return { salt, hash };
}
function verifyPassword({
  candidatePassword,
  salt,
  hash
}) {
  const candidateHash = import_crypto.default.pbkdf2Sync(candidatePassword, salt, 1e3, 64, "sha512").toString("hex");
  return candidateHash === hash;
}

// src/app.ts
var import_fastify = __toESM(require("fastify"));
var import_jwt = __toESM(require("@fastify/jwt"));
var import_cors = __toESM(require("@fastify/cors"));

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
function userRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        preHandler: [server2.authenticate],
        schema: {
          body: $ref("createUserSchema"),
          response: {
            201: $ref("createUserResponseSchema")
          }
        }
      },
      registerUserHandler
    );
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      getUsersHandler
    );
    server2.get(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      getUserByIdHandler
    );
  });
}
var user_route_default = userRoutes;

// src/modules/product/product.schema.ts
var import_zod2 = require("zod");
var import_fastify_zod2 = require("fastify-zod");
var productInput = {
  title: import_zod2.z.string(),
  content: import_zod2.z.string(),
  price: import_zod2.z.number()
};
var productGenerated = {
  id: import_zod2.z.number(),
  createdAt: import_zod2.z.string(),
  updatedAt: import_zod2.z.string()
};
var createProductSchema = import_zod2.z.object({
  title: import_zod2.z.string(),
  content: import_zod2.z.string(),
  price: import_zod2.z.number()
});
var productResponseSchema = import_zod2.z.object(__spreadProps(__spreadValues(__spreadValues({}, productGenerated), productInput), {
  owner: import_zod2.z.object({
    id: import_zod2.z.number(),
    email: import_zod2.z.string(),
    name: import_zod2.z.string()
  })
}));
var productsResponseSchema = import_zod2.z.array(productResponseSchema);
var { schemas: productSchemas, $ref: $ref2 } = (0, import_fastify_zod2.buildJsonSchemas)(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema
  },
  { $id: "ProductSchema" }
);

// src/modules/product/product.services.ts
function createProduct(data) {
  return __async(this, null, function* () {
    return prisma_default.product.create({
      data,
      // include the owner information in the response
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  });
}
function getProducts() {
  return __async(this, null, function* () {
    return prisma_default.product.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  });
}
function getProductById(id) {
  return __async(this, null, function* () {
    return prisma_default.product.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        title: true,
        content: true,
        price: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
  });
}
function deleteProductById(id) {
  return __async(this, null, function* () {
    return prisma_default.product.delete({
      where: {
        id
      }
    });
  });
}

// src/modules/product/product.controller.ts
function createProductHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const product = yield createProduct(__spreadProps(__spreadValues({}, body), { ownerId: request.user.id }));
      return reply.status(201).send(product);
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getProductsHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const products = yield getProducts();
      return reply.send(products);
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getProductByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    try {
      const product = yield getProductById(Number(id));
      return reply.send(product);
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function deleteProductByIdHandler(request, reply) {
  return __async(this, null, function* () {
    const { id } = request.params;
    const product = yield getProductById(Number(id));
    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }
    try {
      yield deleteProductById(Number(id));
      return reply.status(200).send({
        message: "Product deleted successfully",
        deletedProduct: product
      });
    } catch (e) {
      console.log(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/product/product.route.ts
function productRoutes(server2) {
  return __async(this, null, function* () {
    server2.post(
      "/",
      {
        preHandler: [server2.authenticate],
        schema: {
          body: $ref2("createProductSchema"),
          response: {
            201: $ref2("productResponseSchema")
          }
        }
      },
      createProductHandler
    );
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate],
        schema: {
          response: {
            200: $ref2("productsResponseSchema")
          }
        }
      },
      getProductsHandler
    );
    server2.get(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      getProductByIdHandler
    );
    server2.delete(
      "/:id",
      {
        preHandler: [server2.authenticate]
      },
      deleteProductByIdHandler
    );
  });
}
var product_route_default = productRoutes;

// src/modules/admin/admin.schemas.ts
var import_zod3 = require("zod");
var import_fastify_zod3 = require("fastify-zod");
var creteAdminSchema = import_zod3.z.object({
  email: import_zod3.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  password: import_zod3.z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be at least 6 characters"
  }).min(6),
  name: import_zod3.z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
});
var createAdminResponseSchema = import_zod3.z.object({
  id: import_zod3.z.number(),
  email: import_zod3.z.string(),
  name: import_zod3.z.string()
});
var loginAdminSchema = import_zod3.z.object({
  email: import_zod3.z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  }).email(),
  password: import_zod3.z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string"
  })
});
var loginAdminResponseSchema = import_zod3.z.object({
  accessToken: import_zod3.z.string(),
  admin: import_zod3.z.object({
    id: import_zod3.z.number(),
    email: import_zod3.z.string(),
    name: import_zod3.z.string()
  })
});
var { schemas: adminSchemas, $ref: $ref3 } = (0, import_fastify_zod3.buildJsonSchemas)(
  {
    creteAdminSchema,
    createAdminResponseSchema,
    loginAdminSchema,
    loginAdminResponseSchema
  },
  { $id: "AdminSchema" }
);

// src/app.ts
var server = (0, import_fastify.default)();
server.register(import_cors.default, {
  origin: "*"
});
var jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}
server.register(import_jwt.default, {
  secret: jwtSecret
});
server.decorate(
  "authenticate",
  // name of the decorator
  (request, reply) => __async(void 0, null, function* () {
    try {
      yield request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  })
);
server.get("/", () => __async(void 0, null, function* () {
  return { healthcheck: "OK" };
}));
function main() {
  return __async(this, null, function* () {
    for (const schema of [...userSchemas, ...productSchemas, ...adminSchemas]) {
      server.addSchema(schema);
    }
    yield server.register(require("@fastify/swagger"));
    yield server.register(require("@fastify/swagger-ui"), {
      routePrefix: "/docs"
    });
    server.register(user_route_default, { prefix: "api/users" });
    server.register(product_route_default, { prefix: "api/products" });
    server.register(adminRoutes, { prefix: "api/admin" });
    try {
      yield server.listen({
        port: process.env.PORT ? Number(process.env.PORT) : 4567,
        host: "0.0.0.0"
      }).then(() => {
        console.log(
          `Server listening on ${process.env.PORT ? Number(process.env.PORT) : 4567}.`
        );
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
main();

// src/modules/admin/admin.services.ts
function createAdmin(input) {
  return __async(this, null, function* () {
    const _a = input, { password } = _a, rest = __objRest(_a, ["password"]);
    const { hash, salt } = hashPassword(password);
    const admin = yield prisma_default.admin.create({
      data: __spreadProps(__spreadValues({}, rest), { salt, password: hash })
    });
    return admin;
  });
}
function findAdmins() {
  return __async(this, null, function* () {
    return prisma_default.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
  });
}
function findAdminByEmail(email) {
  return __async(this, null, function* () {
    return prisma_default.admin.findUnique({
      where: { email }
    });
  });
}

// src/modules/admin/admin.controller.ts
function registerAdminHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const admin = yield createAdmin(body);
      return reply.status(201).send(admin);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Erro ao registrar admin" });
    }
  });
}
function loginAdminHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    const admin = yield findAdminByEmail(body.email);
    if (!admin)
      return reply.code(401).send({ message: "Invalid email or password" });
    const correctPassword = verifyPassword({
      candidatePassword: body.password,
      salt: admin.salt,
      hash: admin.password
    });
    if (correctPassword) {
      const _a = admin, { password, salt } = _a, rest = __objRest(_a, ["password", "salt"]);
      const accessToken = server.jwt.sign(rest, { expiresIn: "1h" });
      return reply.send({ accessToken, admin: rest });
    }
    return reply.code(401).send({ message: "Invalid email or password" });
  });
}
function getAdminsHandler(request, reply) {
  return __async(this, null, function* () {
    const admins = yield findAdmins();
    return reply.send(admins);
  });
}
function isAdminAuthenticatedHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      return reply.status(200).send({ message: "Authenticated" });
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/admin/admin.route.ts
function adminRoutes(server2) {
  return __async(this, null, function* () {
    server2.post("/", registerAdminHandler);
    server2.get(
      "/",
      {
        preHandler: [server2.authenticate]
      },
      getAdminsHandler
    );
    server2.post(
      "/login",
      {
        schema: {
          body: $ref3("loginAdminSchema"),
          response: {
            200: $ref3("loginAdminResponseSchema")
          }
        }
      },
      loginAdminHandler
    );
    server2.get(
      "/is-authenticated",
      {
        preHandler: [server2.authenticate]
      },
      isAdminAuthenticatedHandler
    );
  });
}
