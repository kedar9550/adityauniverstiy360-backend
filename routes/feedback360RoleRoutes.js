const express = require("express");
const router = express.Router();

const roleController = require("../controllers/feedback360RoleController");

router.post("/eligible", roleController.getEligibleRoles);
router.get("/all", roleController.getAllRoles);
router.post("/", roleController.addRole);
router.put("/:id", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

module.exports = router;