-- CreateTable
CREATE TABLE "etudiant" (
    "etudiant_id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "classe_id" INTEGER NOT NULL,

    CONSTRAINT "etudiant_pkey" PRIMARY KEY ("etudiant_id")
);

-- CreateTable
CREATE TABLE "enseignant" (
    "enseignant_id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matiere" TEXT NOT NULL,

    CONSTRAINT "enseignant_pkey" PRIMARY KEY ("enseignant_id")
);

-- CreateTable
CREATE TABLE "classe" (
    "classe_id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "enseignant_id" INTEGER NOT NULL,

    CONSTRAINT "classe_pkey" PRIMARY KEY ("classe_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "etudiant_email_key" ON "etudiant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "enseignant_email_key" ON "enseignant"("email");

-- AddForeignKey
ALTER TABLE "etudiant" ADD CONSTRAINT "etudiant_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("classe_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classe" ADD CONSTRAINT "classe_enseignant_id_fkey" FOREIGN KEY ("enseignant_id") REFERENCES "enseignant"("enseignant_id") ON DELETE RESTRICT ON UPDATE CASCADE;
