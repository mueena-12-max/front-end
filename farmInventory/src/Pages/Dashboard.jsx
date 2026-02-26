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

import SuppliersPage from "./SuppliersPage";
import StatisticsPage from "./StatisticsPage";
import CustomersPage from "./Customers";
import Settings from "./Settings";

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
  const [settings, setSettings] = useState(false);

  //state for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!login || !token) {
      navigate("/");
    }
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: true }));
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(timer);
  }, [login, token, navigate]);

  // Function to handle navigation and close sidebar on mobile
  const handleNav = (setter) => {
    setter();
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen relative z-0">
      {/*header component */}
      <header className="w-full flex md:flex-row flex-col shadow-2xl font-sans shadow-black justify-between md:items-center bg-[#01398e]  md:p-0">
        <div className="flex justify-between gap-2  md:text-[20px] py-2 text-white md:ml-4 items-center">
          <button
            className="md:hidden  p-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FontAwesomeIcon icon="fa-bars" className="text-2xl text-white" />
          </button>
          <div className="flex gap-2 ">
            <img
              src="logo.jpeg"
              alt="logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <span className="shadow-lg mr-2 md:mr-0">2M WORLDWIDE LTD</span>
          </div>
        </div>
        <div className="px-2 md:px-0">
          <div className="flex items-center justify-between md:justify-center gap-4 text-white md:mr-16 text-xl">
            <div className="flex items-center gap-1 hover:bg-blue-600 py-2 px-1">
              <FontAwesomeIcon icon="fa-solid fa-user" className="text-xl" />
              <span className="md:text-[18px]">
                Welcome : <span className="font-bold">Admin</span>
              </span>
            </div>
            <div className="flex items-center gap-1 hover:bg-blue-600 py-2 px-1">
              <FontAwesomeIcon
                icon="fa-solid fa-power-off"
                color="red"
                className="text-xl"
              />
              <Link
                to="/"
                className="md:text-[18px] font-bold"
                onClick={() => {
                  logoutFunc();
                }}
              >
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/*main section */}
      <main className="flex-1 flex h-screen">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/*sidebar - desktop and mobile */}
        <aside
          className={`
          ${sidebarOpen ? "w-screen h-screen " : "hidden md:flex"} 
          
           md:relative 
           absolute z-50
           top-0
          md:flex md:flex-col pt-1 pr-1  md:h-full w-[99vw] md:min-w-64  md:w-64  bg-[#484848] shadow-2xl shadow-black
          
        `}
        >
          {/* Mobile close button */}
          <button
            className="md:hidden absolute top-0.5 right-2 p-2 text-white mb-4"
            onClick={() => setSidebarOpen(false)}
          >
            <FontAwesomeIcon icon="fa-times" className="text-2xl" />
          </button>

          <div
            className={`${dashboardColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4 hover:bg-gray-600 hover:cursor-pointer p-2 mt-8 md:mt-0`}
            onClick={() =>
              handleNav(() => {
                setProductsColor(false);
                setDashboardColor(true);
                setSuppliersColor(false);
                setCustomersColor(false);
                setStatistics(false);
                setSettings(false);
              })
            }
          >
            <FontAwesomeIcon icon="fa-tachometer" className="text-4xl" />
            <span className="text-[20px]">Dashboard</span>
          </div>
          <div
            className={`${productsColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() =>
              handleNav(() => {
                setProductsColor(true);
                setDashboardColor(false);
                setSuppliersColor(false);
                setCustomersColor(false);
                setStatistics(false);
                setSettings(false);
              })
            }
          >
            <FontAwesomeIcon
              icon="fa-cart-shopping"
              className="text-4xl text-[#10a11c]"
            />
            <span className="text-[20px]">Products</span>
          </div>
          <div
            className={`${suppliersColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() =>
              handleNav(() => {
                setProductsColor(false);
                setDashboardColor(false);
                setSuppliersColor(true);
                setCustomersColor(false);
                setStatistics(false);
                setSettings(false);
              })
            }
          >
            <FontAwesomeIcon
              icon="fa-cart-shopping"
              className="text-4xl text-lime-300"
            />
            <span className="text-[20px]">Suppliers</span>
          </div>
          <div
            className={`${customersColor ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() =>
              handleNav(() => {
                setProductsColor(false);
                setDashboardColor(false);
                setSuppliersColor(false);
                setCustomersColor(true);
                setStatistics(false);
                setSettings(false);
              })
            }
          >
            <FontAwesomeIcon
              icon="fa-users"
              className="text-4xl text-orange-500"
            />
            <span className="text-[20px]">Customers</span>
          </div>
          <div
            className={`${statistics ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() =>
              handleNav(() => {
                setProductsColor(false);
                setDashboardColor(false);
                setSuppliersColor(false);
                setCustomersColor(false);
                setStatistics(true);
                setSettings(false);
              })
            }
          >
            <FontAwesomeIcon
              icon="fa-chart-bar"
              className="text-4xl text-violet-800 "
            />
            <span className="text-[20px]">Statistics</span>
          </div>
          <div
            className={`${settings ? "bg-white text-black" : "text-white"} flex items-center gap-2 py-4 hover:bg-gray-600 hover:cursor-pointer p-2`}
            onClick={() =>
              handleNav(() => {
                setProductsColor(false);
                setDashboardColor(false);
                setSuppliersColor(false);

                setStatistics(false);
                setSettings(true);
              })
            }
          >
            <FontAwesomeIcon
              icon="fa-gear"
              className="text-4xl text-[darkred]"
            />
            <span className="text-[20px]">Settings</span>
          </div>
          <div className="relative -bottom-36 hidden md:flex md:flex-col">
            <h2 className="text-white text-xl ml-8">Time :</h2>
            <div className="text-white font-bold text-shadow-2xl ml-8">
              <span className="text-3xl">{time}</span>
            </div>
          </div>
        </aside>

        {/*main content */}
        <section
          className={`${dashboardColor ? "flex" : "hidden"} md:flex-1 flex flex-col gap-8 md:w-full w-screen`}
        >
          <div>
            <div className="flex justify-start items-center bg-gray-200 p-2 md:w-[93%] w-[95vw] md:ml-16 mt-2 border-b border-gray-300 rounded-t-md md:mr-2 ml-2">
              <FontAwesomeIcon icon="fa-tachometer" className="text-2xl" />
              <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>
            <div className="md:ml-16 bg-gray-100 p-2 md:w-[93%] w-[95vw] ml-2">
              Dashboard
            </div>
          </div>

          {/*sub main content */}
          <div
            className={`${dashboardColor ? "flex" : "hidden"} flex-1 flex-col items-center justify-start gap-16 py-2`}
            style={{
              background:
                "linear-gradient(rgba(255,255,255,0.83),rgba(255,255,255,0.9)),URL('logo.jpeg') no-repeat center/contain,#f0f0f0",
            }}
          >
            <div className="text-4xl font-[apple-system] text-gray-800 text-center shadow-3d">
              <h1>2M WORLDWIDE LTD</h1>
            </div>

            {/* dashboard buttons */}
            <div className="flex flex-col items-center md:justify-center gap-8 md:w-[80%] w-screen overflow-x-auto px-2 pb-4">
              <div className="flex md:gap-4 gap-2 ml-1 md:ml-0 flex-wrap justify-center md:justify-start">
                <div
                  className="bg-[#10a11c] text-white border border-green-800 shadow-md shadow-black p-4 gap-2 md:w-72 h-28 flex flex-col items-center justify-center rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out cursor-pointer w-35"
                  onClick={() =>
                    handleNav(() => {
                      setProductsColor(true);
                      setDashboardColor(false);
                      setSuppliersColor(false);
                      setCustomersColor(false);
                      setStatistics(false);
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon="fa-cart-shopping"
                    className="text-4xl md:text-5xl opacity-50"
                  />
                  <h3 className="text-lg md:text-xl text-shadow-2xl">
                    Products
                  </h3>
                </div>
                <div
                  className="bg-[#8cc210] text-white border border-[#8cc208] shadow-md shadow-black gap-2 p-4 md:w-72 flex flex-col items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out w-35"
                  onClick={() =>
                    handleNav(() => {
                      setProductsColor(false);
                      setDashboardColor(false);
                      setSuppliersColor(true);
                      setCustomersColor(false);
                      setStatistics(false);
                      setSettings(false);
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon="fa-cart-shopping"
                    className="text-4xl md:text-5xl opacity-50"
                  />
                  <h3 className="text-lg md:text-xl">Suppliers</h3>
                </div>
                <div
                  className="bg-orange-500 text-white border border-orange-500 shadow-md shadow-black gap-2 p-4 md:w-72 flex flex-col items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out w-35"
                  onClick={() =>
                    handleNav(() => {
                      setProductsColor(false);
                      setDashboardColor(false);
                      setSuppliersColor(false);
                      setCustomersColor(true);
                      setStatistics(false);
                      setSettings(false);
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon="fa-users"
                    className="text-4xl md:text-5xl opacity-50"
                  />
                  <h3 className="text-lg md:text-xl">Customers</h3>
                </div>
                <div
                  className="bg-violet-800 text-white cursor-pointer border border-violet-600 shadow-md shadow-black p-4 md:w-72 flex flex-col gap-2 items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out w-35"
                  onClick={() =>
                    handleNav(() => {
                      setProductsColor(false);
                      setDashboardColor(false);
                      setSuppliersColor(false);
                      setCustomersColor(false);
                      setStatistics(true);
                    })
                  }
                >
                  <FontAwesomeIcon
                    icon="fa-chart-bar"
                    className="text-4xl md:text-5xl opacity-50"
                  />
                  <h3 className="text-lg md:text-xl">Statistics</h3>
                </div>
                <div
                  className="bg-[#fefeff] border border-black shadow-md shadow-black p-4 md:w-72 flex flex-col gap-2 items-center justify-center h-28 rounded-2xl hover:scale-95 transition-all duration-500 ease-in-out w-35"
                  onClick={() => {
                    setProductsColor(false);
                    setDashboardColor(false);
                    setSuppliersColor(false);
                    setCustomersColor(false);
                    setStatistics(false);
                    setSettings(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon="fa-gear"
                    className="text-4xl md:text-5xl text-[darkred]"
                  />
                  <h3 className="text-lg md:text-xl">Settings</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*any other code below here is another navigation section */}
        <section
          className={`${productsColor ? "flex md:ml-16 w-[98vw] md:w-full ml-2 h-[93vh] overflow-auto" : "hidden"}`}
        >
          <ProductsPage />
        </section>

        {/*suppliers section */}
        <section
          className={`${suppliersColor ? "flex md:ml-16 ml-2 w-full h-[93vh] overflow-auto" : "hidden"}`}
        >
          <SuppliersPage />
        </section>
        {/*customer section */}
        <section
          className={`${customersColor ? "flex md:ml-16 ml-2 w-full h-[93vh] overflow-auto" : "hidden"}`}
        >
          <CustomersPage />
        </section>
        {/*statistics section */}
        <section
          className={`${statistics ? "flex md:ml-16 ml-2 w-full h-[93vh] overflow-auto" : "hidden"}`}
        >
          <StatisticsPage />
        </section>
        {/*settings page */}
        <section
          className={`${settings ? "flex md:ml-4 ml-2 w-full h-[93vh] overflow-auto" : "hidden"}`}
        >
          <Settings />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
