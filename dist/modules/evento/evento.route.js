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

// src/modules/evento/evento.route.ts
var evento_route_exports = {};
__export(evento_route_exports, {
  default: () => eventoRoutes
});
module.exports = __toCommonJS(evento_route_exports);

// src/utils/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
var prisma_default = prisma;

// src/modules/evento/evento.services.ts
function createEvento(input) {
  return __async(this, null, function* () {
    const { titulo, descricao, dataInicio, dataFim, allDay } = input;
    return prisma_default.evento.create({
      data: {
        titulo,
        descricao,
        dataInicio,
        dataFim,
        allDay
      }
    });
  });
}
function getEventos() {
  return __async(this, null, function* () {
    return prisma_default.evento.findMany({
      orderBy: {
        dataInicio: "asc"
      }
    });
  });
}
function deleteEvento(id) {
  return __async(this, null, function* () {
    return prisma_default.evento.delete({
      where: {
        id
      }
    });
  });
}

// src/modules/evento/evento.controller.ts
function createEventoHandler(request, reply) {
  return __async(this, null, function* () {
    const body = request.body;
    try {
      const evento = yield createEvento(body);
      return reply.status(201).send(evento);
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function getEventosHandler(request, reply) {
  return __async(this, null, function* () {
    try {
      const eventos = yield getEventos();
      return reply.status(200).send({ eventos });
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
function deleteEventoHandler(request, reply) {
  return __async(this, null, function* () {
    console.log("Delete evento handler");
    const { eventoId } = request.params;
    console.log("ID do evento: ", eventoId);
    try {
      yield deleteEvento(eventoId);
      return reply.status(204).send({ message: "Evento deletado com sucesso" });
    } catch (e) {
      console.error(e);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

// src/modules/evento/evento.route.ts
function eventoRoutes(server) {
  return __async(this, null, function* () {
    server.post(
      "/",
      {
        preHandler: [server.authenticate]
      },
      createEventoHandler
    );
    server.get(
      "/",
      {
        preHandler: [server.authenticate]
      },
      getEventosHandler
    );
    server.delete(
      "/:eventoId",
      {
        preHandler: [server.authenticate]
      },
      deleteEventoHandler
    );
    server.put(
      "/:eventoId",
      {
        preHandler: [server.authenticate]
      },
      (request, reply) => __async(this, null, function* () {
        return reply.status(501).send({ message: "Not Implemented" });
      })
    );
  });
}
