-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Funcionario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "chavePix" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "contato" TEXT NOT NULL,

    CONSTRAINT "Funcionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalarioMensal" (
    "id" SERIAL NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "funcionarioId" INTEGER NOT NULL,
    "salarioBase" DOUBLE PRECISION NOT NULL,
    "horasExtras" DOUBLE PRECISION NOT NULL,
    "faltas" DOUBLE PRECISION NOT NULL,
    "descontos" DOUBLE PRECISION NOT NULL,
    "extras" DOUBLE PRECISION NOT NULL,
    "bonus" DOUBLE PRECISION NOT NULL,
    "salarioTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalarioMensal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficio" (
    "id" SERIAL NOT NULL,
    "cafe" DOUBLE PRECISION NOT NULL,
    "almoco" DOUBLE PRECISION NOT NULL,
    "passagem" DOUBLE PRECISION NOT NULL,
    "salarioMensalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Beneficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "desc" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "agendaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SalarioMensal_mes_ano_funcionarioId_key" ON "SalarioMensal"("mes", "ano", "funcionarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficio_salarioMensalId_key" ON "Beneficio"("salarioMensalId");

-- AddForeignKey
ALTER TABLE "SalarioMensal" ADD CONSTRAINT "SalarioMensal_funcionarioId_fkey" FOREIGN KEY ("funcionarioId") REFERENCES "Funcionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficio" ADD CONSTRAINT "Beneficio_salarioMensalId_fkey" FOREIGN KEY ("salarioMensalId") REFERENCES "SalarioMensal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_agendaId_fkey" FOREIGN KEY ("agendaId") REFERENCES "Agenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
