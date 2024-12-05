const express = require("express");
const router = express.Router();
const controller = require("../controllers/classesController");

router.get("/", controller.getAllClasses);
router.get("/:id", controller.getClasseById);

router.post("/", controller.createNewClasse);

router.put("/:id", controller.modifyClasse);

router.delete("/:id", controller.deleteClasse);

module.exports = router;
