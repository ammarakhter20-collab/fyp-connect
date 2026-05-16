const express = require("express");
const router = express.Router();
const CatController = require("../../controllers/CoordinatorController/CatController");
const authMiddleware = require("../../middleware/auth");

router.post("/AddCategory", authMiddleware, CatController.createCategory);
router.get("/GetCategories", authMiddleware, CatController.getAllCategories);

router.delete(
  "/DelCategories/:id",
  authMiddleware,
  CatController.deleteCategoryById
);
router.patch(
  "/UpdCategory/:id",
  authMiddleware,
  CatController.updateCategoryById
);

module.exports = router;
