async function getAllClasses(req, res) {
    try {
        const classes = await req.prisma.classe.findMany({
            include: {
                enseignant: true,
                etudiants: true,
            },
        });
        res.json.status(200).json(classes);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des classes",
            error: error.message,
        });
    }
}

async function getClasseById(req, res) {
    try {
        const { id } = req.params;
        const classe = await req.prisma.classe.findUnique({
            where: { classe_id: parseInt(id) },
            include: {
                enseignant: true,
                etudiants: true,
            },
        });

        if (!classe) {
            return res.status(404).json({ message: "Classe non trouvée" });
        }

        res.status(200).json(classe);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de la classe",
            error: error.message,
        });
    }
}

async function createNewClasse(req, res) {
    try {
        const { nom, niveau, enseignant_id } = req.body;

        const enseignantExiste = await req.prisma.enseignant.findUnique({
            where: { enseignant_id: enseignant_id },
        });

        if (!enseignantExiste) {
            return res
                .status(400)
                .json({ message: "L'enseignant spécifié n'existe pas" });
        }

        const nouvelleClasse = await req.prisma.classe.create({
            data: {
                nom,
                niveau,
                enseignant_id,
            },
        });

        res.status(201).json(nouvelleClasse);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création de la classe",
            error: error.message,
        });
    }
}

async function modifyClasse(req, res) {
    try {
        const { id } = req.params;
        const { nom, niveau, enseignant_id } = req.body;

        const classeExiste = await req.prisma.classe.findUnique({
            where: { classe_id: parseInt(id) },
        });

        if (!classeExiste) {
            return res.status(404).json({ message: "Classe non trouvée" });
        }

        if (enseignant_id) {
            const enseignantExiste = await req.prisma.enseignant.findUnique({
                where: { enseignant_id: enseignant_id },
            });

            if (!enseignantExiste) {
                return res
                    .status(400)
                    .json({ message: "L'enseignant spécifié n'existe pas" });
            }
        }

        const classeModifiee = await req.prisma.classe.update({
            where: { classe_id: parseInt(id) },
            data: {
                ...(nom && { nom }),
                ...(niveau && { niveau }),
                ...(enseignant_id && { enseignant_id }),
            },
        });

        res.status(200).json(classeModifiee);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la modification de la classe",
            error: error.message,
        });
    }
}

async function deleteClasse(req, res) {
    try {
        const { id } = req.params;

        const classeExiste = await req.prisma.classe.findUnique({
            where: { classe_id: parseInt(id) },
        });

        if (!classeExiste) {
            return res.status(404).json({ message: "Classe non trouvée" });
        }

        const etudiantsAssocies = await req.prisma.etudiant.count({
            where: { classe_id: parseInt(id) },
        });

        if (etudiantsAssocies > 0) {
            return res.status(400).json({
                message:
                    "Impossible de supprimer la classe. Des étudiants y sont associés.",
            });
        }

        await req.prisma.classe.delete({
            where: { classe_id: parseInt(id) },
        });

        res.status(200).json({ message: "Classe supprimée avec succès" });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de la classe",
            error: error.message,
        });
    }
}

module.exports = {
    getAllClasses,
    getClasseById,
    createNewClasse,
    modifyClasse,
    deleteClasse,
};
