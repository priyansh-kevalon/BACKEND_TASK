const express = require("express");

const {
    createProductMaster,
    getProductMasters,
    getProductMasterById,
    updateProductMaster,
    deleteProductMaster,

    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// PRODUCT MASTER
router.post("/master", createProductMaster);
router.get("/master", getProductMasters);
router.get("/master/:id", getProductMasterById);
router.put("/master/:id", updateProductMaster);
router.delete("/master/:id", deleteProductMaster);

// PRODUCT
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;