async function getAllEtudiants(req, res) {
    try {
        const etudiants = await req.prisma.etudiant.findMany({
            include: {
                classe: true,
            },
        });
        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des étudiants",
            error: error.message,
        });
    }
}

async function getAllEtudiantsByClasses(req, res) {
    try {
        const { id } = req.params;
        const etudiants = await req.prisma.etudiant.findMany({
            where: {
                classe_id: parseInt(id),
            },
            include: {
                classe: true,
            },
        });

        if (etudiants.length === 0) {
            return res
                .status(404)
                .json({ message: "Aucun étudiant trouvé pour cette classe" });
        }

        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des étudiants par classe",
            error: error.message,
        });
    }
}

async function getAllEtudiantsByName(req, res) {
    try {
        const { nom } = req.query;
        const etudiants = await req.prisma.etudiant.findMany({
            where: {
                OR: [
                    { nom: { contains: nom, mode: "insensitive" } },
                    { prenom: { contains: nom, mode: "insensitive" } },
                ],
            },
            include: {
                classe: true,
            },
        });

        if (etudiants.length === 0) {
            return res
                .status(404)
                .json({ message: "Aucun étudiant trouvé avec ce nom" });
        }

        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la recherche des étudiants",
            error: error.message,
        });
    }
}

async function createNewEtudiant(req, res) {
    try {
        const { nom, prenom, age, email, classe_id } = req.body;

        const classeExiste = await req.prisma.classe.findUnique({
            where: { classe_id: classe_id },
        });

        if (!classeExiste) {
            return res
                .status(400)
                .json({ message: "La classe spécifiée n'existe pas" });
        }

        const nouvelEtudiant = await req.prisma.etudiant.create({
            data: {
                nom,
                prenom,
                age,
                email,
                classe_id,
            },
        });

        res.status(201).json(nouvelEtudiant);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Un étudiant avec cet email existe déjà",
            });
        }

        res.status(500).json({
            message: "Erreur lors de la création de l'étudiant",
            error: error.message,
        });
    }
}

async function modifyEtudiant(req, res) {
    try {
        const { id } = req.params;
        const { nom, prenom, age, email, classe_id } = req.body;

        const etudiantExiste = await req.prisma.etudiant.findUnique({
            where: { etudiant_id: parseInt(id) },
        });

        if (!etudiantExiste) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        if (classe_id) {
            const classeExiste = await req.prisma.classe.findUnique({
                where: { classe_id: classe_id },
            });

            if (!classeExiste) {
                return res
                    .status(400)
                    .json({ message: "La classe spécifiée n'existe pas" });
            }
        }

        const etudiantModifie = await req.prisma.etudiant.update({
            where: { etudiant_id: parseInt(id) },
            data: {
                ...(nom && { nom }),
                ...(prenom && { prenom }),
                ...(age && { age }),
                ...(email && { email }),
                ...(classe_id && { classe_id }),
            },
        });

        res.json(etudiantModifie);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Un étudiant avec cet email existe déjà",
            });
        }

        res.status(500).json({
            message: "Erreur lors de la modification de l'étudiant",
            error: error.message,
        });
    }
}

async function deleteEtudiant(req, res) {
    try {
        const { id } = req.params;

        const etudiantExiste = await req.prisma.etudiant.findUnique({
            where: { etudiant_id: parseInt(id) },
        });

        if (!etudiantExiste) {
            return res.status(404).json({ message: "Étudiant non trouvé" });
        }

        await req.prisma.etudiant.delete({
            where: { etudiant_id: parseInt(id) },
        });

        res.status(200).json({ message: "Étudiant supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'étudiant",
            error: error.message,
        });
    }
}

module.exports = {
    getAllEtudiants,
    getAllEtudiantsByClasses,
    getAllEtudiantsByName,
    createNewEtudiant,
    modifyEtudiant,
    deleteEtudiant,
};
