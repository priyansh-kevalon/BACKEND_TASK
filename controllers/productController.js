const Product = require("../models/Product");
const ProductMaster = require("../models/ProductMaster");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidId, updateFields } = require("../utils/helpers");

// ================================
// PRODUCT MASTER
// ================================

// CREATE PRODUCT MASTER
const createProductMaster = asyncHandler(async (req, res) => {
    const {
        name,
        image,
        category,
        categoryId,
        description,
    } = req.body;

    if (!name || !name.trim()) {
        throw new AppError("Product name and category are required", 400);
    }

    if (!category || !category.trim()) {
        throw new AppError("Product name and category are required", 400);
    }

    const productMaster = await ProductMaster.create({
        name: name.trim(),
        image,
        category: category.trim(),
        categoryId,
        description,
    });

    res.status(201).json({
        message: "Product Master created successfully",
        productMaster,
    });
});

// GET ALL PRODUCT MASTERS
const getProductMasters = asyncHandler(async (req, res) => {
    const products = await ProductMaster.find().sort({
        createdAt: -1,
    });

    res.status(200).json(products);
});

// GET SINGLE PRODUCT MASTER
const getProductMasterById = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid product master ID", 400);
    }

    const product = await ProductMaster.findById(req.params.id);

    if (!product) {
        throw new AppError("Product Master not found", 404);
    }

    res.status(200).json(product);
});

// UPDATE PRODUCT MASTER
const updateProductMaster = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid product master ID", 400);
    }

    const product = await ProductMaster.findById(req.params.id);

    if (!product) {
        throw new AppError("Product Master not found", 404);
    }

    const {
        name,
        image,
        category,
        categoryId,
        description,
    } = req.body;

    updateFields(product, { name, image, category, categoryId, description }, [
        "name",
        "image",
        "category",
        "categoryId",
        "description",
    ]);

    product.name = product.name.trim();
    product.category = product.category.trim();

    await product.save();

    res.status(200).json({
        message: "Product Master updated successfully",
        product,
    });
});

// DELETE PRODUCT MASTER
const deleteProductMaster = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid product master ID", 400);
    }

    const product = await ProductMaster.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new AppError("Product Master not found", 404);
    }

    res.status(200).json({
        message: "Product Master deleted successfully",
    });
});

// ================================
// PRODUCT
// ================================

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
    const {
        productName,
        productImage,
        productDescription,
        price,
    } = req.body;

    if (!productName || !productName.trim()) {
        throw new AppError("Product name is required", 400);
    }

    const product = await Product.create({
        productName: productName.trim(),
        productImage,
        productDescription,
        price,
    });

    res.status(201).json({
        message: "Product created successfully",
        product,
    });
});

// GET ALL PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({
        createdAt: -1,
    });

    res.status(200).json(products);
});

// GET SINGLE PRODUCT
const getProductById = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid product ID", 400);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json(product);
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid product ID", 400);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    const {
        productName,
        productImage,
        productDescription,
        price,
    } = req.body;

    updateFields(product, { productName, productImage, productDescription, price }, [
        "productName",
        "productImage",
        "productDescription",
        "price",
    ]);

    if (product.productName !== undefined) {
        product.productName = product.productName.trim();
    }

    await product.save();

    res.status(200).json({
        message: "Product updated successfully",
        product,
    });
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
        throw new AppError("Invalid product ID", 400);
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json({
        message: "Product deleted successfully",
    });
});

module.exports = {
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
};