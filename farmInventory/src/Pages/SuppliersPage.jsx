import React, { useState, useEffect } from "react";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthStore from "../Store/authStore";
library.add(fas, far, fab);

const SuppliersPage = () => {
  //state for adding supplier overlay
  const [addSupplierOvelay, setAddSupplierOverlay] = useState(false);

  const { token } = useAuthStore();

  //state for tracking supplier details
  const [supplierName, setSupplierName] = useState("");
  const [contact, setContact] = useState("");

  //state for fetched suppliers
  const [fetchedSuppliers, setFetchedSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter suppliers based on search term
  const filteredSuppliers = fetchedSuppliers.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Calculate total suppliers
  const totalSuppliers = fetchedSuppliers.length;

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5000/suppliers/fetch`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return toast.error(data.error);
        }

        setFetchedSuppliers(data.suppliers || []);
      } catch (error) {
        setError(error.message);
        console.error(error.message);
        toast.error("Failed to fetch suppliers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [token]);

  //function for adding a supplier
  const addSupplier = async () => {
    if (!supplierName || !contact) {
      return toast.error("All fields are required");
    }

    try {
      const res = await fetch(`http://localhost:5000/suppliers/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ supplierName, contact }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.error);
      }

      toast.success(data.message);

      // Close overlay and reset form
      setAddSupplierOverlay(false);
      setSupplierName("");
      setContact("");

      // Refresh suppliers list
      const resSuppliers = await fetch(
        `http://localhost:5000/suppliers/fetch`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const dataSuppliers = await resSuppliers.json();
      if (resSuppliers.ok) {
        setFetchedSuppliers(dataSuppliers.suppliers || []);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("poor internet connection");
    }
  };

  return (
    <section className=" flex flex-col md:gap-2 gap-4 w-screen md:w-full relative z-0">
      <div className="">
        <div className="flex  justify-start items-center bg-gray-200 p-2 md:w-[93%] w-[95vw] mt-2 border-b border-gray-300 rounded-t-md md:mr-2">
          <FontAwesomeIcon icon="fa-cart-shopping" className="text-2xl" />
          <h2 className="text-2xl font-bold">Suppliers</h2>
        </div>
        <div className=" bg-gray-100 p-2 md:w-[93%] w-[95vw]">
          <span className="text-[#09ade4] font-bold">Dashboard</span>
          <span>/ Suppliers</span>
        </div>
      </div>

      <div className="w-full flex flex-col md:gap-2 gap-4 leading-loose">
        <div className="md:w-[70%] flex justify-between items-center ">
          <div className="mr-2 md:mr-0">
            <button className="flex items-center bg-[#e8e9e9] py-1  px-2 shadow border border-gray-800 rounded-md">
              <FontAwesomeIcon
                icon="fa-arrow-left"
                className="bg-black text-white rounded-full  p-1"
              />
              <span className="md:text-[18px] ml-2 ">Back</span>
            </button>
          </div>
          <div className="flex flex-col gap-1 text-[18px]">
            <span>
              Total Number of Suppliers:
              <span className="text-[#018100] font-bold">
                [{totalSuppliers}]
              </span>
            </span>
          </div>
        </div>
        {/*search bar area */}
        <div className="flex md:flex-row flex-col md:gap-16 gap-4 pr-2 justify-between mr-4">
          <input
            type="text"
            className="md:w-[65%] w-[95vw] bg-white ring-2 ring-gray-300 ring-inset text-xl py-1 pl-8 outline-none"
            placeholder="Search Suppliers"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="flex gap-2 justify-center items-center w-[40vw] md:w-auto  md:px-16 bg-[#42a8c6] text-white rounded-sm cursor-pointer"
            onClick={() => setAddSupplierOverlay(true)}
          >
            <FontAwesomeIcon
              icon="fa-plus"
              className="bg-white text-[#42a8c6] rounded-full py-1 px-1 text-[13px]"
            />
            <span>Add Supplier</span>
          </div>
        </div>

        {/*table of suppliers section */}
        <div className="md:w-[90%] w-[99vw] overflow-x-auto flex flex-col items-center">
          {isLoading ? (
            <div className="w-[90%] flex justify-center items-center py-8">
              <FontAwesomeIcon
                icon="fa-spinner"
                className="text-3xl animate-spin text-blue-500"
              />
              <span className="ml-2 text-lg">Loading suppliers...</span>
            </div>
          ) : error ? (
            <div className="w-[90%] flex justify-center items-center py-8 text-red-500">
              <FontAwesomeIcon
                icon="fa-exclamation-circle"
                className="text-xl mr-2"
              />
              <span>Error: {error}</span>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="w-[90%] flex justify-center items-center py-8 text-gray-500">
              <FontAwesomeIcon icon="fa-box-open" className="text-xl mr-2" />
              <span>No suppliers found</span>
            </div>
          ) : (
            <table className="w-[90%]">
              <thead className="bg-[#efefee] ring-2 ring-gray-300 ring-inset">
                <tr>
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Quantity Delivered(Bags)</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier, index) => (
                  <tr
                    key={supplier.supplier_id || index}
                    className="text-center border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4">{supplier.supplier_name}</td>
                    <td className="p-4">{supplier.contact}</td>
                    <td className="p-4">{supplier.quantity_delivered || 0}</td>
                    <td className="p-4">
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
      </div>

      {/*add supplier overlay*/}
      <div
        className={`${addSupplierOvelay ? "flex" : "hidden"} flex-col gap-2 justify-center l h-[50vh] md:w-[50%] w-[95vw] top-20 md:left-30 absolute z-10 bg-white border border-blue-600`}
      >
        <div className="flex justify-end w-full pr-2 absolute z-11 top-0">
          <FontAwesomeIcon
            icon="fa-close"
            onClick={() => setAddSupplierOverlay(false)}
          />
        </div>
        <div className="flex flex-col pl-2 text-xl gap-1">
          <label htmlFor="supplier-name" className="font-bold">
            Supplier Name
          </label>
          <input
            type="text"
            id="supply-name"
            className="ring-2 ring-gray-300 ring-offset-0 w-[90%] py-2 rounded-md px-2"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
        </div>
        <div className="flex flex-col pl-2 text-xl gap-1">
          <label htmlFor="supplier-contact" className="font-bold">
            Contact
          </label>
          <input
            type="number"
            id="supply-contact"
            className="ring-2 ring-gray-300 ring-offset-0 w-[90%] py-2 rounded-md px-2"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <button
          className="outline-none text-white bg-[#42a8c6] w-[90%] md:w-[50%] rounded-md py-2 ml-2 mt-4"
          onClick={addSupplier}
        >
          Add Supplier
        </button>
      </div>
    </section>
  );
};

export default SuppliersPage;
