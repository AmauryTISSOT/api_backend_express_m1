const express = require("express");
const router = express.Router();
const controller = require("../controllers/enseignantsController");

router.get("/", controller.getAllEnseignants);
router.get("/search", controller.getAllEnseignantsByMatiere);

router.post("/", controller.createNewEnseignants);

router.put("/:id", controller.modifyEnseignants);

router.delete("/:id", controller.deleteEnseignants);

module.exports = router;
