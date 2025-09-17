import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom';

export default function InsertProduct() {
    const [formData, setFormData] = useState({
        productSku: "",
        productName: "",
        productPrice: 0,
        productQuantity: 0,
        productStatus: "",
        productCategory: "",
        productBarcode: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        let isMounted = true;
        
        const getProduct = async () => {
          try {
            const res = await fetch(`http://localhost:3001/api/products/${id}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) {
                    throw new Error(`Failed to fetch product data. Status: ${res.status}`);
            }
      
            const data = await res.json();
      
            setFormData({
                    productSku: data.ProductSku || '',
                    productName: data.ProductName || '',
                    productPrice: data.ProductPrice || 0,
                    productQuantity: data.ProductQuantity || 0,
                    productStatus: data.ProductStatus || '',
                    productCategory: data.ProductCategory || '',
                    productBarcode: data.ProductBarcode || ''
                });

                console.log("Data Retrieved.");
            } catch (err) {
                console.error("Error fetching product data:", err);
                setError("An error occurred while fetching product data.");
            } finally {
                setLoading(false);
            }
        };
      
        if (id) {
            getProduct();
        };
    }, [id]);

    const updateProduct = async (e) => {
        e.preventDefault();

        if (String(formData.productBarcode).length !== 12) {
            setError("*Barcode must be exactly 12 digits.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "ProductSku": formData.productSku, 
                    "ProductName": formData.productName, 
                    "ProductPrice": parseFloat(formData.productPrice), 
                    "ProductQuantity": parseInt(formData.productQuantity), 
                    "ProductStatus": formData.productStatus, 
                    "ProductCategory": formData.productCategory,  
                    "ProductBarcode": formData.productBarcode 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to update product. Status: ${response.status}`);
            }

            alert("Data Updated Successfully");
            navigate('/products');
        } catch (err) {
            setError("An error occurred. Please try again later.");
            console.error("Error updating product:", err);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="container-fluid p-5">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-3">Loading product data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className='container-fluid p-5'>
            <h1 className=''>Update Product Information</h1>
            <form onSubmit={updateProduct}>
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
                <div className="mt-3 mb-5 col-lg-6 col-md-6 col-12 fs-4">
                    <label htmlFor="product_barcode" className="form-label fw-bold">Product Barcode</label>
                    <input type="text" name="productBarcode" onChange={handleInputChange} value={formData.productBarcode} className="form-control fs-5" id="product_barcode" placeholder="Enter Product Barcode (12 digits)" required pattern="[0-9]{12}" maxLength={12} />
                </div>
                <div className='d-flex justify-content-center col-lg-6 col-md-6'>
                    <NavLink to="/products" className='btn btn-primary me-5 fs-4'>Cancel</NavLink>
                    <button type="submit" className="btn btn-primary fs-4" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
                </div>
                <div className="col text-center col-lg-6 ">
                    {error && <div className="text-danger mt-3 fs-5 fw-bold">{error}</div>}
                </div>
            </form>
        </div>
    );
}