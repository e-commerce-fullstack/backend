import mongoose from "mongoose";
import { updateProduct , createProduct, getAllProducts, countAllProducts, getProductById, getCategories, deleteProduct} from '../database/repositories/product.repository.js'
import productModel from "../database/models/product.model.js";
export const addProduct = (data) => createProduct(data);

// delete 
export const removeProductService = (id) => deleteProduct(id)

// update product
export const updatedProductService = (id, data) => {
  return updateProduct(id, data);
};
// Pass search to repository
export const listProducts = ({ skip, limit, search = "" , category = ""}) => {
  return getAllProducts({ skip, limit, search, category });
}

export const listProductById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await getProductById(id);
}

// Accept search for counting
export const countProducts = ({search = "", category = ""} = {}) => {
  return countAllProducts({search, category}); 
}

export const listCategories = async () =>{
  return await productModel.distinct("category")
}