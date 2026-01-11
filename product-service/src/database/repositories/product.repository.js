import product from "../models/product.model.js";

// Create a product
export const createProduct = (data) => product.create(data);

// delete a product 
export const deleteProduct = (id) => product.findByIdAndDelete(id)

// Get all products with pagination and optional search
export const getAllProducts = async ({
  skip = 0,
  limit = 10,
  search = "",
  category = "",
}) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  return await product.find(query).skip(skip).limit(limit);
};

// Get a single product by ID
export const getProductById = (id) => product.findById(id);

// update product 
// product.service.js (or repository)
export const updateProduct = async (id, data) => {
  return await product.findByIdAndUpdate(
    id, 
    data, 
    { 
      new: true,          // Returns the document AFTER the update
      runValidators: true // Ensures the update respects your Schema rules
    }
  );
};
// Count products, optionally filtered by search
export const countAllProducts = async ({ search = "", category = "" } = {}) => {
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (category) {
    query.category = category;
  }

  return await product.countDocuments(query);
};

// for category to get them
export const getCategories = async () => {
  try {
    // If you use .find({ category: ... }) and the value is undefined, it might 400
    const categories = await Product.distinct("category"); // This is the best way to get a list of unique category names
    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
