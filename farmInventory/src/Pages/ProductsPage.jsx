import React from "react";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas, far, fab);
const ProductsPage = () => {
  return (
    <section className=" flex flex-col gap-2 w-full ">
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
          <div className="flex gap-2 justify-center items-center px-16 bg-[#42a8c6] text-white rounded-sm">
            <FontAwesomeIcon
              icon="fa-plus"
              className="bg-white text-[#42a8c6] rounded-full py-1 px-1 text-[13px]"
            />
            <span>Add Product</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
