import React, { useState } from "react";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas, far, fab);
const ProductsPage = () => {
  //state for displaying add product screen
  const [addProduct, setAddProduct] = useState(false);

  //states for products adding
  const [productName, setProductName] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productUnitPrice, setProductUnitPrice] = useState(0);
  const [supplierName, setSupplierName] = useState("");
  const totalPrice = productQuantity * productUnitPrice;
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
        <div className="w-[70%] flex justify-between  ">
          <div>
            <button className="bg-[#e8e9e9] py-1  px-2 shadow border border-gray-800 rounded-md">
              <FontAwesomeIcon
                icon="fa-arrow-left"
                className="bg-black text-white rounded-full  p-1"
              />
              <span className="text-[18px] ml-2 ">Back</span>
            </button>
          </div>
          <div className="flex flex-col gap-1 text-[18px]">
            <span>
              Total Number of Products:{" "}
              <span className="text-[#018100] font-bold">[0]</span>
            </span>
            <span>
              <span className="font-bold text-[#ff5f60]">[0]</span> Products are
              below Quantity of 10
            </span>
          </div>
        </div>
        {/*search bar */}
        <div className="flex gap-16 pr-2 justify-between mr-4">
          <input
            type="text"
            className="w-[65%] bg-white ring-2 ring-gray-300 ring-inset text-xl py-1 pl-8 outline-none"
            placeholder="Search Product"
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
                <option value="maize" selected>
                  Maize
                </option>
                <option value="beans">Beans</option>
                <option value="millet">Millet</option>
                <option value="sheabutter">Shea Butter</option>
                <option value="groundnut">Groundnut</option>
                <option value="soyabeans">Soya Beans</option>
              </select>
            </div>
            {productName}
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

            {/*supplier section */}
            <div className="flex flex-col w-1/2">
              <label htmlFor="supplier-name" className="font-bold text-xl">
                Supplier Name:
              </label>
              <input
                type="text"
                required
                className="ring-2 ring-gray-300 ring-inset py-2 px-2 outline-none"
                id="supplier-name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
            {/*submit */}
            <div className=" text-center py-1 bg-blue-500 mt-4 text-white cursor-pointer rounded-md shadow-md shadow-blue-300">
              <button className="outline-none font-bold text-xl ">Add</button>
            </div>
          </div>
        </div>

        {/*Product display */}
        <table className="w-[90%] relative z-0 ">
          <thead className="bg-[#efefee] ring-2 ring-gray-300 ring-inset">
            <tr>
              <th className="py-2">Product Name</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Price/Bag</th>
              <th className="py-2">Total Price</th>
              <th className="py-2">Date Of Last Supply</th>
              <th className="py-2">Last Supplier Name</th>
              <th className="py-2">Number Of Suppliers</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductsPage;
