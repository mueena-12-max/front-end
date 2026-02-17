import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Link, useNavigate } from "react-router-dom";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);
import useAuthStore from "../Store/authStore";
import ProductsPage from "./ProductsPage";
import CustomersPage from "./Customers";
import SuppliersPage from "./SuppliersPage";

const Dashboard = () => {
  const { logoutFunc, login, token } = useAuthStore();
  const navigate = useNavigate();

  //creating a date instance
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: true }),
  );

  //state for changing nav colors
  const [dashboardColor, setDashboardColor] = useState(true);
  const [productsColor, setProductsColor] = useState(false);
  const [suppliersColor, setSuppliersColor] = useState(false);
  const [customersColor, setCustomersColor] = useState(false);
  const [statistics, setStatistics] = useState(false);

  useEffect(() => {
    if (!login || !token) {
      navigate("/");
    }
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: true }));
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(timer);
  });

  return (
    <div className="flex flex-col h-screen">
      {/*header component */}
      <header className="w-full flex md:flex-row flex-col  shadow-2xl font-sans shadow-black md:justify-between md:items-center  bg-[#01398e]  p-4 md:p-0">
        <div className="flex gap-2 md:text-[20px] py-2 text-white  ml-4">
          <img
            src="logo.jpeg"
            alt="logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span>2M WORLWIDE LTD</span>
        </div>
        <div>
          <div className="flex items-center gap-4  text-white md:mr-16">
            <div className="flex items-center gap-1 hover:bg-blue-600 py-2 px-1">
              <FontAwesomeIcon icon="fa-solid fa-user" className="text-xl" />
              <span className="md:text-[18px]">
                Welcome : <span className="font-bold">Admin</span>
              </span>
            </div>
            <div className="flex items-center gap-1  hover:bg-blue-600 py-2 px-1">
              <FontAwesomeIcon
                icon="fa-solid fa-power-off"
                color="red"
                className="text-xl"
              />
              <Link
                to="/"
                className="md:text-[18px] font-bold"
                onClick={() => {
                  logoutFunc;
                }}
              >
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/*main section */}
      <main className="flex-1 flex    h-screen">
        {/*sidebar */}
        <aside className="hidden md:flex md:flex-col pt-1 pr-1 h-full min-w-64 bg-[#484848] shadow-2xl  shadow-black">
          <div
            className={`${dashboardColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4   hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() => {
              setProductsColor(false);
              setDashboardColor(true);
              setSuppliersColor(false);
              setCustomersColor(false);
              setStatistics(false);
            }}
          >
            <FontAwesomeIcon icon=" fa-tachometer" className="text-4xl" />
            <span className="text-[20px]">Dashboard</span>
          </div>
          <div
            className={`${productsColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4  hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() => {
              setProductsColor(true);
              setDashboardColor(false);
              setSuppliersColor(false);
              setCustomersColor(false);
              setStatistics(false);
            }}
          >
            <FontAwesomeIcon icon="fa-cart-shopping" className="text-4xl" />
            <span className="text-[20px]">Products</span>
          </div>
          <div
            className={`${suppliersColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4  hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() => {
              setProductsColor(false);
              setDashboardColor(false);
              setSuppliersColor(true);
              setCustomersColor(false);
              setStatistics(false);
            }}
          >
            <FontAwesomeIcon icon=" fa-cart-shopping" className="text-4xl" />
            <span className="text-[20px]">Suppliers</span>
          </div>
          <div
            className={`${customersColor ? "bg-white text-black" : "text-white"} flex items-center gap-2   py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() => {
              setProductsColor(false);
              setDashboardColor(false);
              setSuppliersColor(false);
              setCustomersColor(true);
              setStatistics(false);
            }}
          >
            <FontAwesomeIcon icon=" fa-users" className="text-4xl" />
            <span className="text-[20px]">Customers</span>
          </div>
          <div
            className={`${statistics ? "bg-white text-black" : "text-white"} flex items-center gap-2   py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() => {
              setProductsColor(false);
              setDashboardColor(false);
              setSuppliersColor(false);
              setCustomersColor(false);
              setStatistics(true);
            }}
          >
            <FontAwesomeIcon icon=" fa-chart-bar" className="text-4xl" />
            <span className="text-[20px]">Statistics</span>
          </div>
          <div
            className={`${statistics ? "bg-white text-black" : "text-white"} flex items-center gap-2   py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() => {
              setProductsColor(false);
              setDashboardColor(false);
              setSuppliersColor(false);
              setCustomersColor(false);
              setStatistics(true);
            }}
          >
            <FontAwesomeIcon icon=" fa-gear" className="text-4xl" />
            <span className="text-[20px]">Settings</span>
          </div>
          <div className="relative -bottom-36 hidden md:flex md:flex-col">
            <h2 className="text-white text-xl ml-8">Time :</h2>
            <div className="text-white font-bold text-shadow-2xl ml-8  ">
              <span className="text-3xl">{time} </span>
            </div>
          </div>
        </aside>
        {/*main content */}
        <section
          className={`${dashboardColor ? "flex" : "hidden"} md:flex-1 flex flex-col gap-8  md:w-full w-screen `}
        >
          <div>
            <div className="flex  justify-start items-center bg-gray-200 p-2 md:w-[93%] w-[95vw] md:ml-16 mt-2 border-b border-gray-300 rounded-t-md md:mr-2 ml-2">
              <FontAwesomeIcon icon="fa-tachometer" className="text-2xl" />
              <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>
            <div className="md:ml-16 bg-gray-100 p-2 md:w-[93%] w-[95vw] ml-2">
              Dashboard
            </div>
          </div>

          {/*sub main content */}
          <div
            className={`${dashboardColor ? "flex" : "hidden"} flex-1  flex-col items-center justify-start gap-16  py-2 `}
            style={{
              background:
                "linear-gradient(135deg,rgba(0,86,179,0,0.85),rgba(0,160,209,0.9)),URL('logo.jpeg') no-repeat center/contain",
            }}
          >
            <div className="text-4xl font-[apple-system] text-gray-800 text-center">
              <h1>2M WORLDWIDE LTD</h1>
            </div>

            {/* dashboard buttons */}
            <div className="flex flex-col  items-center  md:justify-center   gap-8  md:w-[80%] w-screen overflow-x-auto ">
              <div className="flex md:gap-4 gap-2 ml-1 md:ml-0">
                <div className="bg-[#fefeff] border border-black shadow-md shadow-black p-4 gap-2 md:w-72 h-28 flex flex-col items-center justify-center rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out">
                  <FontAwesomeIcon
                    icon="fa-cart-shopping"
                    className="text-5xl"
                  />
                  <h3 className="text-xl  text-shadow-2xl ">Products</h3>
                </div>
                <div className="bg-[#fefeff] border border-black shadow-md shadow-black gap-2 p-4 md:w-72 flex flex-col items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out">
                  <FontAwesomeIcon
                    icon="fa-cart-shopping"
                    className="text-5xl"
                  />
                  <h3 className="text-xl">Suppliers</h3>
                </div>
                <div className="bg-[#fefeff] border border-black shadow-md shadow-black p-4 gap-2 md:w-72 flex flex-col items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out">
                  <FontAwesomeIcon icon="fa-users" className="text-5xl" />
                  <h3 className="text-xl">Customers</h3>
                </div>
              </div>
              <div className="flex md:gap-4 gap-2 ml-1 md:ml-0">
                <div className="bg-[#fefeff] border border-black shadow-md shadow-black p-4  md:w-72 flex flex-col gap-2 items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out">
                  <FontAwesomeIcon icon="fa-users" className="text-5xl" />
                  <h3 className="text-xl text-center">Sales Report</h3>
                </div>
                <div className="bg-[#fefeff] border border-black shadow-md shadow-black p-4   md:w-72 flex flex-col gap-2 items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out">
                  <FontAwesomeIcon icon="fa-chart-bar" className="text-5xl" />
                  <h3 className="text-xl">Statistics</h3>
                </div>
                <div className="bg-[#fefeff] border border-black shadow-md shadow-black p-4  md:w-72 flex flex-col gap-2 items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out">
                  <FontAwesomeIcon
                    icon="fa-gear"
                    className="text-5xl text-[darkred]"
                  />
                  <h3 className="text-xl">Settings</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*any other code below here is another navigation section */}
        <section
          className={`${productsColor ? "flex ml-16 w-full  h-[93vh] overflow-auto" : "hidden"}`}
        >
          <ProductsPage />
        </section>
        {/*customers section */}
        <section
          className={`${customersColor ? "flex ml-16 w-full  h-[93vh] overflow-auto" : "hidden"}`}
        >
          <CustomersPage />
        </section>
        {/*suppliers section */}
        <section
          className={`${suppliersColor ? "flex ml-16 w-full  h-[93vh] overflow-auto" : "hidden"}`}
        >
          <SuppliersPage />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
