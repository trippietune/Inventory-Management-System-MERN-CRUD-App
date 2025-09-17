const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const stockMovementSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        change: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            enum: ['Restock', 'Deliver', 'Return'],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
module.exports = StockMovement;