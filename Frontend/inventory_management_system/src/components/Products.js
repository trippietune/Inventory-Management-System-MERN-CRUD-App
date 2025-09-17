import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ProductContext } from '../context/ProductContext';

export default function Products() {
    const { shouldRefresh } = useContext(ProductContext);
    const [productData, setProductData] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [stockHistoryData, setStockHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [products, lowStock, history] = await Promise.all([
                    getProducts(),
                    getLowStockProducts(),
                    getStockHistory()
                ]);
                
                setProductData(products);
                setLowStockProducts(lowStock);
                setStockHistoryData(history);
                
                console.log("All data fetched successfully.");
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(`Failed to load data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shouldRefresh]);

    const getProducts = async () => {
        const res = await fetch("http://localhost:3001/api/products", {
            method: "GET",
            headers: {"Content-Type": "application/json"}
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;

        };
    

    const getLowStockProducts = async () => {
            const res = await fetch("http://localhost:3001/api/products/status/low-stock", {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;

        };
    

    const getStockHistory = async () => {
            const res = await fetch("http://localhost:3001/api/products/history/movement", {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            return data;
        };
    

    const deleteProduct = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete product: ${name}?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"}
            });

            if (!response.ok) {
                throw new Error(`Failed to delete product. Status: ${response.status}`);
            }

            console.log("Product deleted successfully");
            getProducts(); // เรียกข้อมูลใหม่เพื่ออัปเดตตาราง
        } catch (err) {
            console.error("Error deleting product:", err);
            setError(err.message);
        }
    };


    // ... (โค้ดส่วนบนเหมือนเดิม)

    // ... (ฟังก์ชัน deleteProduct เหมือนเดิม)

    if (loading) {
        return (
            <div className="container-fluid p-5">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-3">Loading products...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid p-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                </div>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className='container-fluid p-5'>
            <h1>Products Inventory</h1>
            <div className='add_button mb-3'>
                <NavLink to="/insertproduct" className='btn btn-primary fs-5'> 
                    + Add New Product
                </NavLink>
            </div>
            
            <div className="overflow-auto mt-3" style={{ maxHeight: "38rem" }}>
                <table className="table table-striped table-hover mt-3 fs-5">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Product Sku</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Product Price</th>
                            <th scope="col">Product Quantity</th>
                            <th scope="col">Product Status</th>
                            <th scope="col">Product Category</th>
                            <th scope="col">Product Barcode</th>
                            <th scope="col">Update</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* ปรับปรุงโค้ดส่วนนี้ */}
                        {productData?.length > 0 ? (
                            productData.map((element, id) => {
                                return (
                                    <tr key={element._id || id}>
                                        <th scope="row">{id + 1}</th>
                                        <td>{element.ProductSku}</td>
                                        <td>{element.ProductName}</td>
                                        <td>{element.ProductPrice}</td>
                                        <td>{element.ProductQuantity}</td>
                                        <td>{element.ProductStatus}</td>
                                        <td>{element.ProductCategory}</td>
                                        <td>{element.ProductBarcode}</td>
                                        <td>
                                            <NavLink 
                                                to={`/updateproduct/${element._id}`} 
                                                className="btn btn-primary"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </NavLink>
                                        </td>
                                        <td>
                                            <button 
                                                className="btn btn-danger" 
                                                onClick={() => deleteProduct(element._id, element.ProductName)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center py-4">
                                    No products found. <NavLink to="/insertproduct">Add a new product</NavLink>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}