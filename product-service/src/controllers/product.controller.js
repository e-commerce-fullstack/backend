import mongoose from "mongoose";
import {
  addProduct,
  listProducts,
  listProductById,
  countProducts,
  removeProductService,
  listCategories,
  updatedProductService,
} from "../services/product.service.js";

export const updated = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    // 2. Check if a new file was uploaded via Multer/Cloudinary
    if (req.file) {
      updateData.image = req.file.path;
    }
    const result = await updatedProductService(id, updateData);

    // Check if the product existed
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found to update",
      });
    }

    // 3. Send a success response (Crucial!)
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    // 1. Safety Check: Ensure a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const product = await addProduct({
      ...req.body,
      // 2. With CloudinaryStorage, req.file.path is the FULL URL automatically
      image: req.file.path,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// delete
export const deleted = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await removeProductService(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3. Send a success response
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result, // Optional: send back the deleted object info
    });
  } catch (err) {
    next(err);
  }
};
export const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || ""; // get search query
    const category = req.query.category || "";

    const products = await listProducts({ skip, limit, search, category });

    const totalItems = await countProducts({ search, category });
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      page: page,
      limit: limit,
      totalPages,
      totalItems,
      products,
    });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product" });
    }

    const product = await listProductById(id);
    if (!product) {
      return res.status(400).json({ message: "Invalid Product" });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  console.log("!!! Categories route reached !!!");
  try {
    const categories = await listCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};
