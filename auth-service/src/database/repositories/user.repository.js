import userModel from "../models/user.model.js";

export const createUser = (data) => userModel.create(data);
export const findUserByEmail = (email) => userModel.findOne({ email });


export const findUserById = (id) => userModel.findById(id);


export const getUser = async (email) =>{
  return await userModel.findOne({email})
}



export const getAllUserRepo = async () => {
  return await userModel.find({}).select("-password").sort({ createdAt: -1 });
}