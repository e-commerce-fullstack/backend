import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        stock: {type: Number, required: true},
        price: {type: Number, required: true},
        des: {type: String },
        category: {type: String, required: true},
        image: {type: String, required: true}
    },
    {
        timestamps: true
    }
)

export default mongoose.model('products', productSchema)