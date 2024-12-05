const { PrismaClient } = require("@prisma/client");
const express = require("express");
const etudiantsRoutes = require("./routes/etudiantsRoutes");
const enseignantsRoutes = require("./routes/enseignantsRoutes");
const classesRoutes = require("./routes/classesRoutes");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

app.use("/etudiants", etudiantsRoutes);
app.use("/enseignants", enseignantsRoutes);
app.use("/classes", classesRoutes);

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("Connexion à la base de données réussie");

        app.listen(8080, () => {
            console.log("Serveur à l'écoute sur le port 8080");
        });
    } catch (error) {
        console.error("Erreur de connexion à la base de données :", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
