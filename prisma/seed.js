const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    // Créer des enseignants
    const enseignant1 = await prisma.enseignant.create({
        data: {
            nom: "Dupont",
            prenom: "Marie",
            email: "marie.dupont@ecole.com",
            matiere: "Mathématiques",
        },
    });

    const enseignant2 = await prisma.enseignant.create({
        data: {
            nom: "Martin",
            prenom: "Jean",
            email: "jean.martin@ecole.com",
            matiere: "Français",
        },
    });

    // Créer des classes
    const classe1 = await prisma.classe.create({
        data: {
            nom: "6ème A",
            niveau: "6ème",
            enseignant_id: enseignant1.enseignant_id,
        },
    });

    const classe2 = await prisma.classe.create({
        data: {
            nom: "5ème B",
            niveau: "5ème",
            enseignant_id: enseignant2.enseignant_id,
        },
    });

    // Créer des étudiants
    await prisma.etudiant.createMany({
        data: [
            {
                nom: "Lefebvre",
                prenom: "Sophie",
                age: 12,
                email: "sophie.lefebvre@eleve.com",
                classe_id: classe1.classe_id,
            },
            {
                nom: "Dubois",
                prenom: "Lucas",
                age: 13,
                email: "lucas.dubois@eleve.com",
                classe_id: classe1.classe_id,
            },
            {
                nom: "Moreau",
                prenom: "Emma",
                age: 14,
                email: "emma.moreau@eleve.com",
                classe_id: classe2.classe_id,
            },
            {
                nom: "Garcia",
                prenom: "Thomas",
                age: 13,
                email: "thomas.garcia@eleve.com",
                classe_id: classe2.classe_id,
            },
        ],
    });

    console.log("Données de seed créées avec succès !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
