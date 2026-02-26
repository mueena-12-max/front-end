import React, { useEffect, useState } from "react";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";
library.add(fas, far, fab);

// API URL - use environment variable in production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductsPage = () => {
  //state for displaying add product screen
  const [addProduct, setAddProduct] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  //states for products adding
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productUnitPrice, setProductUnitPrice] = useState(0);
  const [supplierName, setSupplierName] = useState("");
  const totalPrice = productQuantity * productUnitPrice;

  //state for keepind fetched products
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  //state for fetched suppliers (for dropdown)
  const [fetchedSuppliers, setFetchedSuppliers] = useState([]);

  // Filter products based on search term
  const filteredProducts = fetchedProducts.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate totals
  const totalProducts = fetchedProducts.length;
  const lowQuantityProducts = fetchedProducts.filter(
    (product) => product.product_quantity < 10,
  ).length;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;

      setIsLoading(true);

      try {
        const res = await fetch(`${API_URL}/product/fetch`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) return;
        setFetchedProducts(data.products || []);
      } catch (error) {
        console.error(error.message);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Fetch suppliers for dropdown
  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/suppliers/fetch`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          setFetchedSuppliers(data.suppliers || []);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSuppliers();
  }, [token]);

  //function for adding a prodouct to the database
  const addProductFunc = async () => {
    if (
      !productName ||
      !productQuantity ||
      !productUnitPrice ||
      !supplierName ||
      !totalPrice
    ) {
      return toast.error(`All fields are required`);
    }

    try {
      const res = await fetch(`${API_URL}/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productName,
          productQuantity,
          totalPrice,
          supplierName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (
          data.error === "Token expired" ||
          data.error === "Invalid Token" ||
          data.error === "Authentication Failed"
        ) {
          navigate("/");
        }
        return toast.error(data.error);
      }
      toast.success(data.message);
      setAddProduct(false);
      setProductName("");
      setProductQuantity(0);
      setProductUnitPrice(0);
      setSupplierName("");

      // Refresh products list after adding
      const resProducts = await fetch(`${API_URL}/product/fetch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const dataProducts = await resProducts.json();
      if (resProducts.ok) {
        setFetchedProducts(dataProducts.products || []);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Poor Network Connectivity");
    }
  };
  return (
    <section className=" flex flex-col gap-2 md:w-full w-[98vw] overflow-x-auto ">
      {/*header */}
      <div className="w-full overflow-auto">
        <div className="flex  justify-start items-center bg-gray-200 p-2 w-[93%]  mt-2 border-b border-gray-300 rounded-t-md mr-2">
          <FontAwesomeIcon icon="fa-cart-shopping" className="text-2xl" />
          <h2 className="text-2xl font-bold">Products</h2>
        </div>
        <div className=" bg-gray-100 p-2 w-[93%]">
          <span className="text-[#09ade4] font-bold">Dashboard</span>
          <span>/ Products</span>
        </div>
      </div>
      {/*main content */}
      <div className="  md:w-full  flex flex-col gap-2">
        <div className="flex flex-col gap-2 w-[98vw] md:w-full">
          <div className=" md:w-[70%] flex justify-start  font-bold   ">
            <div className="flex flex-col gap-1 md:text-[25px]">
              <span>
                Total Number of Products:{" "}
                <span className="text-[#018100] ">[{totalProducts}]</span>
              </span>
              <span>
                <span className="font-bold text-[#ff5f60]">
                  [{lowQuantityProducts}]
                </span>{" "}
                Products are below Quantity of 10
              </span>
            </div>
          </div>
          {/*search bar */}
          <div className="flex md:flex-row flex-col md:gap-16 gap-4 pr-2 justify-between mr-4">
            <input
              type="text"
              className="w-[95vw] md:w-[65%] bg-white ring-2 ring-gray-300 ring-inset text-xl py-1 pl-2 md:pl-8 outline-none"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className="flex gap-2 justify-center items-center px-16 bg-[#42a8c6] text-white rounded-sm cursor-pointer"
              onClick={() => {
                setAddProduct(true);
              }}
            >
              <FontAwesomeIcon
                icon="fa-plus"
                className="bg-white text-[#42a8c6] rounded-full py-1 px-1 text-[13px]"
              />
              <span>Add Product</span>
            </div>
          </div>
        </div>
        {/*add product overlay */}
        <div
          className={`${addProduct ? "flex" : "hidden"} flex-col gap-4 items-center  fixed inset-0 z-10 top-[20vh] left-[3vw] md:left-[40vw] rounded-md p-4 bg-white shadow-md shadow-black w-[95vw] md:w-[28vw] h-[73vh] md:h-[60vh] leading-loose`}
        >
          <div className="flex justify-between w-full ">
            <div>
              <h3 className="text-2xl font-bold">Add Product</h3>
            </div>
            {/*close button */}
            <div
              onClick={() => setAddProduct(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              <FontAwesomeIcon icon="fa-times" />
            </div>
          </div>
          {/*adding items section */}
          <div className="w-full flex flex-col justify-between gap-2 font-medium ">
            {/*product selection */}
            <div className="flex flex-col">
              <label htmlFor="product" className="">
                Select Product :
              </label>
              <select
                name="product"
                id="product"
                className="border font-light border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              >
                <option value="">Please Select</option>
                <option value="maize">Maize</option>
                <option value="beans">Beans</option>
                <option value="millet">Millet</option>
                <option value="sheabutter">Shea Butter</option>
                <option value="groundnut">Groundnut</option>
                <option value="soyabeans">Soya Beans</option>
              </select>
            </div>

            {/*quantity selection */}
            <div className="flex flex-col">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                min={0}
                id="quantity"
                required
                className="border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
              />
            </div>
            {/*price selection */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <label htmlFor="unit-price">Unit Price:</label>
                <input
                  type="number"
                  id="unit-price"
                  min={0}
                  required
                  className="border-2 border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                  value={productUnitPrice}
                  onChange={(e) => setProductUnitPrice(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <div className="text-xl">Total Price:</div>
                <div className="  font-bold text-2xl">
                  <FontAwesomeIcon
                    icon="fa-cedi-sign"
                    className="text-[darkgreen]"
                  />
                  {totalPrice}
                </div>
              </div>
            </div>

            {/*supplier section - now a dropdown */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="supplier-name">Supplier Name:</label>
              <select
                name="supplier"
                id="supplier-name"
                required
                className="border-2 font-light border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              >
                <option value="">Please Select a Supplier</option>
                {fetchedSuppliers.map((supplier) => (
                  <option
                    key={supplier.supplier_id}
                    value={supplier.supplier_name}
                  >
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
            </div>
            {/*submit */}

            <div className="flex gap-2 justify-end mt-4 w-full">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 "
                onClick={() => setAddProduct(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#42a8c6] text-white rounded hover:bg-[#3a9ab8] "
                onClick={addProductFunc}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-[98vw] md:w-full overflow-auto">
          {/*Product display */}
          {isLoading ? (
            <div className="w-[90%] flex justify-center items-center py-8">
              <FontAwesomeIcon
                icon="fa-spinner"
                className="text-3xl animate-spin text-blue-500"
              />
              <span className="ml-2 text-lg">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <table className="w-[90%]">
              <thead className="bg-[#efefee]">
                <tr>
                  <th className="py-2">Product Name</th>
                  <th className="py-2">Quantity(Bags)</th>
                  <th className="py-2">Total Price</th>
                  <th className="py-2">Date Of Supply</th>
                  <th className="py-2">Supplier Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No products found
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="  w-[90vw]  md:w-[90%] ">
              <thead className="bg-[#efefee] ring-2 ring-gray-300 ring-inset">
                <tr>
                  <th className="py-2">Product Name</th>
                  <th className="py-2">Quantity(Bags)</th>
                  <th className="py-2">Total Price</th>
                  <th className="py-2">Date Of Supply</th>
                  <th className="py-2">Supplier Name</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.product_id || index}
                    className="text-center border-b border-gray-200 hover:bg-gray-50 font-bold"
                  >
                    <td className="py-2">{product.product_name}</td>
                    <td className="py-2">{product.product_quantity}</td>
                    <td className="py-2">
                      <FontAwesomeIcon
                        icon="fa-cedi-sign"
                        className="text-green-600 mr-1"
                      />
                      {product.product_total_price}
                    </td>
                    <td className="py-2">
                      {product.created_at
                        ? new Date(product.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-2">{product.supplier_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
