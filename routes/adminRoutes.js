const express = require("express");
const router = express.Router();
const adminController = require("./../controllers/adminController");

router
  .route("/")
  .post(adminController.createAdmin)
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

router.route("/:id").get(adminController.getAdminById);

module.exports = router;
