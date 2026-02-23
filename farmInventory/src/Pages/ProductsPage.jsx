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
    <section className=" flex flex-col gap-2 w-full ">
      {/*header */}
      <div>
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
      <div className="w-full flex flex-col gap-2">
        <div className="w-[70%] flex justify-start  font-bold   ">
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
        <div className="flex gap-16 pr-2 justify-between mr-4">
          <input
            type="text"
            className="w-[65%] bg-white ring-2 ring-gray-300 ring-inset text-xl py-1 pl-8 outline-none"
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
        {/*add product overlay */}
        <div
          className={`${addProduct ? "flex" : "hidden"} flex-col items-center  absolute z-10 top-[20vh] left-[30vw] p-2 bg-white border-2 border-blue-500 w-[50vw] h-[60vh] leading-loose`}
        >
          {/*close button */}
          <div
            className="flex justify-end w-full"
            onClick={() => setAddProduct(false)}
          >
            <FontAwesomeIcon
              icon="fa-close"
              className="shadow p-2 text-red-500"
            />
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            <div className="bg-black  text-white rounded-full px-1">
              <FontAwesomeIcon
                icon="fa-add"
                className="bg-black  text-white rounded-full"
              />
            </div>
            <h3 className="text-xl ">Add Product</h3>
          </div>
          {/*adding items section */}
          <div className="w-[80%] flex flex-col gap-2">
            {/*product selection */}
            <div className="flex flex-col">
              <label htmlFor="product" className="font-bold text-xl">
                Select Product :
              </label>
              <select
                name="product"
                id="product"
                className="ring-2 ring-gray-300 ring-inset py-2 px-2"
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
              <label htmlFor="quantity" className="font-bold text-xl">
                Quantity:
              </label>
              <input
                type="number"
                min={0}
                id="quantity"
                required
                className="ring-2 ring-gray-300 ring-inset py-2 px-2 outline-none"
                value={productQuantity}
                onChange={(e) => setProductQuantity(e.target.value)}
              />
            </div>
            {/*price selection */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <label htmlFor="unit-price" className="font-bold text-xl">
                  Unit Price:
                </label>
                <input
                  type="number"
                  id="unit-price"
                  min={0}
                  required
                  className="ring-2 ring-gray-300 ring-inset py-2 px-2 outline-none"
                  value={productUnitPrice}
                  onChange={(e) => setProductUnitPrice(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-xl">Total Price:</div>
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
              <label htmlFor="supplier-name" className="font-bold text-xl">
                Supplier Name:
              </label>
              <select
                name="supplier"
                id="supplier-name"
                required
                className="ring-2 ring-gray-300 ring-inset py-2 px-2 outline-none"
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
            <div className=" text-center py-1 bg-blue-500 mt-4 text-white cursor-pointer rounded-md shadow-md shadow-blue-300">
              <button
                type="button"
                className="outline-none font-bold text-xl "
                onClick={addProductFunc}
              >
                Add
              </button>
            </div>
          </div>
        </div>

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
                <th className="py-2">Actions</th>
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
          <table className="w-[90%] relative z-0">
            <thead className="bg-[#efefee] ring-2 ring-gray-300 ring-inset">
              <tr>
                <th className="py-2">Product Name</th>
                <th className="py-2">Quantity(Bags)</th>
                <th className="py-2">Total Price</th>
                <th className="py-2">Date Of Supply</th>
                <th className="py-2">Supplier Name</th>
                <th className="py-2">Actions</th>
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
                  <td className="py-2">
                    <button className="text-blue-500 hover:text-blue-700 mx-1">
                      <FontAwesomeIcon icon="fa-edit" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 mx-1">
                      <FontAwesomeIcon icon="fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
