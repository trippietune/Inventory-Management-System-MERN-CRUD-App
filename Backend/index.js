const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');
const connectToMongo = require('./db');
const productsRoutes = require('./Routes/productsRoutes'); // เปลี่ยนชื่อตัวแปรเป็น productsRoutes
const authRoutes = require('./Routes/authRoutes');


// Middleware
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB
connectToMongo();

// ใช้ API routes
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);

// Route ทดสอบ
app.get('/', (req, res) => {
    res.send('Inventory Management System API is running');
});

// เริ่มเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});