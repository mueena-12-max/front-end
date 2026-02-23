import React, { useState, useEffect } from "react";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../Store/authStore";
import toast from "react-hot-toast";
library.add(fas, far, fab);

const CustomersPage = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  // State for customers and transactions

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new sale
  const [customerName, setCustomerName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Fetch customers and transactions on component mount
  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      // Fetch transactions
      const transactionsRes = await fetch(
        "http://localhost:5000/customers/transactions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const transactionsData = await transactionsRes.json();
      if (transactionsRes.ok) {
        setTransactions(transactionsData.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async (e) => {
    e.preventDefault();

    if (
      !customerName ||
      !productName ||
      !quantity ||
      !amountPaid ||
      !saleDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/customers/add-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerName,
            productName,
            quantity: parseInt(quantity),
            amountPaid: parseFloat(amountPaid),
            saleDate,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Transaction added successfully!");
        setShowAddModal(false);
        resetForm();
        fetchData();
      } else {
        toast.error(data.error || "Failed to add transaction");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setProductName("");
    setQuantity("");
    setAmountPaid("");
    setSaleDate(new Date().toISOString().split("T")[0]);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <section className="flex flex-col gap-2 w-full">
      <div>
        <div className="flex justify-start items-center bg-gray-200 p-2 w-[93%] mt-2 border-b border-gray-300 rounded-t-md mr-2">
          <FontAwesomeIcon icon="fa-users" className="text-2xl" />
          <h2 className="text-2xl font-bold">Customers</h2>
        </div>
        <div className="bg-gray-100 p-2 w-[93%]">
          <span className="text-[#09ade4] font-bold">Dashboard</span>
          <span>/ Customers</span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="w-[70%] flex justify-between">
          <div>
            <button
              className="bg-[#e8e9e9] py-1 px-2 shadow border border-gray-800 rounded-md hover:bg-gray-300"
              onClick={handleBack}
            >
              <FontAwesomeIcon
                icon="fa-arrow-left"
                className="bg-black text-white rounded-full p-1"
              />
              <span className="text-[18px] ml-2">Back</span>
            </button>
          </div>
          <div className="flex flex-col gap-1 text-[18px]">
            <span>
              Total Number of Customers:{" "}
              <span className="text-[#018100] font-bold"></span>
            </span>
          </div>
        </div>

        {/*search bar */}
        <div className="flex gap-4 pr-2 justify-between mr-4 flex-wrap">
          <input
            type="text"
            className="w-full md:w-[65%] bg-white ring-2 ring-gray-300 ring-inset text-xl py-1 pl-8 outline-none"
            placeholder="Search Customers"
          />
          <button
            className="flex gap-2 justify-center items-center px-4 bg-[#42a8c6] text-white rounded-sm hover:bg-[#3a9ab8]"
            onClick={() => setShowAddModal(true)}
          >
            <FontAwesomeIcon
              icon="fa-plus"
              className="bg-white text-[#42a8c6] rounded-full py-1 px-1 text-[13px]"
            />
            <span>Add Sales</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-[93%] mt-4">
        <h3 className="text-xl font-bold mb-2">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b text-left">Customer Name</th>
                <th className="py-2 px-4 border-b text-left">
                  Product Purchased
                </th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Amount Paid</th>
                <th className="py-2 px-4 border-b text-left">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    <FontAwesomeIcon
                      icon="fa-spinner"
                      className="animate-spin mr-2"
                    />
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {transaction.customer_name || "N/A"}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.product_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(transaction.sale_date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">
                      ${transaction.amount_paid}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {transaction.quantity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sales Modal */}
      {showAddModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-md shadow-gray-400">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Sale</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon="fa-times" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddSale} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                  placeholder="Enter customer name"
                  list="customer-list"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Product Purchased
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                    placeholder="Qty"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amount Paid ($)
                  </label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-[#42a8c6]"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#42a8c6] text-white rounded hover:bg-[#3a9ab8]"
                >
                  Add Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomersPage;
