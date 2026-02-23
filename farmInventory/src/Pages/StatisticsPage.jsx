import React, { useState, useEffect } from "react";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAuthStore from "../Store/authStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
library.add(fas, far, fab);

// API URL - use environment variable in production
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const StatisticsPage = () => {
  const { token } = useAuthStore();

  // State for statistics data
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);

      try {
        // Fetch all statistics in one call
        const statsRes = await fetch(`${API_URL}/statistics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const statsData = await statsRes.json();
        if (statsRes.ok) {
          setStatistics(statsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Get data from statistics response
  const products = statistics?.products || [];

  const suppliers = statistics?.suppliers || [];

  const stats = statistics?.statistics || {};

  // Calculate statistics
  const totalProducts = stats.totalProducts || 0;
  const totalSuppliers = stats.totalSuppliers || 0;
  const totalTransactions = stats.totalTransactions || 0;

  const totalInventoryValue = stats.totalInventoryValue || 0;
  const totalAvailableQuantity = stats.totalAvailableQuantity || 0;
  const totalSupplierQuantity = stats.totalSupplierQuantity || 0;
  const totalSalesAmount = stats.totalSalesAmount || 0;
  const totalQuantitySold = stats.totalQuantitySold || 0;

  // Prepare data for charts
  const supplierData = suppliers.slice(0, 5).map((supplier) => ({
    name: supplier.supplier_name?.substring(0, 10) || "Unknown",
    quantity: supplier.quantity_delivered || 0,
    contact: supplier.contact || 0,
  }));

  const productData = products.slice(0, 5).map((product) => ({
    name: product.product_name?.substring(0, 10) || "Unknown",
    quantity: product.product_quantity || 0,
    price: product.product_total_price || 0,
  }));

  const categoryData = [
    { name: "Products", value: totalProducts },
    { name: "Suppliers", value: totalSuppliers },
    //{ name: "Customers", value: totalCustomers },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FontAwesomeIcon
          icon="fa-spinner"
          className="text-4xl animate-spin text-blue-500"
        />
        <span className="ml-2 text-xl">Loading statistics...</span>
      </div>
    );
  }

  return (
    <section className="flex flex-col w-full gap-4 p-2 md:p-4">
      {/* Header */}
      <div className="w-full">
        <div className="flex items-center justify-between bg-gray-200 p-2 md:w-[93%] w-[95vw] mt-2 border-b border-gray-300 rounded-t-md">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon="fa-chart-bar" className="text-2xl" />
            <h2 className="text-2xl font-bold">Statistics</h2>
          </div>
        </div>
        <div className="bg-gray-100 p-2 md:w-[93%] w-[95vw]">
          <span className="text-[#09ade4] font-bold">Dashboard</span>
          <span>/ Statistics</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-[95vw] md:w-[93%]">
        <div className="bg-linear-to-br from-blue-500 to-blue-700 p-4 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <FontAwesomeIcon
              icon="fa-boxes-stacked"
              className="text-3xl opacity-50"
            />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-700 p-4 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Total Suppliers</p>
              <p className="text-2xl font-bold">{totalSuppliers}</p>
            </div>
            <FontAwesomeIcon icon="fa-truck" className="text-3xl opacity-50" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-700 p-4 rounded-lg shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Inventory Value</p>
              <p className="text-2xl font-bold">
                ${totalInventoryValue.toLocaleString()}
              </p>
            </div>
            <FontAwesomeIcon
              icon="fa-dollar-sign"
              className="text-3xl opacity-50"
            />
          </div>
        </div>
      </div>
      <div className="text-black">
        <ul>
          {products.map((product) => (
            <li key={product.producr_id}>
              <span>
                {product.product_name}: {product.product_quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Charts Row 1 */}
      <div className="flex flex-col md:flex-row gap-4 w-[95vw] md:w-[93%]">
        {/* Bar Chart - Products */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/2">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Products Overview
          </h3>
          {productData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
                <Bar dataKey="price" fill="#82ca9d" name="Price ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-62.5 text-gray-500">
              No products data available
            </div>
          )}
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/2">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Distribution Overview
          </h3>
          {categoryData.some((item) => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-62.5 text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="flex flex-col md:flex-row gap-4 w-[95vw] md:w-[93%]">
        {/* Bar Chart - Suppliers */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/2">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Top Suppliers by Quantity
          </h3>
          {supplierData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={supplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="quantity"
                  fill="#00C49F"
                  name="Quantity Delivered"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-62.5 text-gray-500">
              No supplier data available
            </div>
          )}
        </div>

        {/* Line Chart - Summary */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full md:w-1/2">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Inventory Summary
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={[
                { name: "Products", value: totalProducts },
                { name: "Suppliers", value: totalSuppliers },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 w-[95vw] md:w-[93%]">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="text-gray-500 text-sm">Available Quantity</h4>
          <p className="text-2xl font-bold text-gray-800">
            {totalAvailableQuantity}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="text-gray-500 text-sm">Supplier Deliveries</h4>
          <p className="text-2xl font-bold text-gray-800">
            {totalSupplierQuantity}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="text-gray-500 text-sm">Total Sales</h4>
          <p className="text-2xl font-bold text-gray-800">
            ${totalSalesAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="text-gray-500 text-sm">Items Sold</h4>
          <p className="text-2xl font-bold text-gray-800">
            {totalQuantitySold}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h4 className="text-gray-500 text-sm">Total Transactions</h4>
          <p className="text-2xl font-bold text-gray-800">
            {totalTransactions}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-lg col-span-2 md:col-span-1">
          <h4 className="text-gray-500 text-sm">Avg. Product Price</h4>
          <p className="text-2xl font-bold text-gray-800">
            $
            {totalProducts > 0
              ? (totalInventoryValue / totalProducts).toFixed(2)
              : 0}
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatisticsPage;
