const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
    {
        ProductSku: {
            type: String,
            required: true,
            unique: true
        },
        ProductName: {
            type: String,
            required: true
        },
         ProductPrice: {
            type: Number,
            required: true
        },   
        ProductQuantity: {
            type: Number,
            required: true
        },
        ProductStatus: {
            type: String,
            enum: ['In Stock', 'Out of Stock', 'Discontinued', 'Low Stock', 'Sold out', 'Ready to ship'],
            required: true
        },

        ProductCategory: {
            type: String,
            required: true
        },


        ProductBarcode: {
            type: String,
            required: true,
            unique: true,
        },
        ProductTags: [
            {
                type: String,
                required: false
            }
        ],

        reorderPoint: {
            type: Number,
            default: 10
        },
        Productdateadded: {
            type: Date,
            default: Date.now
        }
    });

const Products = mongoose.model("Products", ProductSchema)
module.exports = Products;
