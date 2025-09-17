import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

export default function InsertProduct() {
    const { triggerRefresh } = useContext(ProductContext); // เรียกใช้ context
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        productSku: "",
        productName: "",
        productPrice: "",
        productQuantity: "",
        productStatus: "",
        productCategory: "",
        productBarcode: "",
        productTags: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const addProduct = async (e) => {
        e.preventDefault();

        if (!formData.productSku.trim() || !formData.productName.trim() || !formData.productPrice.trim() || !formData.productQuantity.trim() || !formData.productStatus.trim() || !formData.productCategory.trim() || !formData.productBarcode.trim()) {
            setError("*Please fill in all the required fields.");
            return;
        }
        if (formData.productBarcode.length !== 12) {
            setError("*Barcode must be exactly 12 digits.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:3001/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    "ProductSku": formData.productSku, 
                    "ProductName": formData.productName, 
                    "ProductPrice": parseFloat(formData.productPrice), 
                    "ProductQuantity": parseInt(formData.productQuantity), 
                    "ProductStatus": formData.productStatus, 
                    "ProductCategory": formData.productCategory, 
                    "ProductBarcode": formData.productBarcode,
                    "ProductTags": formData.productTags.split(",").map(tag => tag.trim()) 
                })
            });

            const data = await res.json();

            if (res.status === 201) {
                alert("Data Inserted");
                triggerRefresh(); // เรียกใช้ฟังก์ชันจาก context เพื่อรีเฟรชข้อมูล
                setFormData({
                    productSku: "",
                    productName: "",
                    productPrice: "",
                    productQuantity: "",
                    productStatus: "",
                    productCategory: "",
                    productBarcode: "",
                    productTags: ""
                });
                navigate('/products');
        
            }else {
                setError(data.message || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
            console.error("Error inserting product:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container-fluid p-5'>
            <h1 className=''>Enter Product Information</h1>
            <form onSubmit={addProduct}>
                <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_sku" className="form-label fw-bold">Product Sku</label>
                    <input type="text" name="productSku" onChange={handleInputChange} value={formData.productSku} className="form-control fs-5" id="product_sku" placeholder="Enter Product Sku" required />
                </div> 
                <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_name" className="form-label fw-bold">Product Name</label>
                    <input type="text" name="productName" onChange={handleInputChange} value={formData.productName} className="form-control fs-5" id="product_name" placeholder="Enter Product Name" required />
                </div>
                <div className="mt-3 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_price" className="form-label fw-bold">Product Price</label>
                    <input type="number" name="productPrice" onChange={handleInputChange} value={formData.productPrice} className="form-control fs-5" id="product_price" placeholder="Enter Product Price" required min="0" step="0.01" />
                </div>
                <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_quantity" className="form-label fw-bold">Product quantity</label>
                    <input type="number" name="productQuantity" onChange={handleInputChange} value={formData.productQuantity} className="form-control fs-5" id="product_quantity" placeholder="Enter Product Quantity" required min="0" />
                </div>
                <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_status" className="form-label fw-bold">Product Status</label>
                    <input type="text" name="productStatus" onChange={handleInputChange} value={formData.productStatus} className="form-control fs-5" id="product_status" placeholder="Enter Product Status" required />
                </div>
                <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_category" className="form-label fw-bold">Product Category</label>
                    <input type="text" name="productCategory" onChange={handleInputChange} value={formData.productCategory} className="form-control fs-5" id="product_category" placeholder="Enter Product Category" required />
                </div>
                <div className="mt-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_tags" className="form-label fw-bold">Product Tags</label>
                    <input type="text" name="productTags" onChange={handleInputChange} value={formData.productTags} className="form-control fs-5" id="product_tags" placeholder="Enter Product Tags (comma separated)" />
                </div>
                <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_barcode" className="form-label fw-bold">Product Barcode</label>
                    <input type="text" name="productBarcode" onChange={handleInputChange} value={formData.productBarcode} className="form-control fs-5" id="product_barcode" placeholder="Enter Product Barcode (12 digits)" required pattern="[0-9]{12}" maxLength={12} />
                </div>
                <div className='d-flex justify-content-center col-lg-6 col-md-6'>
                    <NavLink to="/products" className='btn btn-primary me-5 fs-4'>Cancel</NavLink>
                    <button type="submit" className="btn btn-primary fs-4" disabled={loading}>{loading ? 'Inserting...' : 'Insert'}</button>
                </div>
                <div className="col text-center col-lg-6">
                    {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
                </div>
            </form>
        </div>
    )
}
