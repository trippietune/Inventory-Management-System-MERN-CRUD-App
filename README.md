Thank you jaijai for helping me this project TT

#For githubbbbb     
git add .
git commit -m "คำอธิบายการแก้ไข"
git push origin main

ถ้าอยากสร้าง branch สำหรับฟีเจอร์ใหม่:
git checkout -b feature/auth-system

แก้โค้ดใน branch นั้น → commit → push:
git push origin feature/auth-system
สามารถสร้าง Pull Request บน GitHub เพื่อ merge กลับเข้า main
Tip:
-->อย่าลืมใส่ .gitignore สำหรับ node_modules/ และ .env
-->ใช้ commit message ให้สื่อความหมาย เช่น Add auth routes and user model

ตัวอย่าง .gitignore (สำคัญมาก)
# Node.js
node_modules/
.env
.DS_Store ป้องกันไม่ให้ node_modules และไฟล์ .env ที่มี secret ขึ้น GitHub

.env ตัวอย่าง
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/IMS
JWT_SECRET=your_super_secret_key
______________________________________________________________________________________________________________________________________________________________
# Inventory Management System MERN CRUD App

A simple MERN project that lets the user insert, update, delete & get products from the MongoDB.

## To Run App:

### 1. Open the folder in vs code and run (npm install) command.
   
### 2. In MongoDB Compass:
   - Create Database: IMS
   - Collection Name: products

### 3. Then in vs code, open two terminals in split:
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/86ed0828-84b8-43b0-89fd-8caa17b88833)

### 4. In one terminal run these commands (For Backend / Server):
   - cd Backend
   - npm run server

### 5. In the other terminal run these commands (For Frontend / Client):
   - cd Frontend
   - cd inventory_management_system
   - npm start
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/93fa528b-bc88-49c2-9922-19b317336b7c)

## Output:
### 1. GET (Displaying products)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/09f7d43a-344b-4122-b415-b3736307cf45)

### 2. POST (Inserting a new product)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/d31e9f36-c119-4a04-9cc0-ddc9fe94b159)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/39ec387f-5efc-4c1f-a7eb-a87612acc17a)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/a6b5c6bf-77d7-41ab-9ca0-3a8bfc71954d)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/3d43e877-c2e6-414b-bef9-410caae1668e)

### 3. PUT (Updating a product)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/d35f7ab0-3fda-4b1c-9055-67ca8c7b2ab6)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/7dd107db-6fde-416d-b5c6-2175916f872f)

### 4. DELETE (Deleting a product)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/d846ff43-6abd-4baa-9ed6-df736f2d411e)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/cc6368bd-f391-4d6b-b814-c931d48a0878)
