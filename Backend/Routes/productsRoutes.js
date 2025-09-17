// Routes/productsRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../Models/Products');
const StockMovement = require('../Models/StockMovement');

// ฟังก์ชัน helper สำหรับคำนวณสถานะสินค้า
const updateProductStatus = (product) => {
    if (product.ProductQuantity <= 0) {
        product.ProductStatus = 'Sold out';
    } else if (product.ProductQuantity <= product.reorderPoint) {
        product.ProductStatus = 'Low stock';
    } else {
        product.ProductStatus = 'Ready to ship';
    }
    return product;
};

// Route 1: GET - อ่านข้อมูลสินค้าทั้งหมด
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
});

// Route 2: GET - อ่านข้อมูลสินค้าแต่ละชิ้นด้วย ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(product);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid product ID format." });
        }
        res.status(500).json({ message: "Server error occurred." });
    }
});

// Route 3: GET - อ่านข้อมูลสินค้าคงคลังต่ำ
router.get('/status/low-stock', async (req, res) => {
    try {
        const lowStockProducts = await Product.aggregate([
            {
                $match: {
                    $expr: { $lte: ["$ProductQuantity", "$reorderPoint"] }
                }
            }
        ]);
        res.status(200).json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch low stock products.", error: error.message });
    }
});

// Route 4: GET - ดูประวัติการเคลื่อนไหวของสินค้า
router.get('/history/movement', async (req, res) => {
    try {
        const history = await StockMovement.find({}).populate('productId');
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stock history.", error: error.message });
    }
});

// Route 5: POST - สร้างสินค้าใหม่
router.post('/', async (req, res) => {
    try {
        const { ProductSku, ProductName, ProductPrice, ProductQuantity, ProductStatus, ProductCategory, ProductBarcode, ProductTags } = req.body;
        
        // ตรวจสอบ SKU และชื่อซ้ำ
        const existingProduct = await Product.findOne({ $or: [{ ProductSku }, { ProductName }] });
        if (existingProduct) {
            return res.status(409).json({ message: "Product with this SKU or name already exists." });
        }

        const newProduct = new Product({
             ProductSku,
            ProductName,
            ProductPrice,
            ProductQuantity,
            ProductStatus,
            ProductCategory,
            ProductBarcode,
            ProductTags
        });

        // อัปเดตสถานะก่อนบันทึก
        updateProductStatus(newProduct);

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        
    } catch (error) {
        res.status(400).json({ message: "Failed to create product.", error: error.message });
    }
});

// Route 6: PUT - แก้ไขสินค้า
router.put('/:id', async (req, res) => {
    try {
        const { ProductSku, ProductName, ProductPrice, ProductQuantity, ProductStatus, ProductCategory, ProductBarcode } = req.body;

        // สร้าง Object ที่มีเฉพาะข้อมูลที่ต้องการอัปเดต
        const updatedData = {
            ProductSku,
            ProductName,
            ProductPrice,
            ProductQuantity,
            ProductStatus,
            ProductCategory,
            ProductBarcode
        };
        
        // ค้นหาสินค้าและอัปเดตข้อมูลในขั้นตอนเดียว
        let updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true } // {new: true} จะส่งข้อมูลที่อัปเดตแล้วกลับมา, runValidators จะตรวจสอบข้อมูลตาม Schema
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }
        
        // หากต้องการให้สถานะสินค้าอัปเดตอัตโนมัติ ให้เรียกใช้ฟังก์ชันนี้
        // updatedProduct = updateProductStatus(updatedProduct);
        // await updatedProduct.save(); // ต้องใช้ .save() หากต้องการบันทึกการเปลี่ยนแปลงจาก updateProductStatus

        res.status(200).json(updatedProduct);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(400).json({ message: "Failed to update product.", error: error.message });
    }
});
// Route 7: PUT - อัปเดตจำนวนสินค้า
router.put('/update-stock/:id', async (req, res) => {
    try {
        const { changeInQuantity, reason } = req.body;
        
        let updatedProduct = await Product.findById(req.params.id);
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }

        updatedProduct.ProductQuantity += changeInQuantity;
        
        // อัปเดตสถานะสินค้าอัตโนมัติ
        updateProductStatus(updatedProduct);
        
        await updatedProduct.save();

        // บันทึกประวัติการเคลื่อนไหว
        const newMovement = new StockMovement({
            productId: updatedProduct._id,
            change: changeInQuantity,
            reason
        });
        await newMovement.save();

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Failed to update stock.", error: error.message });
    }
});


// Route 8: DELETE - ลบสินค้า
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid product ID format." });
        }
        res.status(500).json({ message: "Failed to delete product.", error: error.message });
    }
});

module.exports = router;