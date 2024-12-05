async function getAllEnseignants(req, res) {
    try {
        const enseignants = await req.prisma.enseignant.findMany({
            include: {
                classe: true,
            },
        });
        res.status(200).json(enseignants);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des enseignants",
            error: error.message,
        });
    }
}

async function getAllEnseignantsByMatiere(req, res) {
    try {
        const { matiere } = req.query;
        const enseignants = await req.prisma.enseignant.findMany({
            where: {
                matiere: { contains: matiere, mode: "insensitive" },
            },
            include: {
                classe: true,
            },
        });

        if (enseignants.length === 0) {
            return res.status(404).json({
                message: "Aucun enseignant trouvé pour cette matière",
            });
        }

        res.status(200).json(enseignants);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la recherche des enseignants",
            error: error.message,
        });
    }
}

async function createNewEnseignants(req, res) {
    try {
        const { nom, prenom, email, matiere } = req.body;

        const nouvelEnseignant = await req.prisma.enseignant.create({
            data: {
                nom,
                prenom,
                email,
                matiere,
            },
        });

        res.status(201).json(nouvelEnseignant);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Un enseignant avec cet email existe déjà",
            });
        }

        res.status(500).json({
            message: "Erreur lors de la création de l'enseignant",
            error: error.message,
        });
    }
}

async function modifyEnseignants(req, res) {
    try {
        const { id } = req.params;
        const { nom, prenom, email, matiere } = req.body;

        const enseignantExiste = await req.prisma.enseignant.findUnique({
            where: { enseignant_id: parseInt(id) },
        });

        if (!enseignantExiste) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }

        const enseignantModifie = await req.prisma.enseignant.update({
            where: { enseignant_id: parseInt(id) },
            data: {
                ...(nom && { nom }),
                ...(prenom && { prenom }),
                ...(email && { email }),
                ...(matiere && { matiere }),
            },
        });

        res.json(enseignantModifie);
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Un enseignant avec cet email existe déjà",
            });
        }

        res.status(500).json({
            message: "Erreur lors de la modification de l'enseignant",
            error: error.message,
        });
    }
}

async function deleteEnseignants(req, res) {
    try {
        const { id } = req.params;

        const enseignantExiste = await req.prisma.enseignant.findUnique({
            where: { enseignant_id: parseInt(id) },
        });

        if (!enseignantExiste) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
        }

        const classesAssociees = await req.prisma.classe.count({
            where: { enseignant_id: parseInt(id) },
        });

        if (classesAssociees > 0) {
            return res.status(400).json({
                message:
                    "Impossible de supprimer l'enseignant. Des classes lui sont associées.",
            });
        }

        await req.prisma.enseignant.delete({
            where: { enseignant_id: parseInt(id) },
        });

        res.status(200).json({ message: "Enseignant supprimé avec succès" });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'enseignant",
            error: error.message,
        });
    }
}

module.exports = {
    getAllEnseignants,
    getAllEnseignantsByMatiere,
    createNewEnseignants,
    modifyEnseignants,
    deleteEnseignants,
};
