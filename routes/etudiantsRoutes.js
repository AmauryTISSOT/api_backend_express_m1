const express = require("express");
const router = express.Router();
const controller = require("../controllers/etudiantsController");

router.get("/", controller.getAllEtudiants);
router.get("/classe/:id", controller.getAllEtudiantsByClasses);
router.get("/search", controller.getAllEtudiantsByName);

router.post("/", controller.createNewEtudiant);

router.put("/:id", controller.modifyEtudiant);

router.delete("/:id", controller.deleteEtudiant);

module.exports = router;
