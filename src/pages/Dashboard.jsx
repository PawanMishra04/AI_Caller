import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Loader from "../components/Loader";
import ProfileSettings from "./Profile";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState([]);
  const [balance, setBalance] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [load, setLoad] = useState(true);
  const { isNightMode, toggleNightMode } = useNightMode();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const profileToggleRef = useRef(null);

  const getUserBalance = async () => {
    try {
      const response = await axios.get("/api/user/user_balance/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBalance(response.data.balance);
    } catch (e) {
      console.error("Balance fetch error:", e);
    }
  };



  const agentDashboard = async () => {
    try {
      const response = await axios.get("/api/api/agent/dashboard_data/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setDashboard(response.data);
      setLoad(false);
    } catch (e) {
      console.error("Dashboard fetch error:", e.response?.data || e.message);
    }
  };

  useEffect(() => {
    agentDashboard();
    getUserBalance();
  }, []);

  const handleCancel = () => setShowProfile((prev) => !prev);

  const handleClickOutside = (event) => {
    if (profileToggleRef.current?.contains(event.target)) return;
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredExecutions = dashboard?.executions?.filter((execution) => {
    const status = execution.status?.toLowerCase();
    const phoneNumber = execution.telephony_data?.to_number || "";
    return (
      status?.includes(searchQuery.toLowerCase()) ||
      phoneNumber.includes(searchQuery.toLowerCase())
    );
  }) || [];

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"} p-3 md:p-6 sm:mr-0 lg:p-9 md:ml-48`}>
      <div className="flex flex-col md:flex-row justify-between mt-5 md:mt-0">
        <div className="flex items-center">
          {/* <img
            src="./images/MAITRIAILOGO4.png"
            alt="Company Logo"
            className="w-40 sm:hidden -mt-0 ml-10"
          /> */}
          <div className="hidden sm:block font-bold text-2xl md:text-3xl">
            Dashboard Overview
            <p className="text-lg md:text-xl font-semibold text-gray-400">
              Monitor your AI calling performance
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4 ">
          <button
            className="flex items-center bg-gray-100 rounded-full sm:rounded-md p-2 text-lg font-semibold text-gray-600 absolute sm:static top-4 right-14 gap-2"
            onClick={toggleNightMode}
          >
            {isNightMode ? (
              <>
                <h2 className="hidden sm:inline">Light mode</h2>
                <img src="./images/Light mode.png" alt="" />
              </>
            ) : (
              <>
                <h2 className="hidden sm:inline">Night mode</h2>
                <img
                  src="./images/material-symbols-light_dark-mode-rounded.png"
                  alt=""
                />
              </>
            )}
          </button>

         

          <div
            ref={profileToggleRef}
            className="w-9 h-9 sm:w-12 sm:h-12 mr-10 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-bold cursor-pointer absolute sm:static top-0 -right-8"
            onClick={handleCancel}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={512}
              height={512}
              viewBox="0 0 512 512"
            >
              <path
                fill="white"
                fillRule="evenodd"
                d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {showProfile && (
        <div ref={profileRef}>
          <ProfileSettings handleCancel={handleCancel} />
        </div>
      )}

      <div className={`${isNightMode ? "bg-black text-white" : "bg-white text-gray-700"} shadow-sm rounded-md mt-6 text-lg p-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4`}>
        <div className="flex items-center justify-end w-full mt-4 md:mt-0">
          <h2 className="text-orange-500 bg-white p-2 rounded-lg font-medium">
            Available Balance : {balance}
          </h2>
          <Link to="/recharge">
            <button className="ml-4">Recharge Now</button>
          </Link>
        </div>
      </div>

      {load && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-30">
          <Loader />
        </div>
      )}

      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
        <DashboardCard isNightMode={isNightMode} title="Total Calls" value={dashboard.total_calls} image="./images/div.png" />
        <DashboardCard isNightMode={isNightMode} title="Successful Calls" value={dashboard.successful_calls} image="./images/div (1).png" />
        <DashboardCard isNightMode={isNightMode} title="Avg. Call Duration" value={`${dashboard.total_duration_minutes} Min`} image="./images/div (2).png" />
        <DashboardCard isNightMode={isNightMode} title="Total Cost" value={dashboard.total_call_cost_with_extra_charge} image="./images/div (3).png" />
      </div>
       <div className={`${isNightMode ? "bg-gray-600 text-white" : "bg-white text-gray-700"} border rounded-lg flex items-center w-[] md:w-auto mt-8`}>
            <img src="./images/Frame.png" alt="" className="w-5 h-5 ml-3" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-4 p-2 mr-16 outline-none bg-transparent w-full md:w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

      <div className={`${isNightMode ? "bg-customDarkGray text-white" : "bg-white text-gray-800"} my-6 mt-6 rounded-lg w-full`}>
        <div className="flex justify-between items-center border-b p-6">
          <h2 className="text-lg font-semibold">Recent Calls</h2>
          <button onClick={() => navigate("/call-logs")} className="text-blue-500 font-medium hover:underline">
            View All
          </button>
        </div>

        <div className={`${isNightMode ? "bg-gray-700 text-white" : "bg-white text-gray-500"} p-4 overflow-x-auto`}>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2 px-2 sm:px-0 whitespace-nowrap">Phone Number</th>
                <th className="pb-2 px-4 sm:px-0">Campaign</th>
                <th className="pb-2 px-4 sm:px-0">Duration</th>
                <th className="pb-2 px-4 sm:px-0">Status</th>
                <th className="pb-2 px-7 sm:px-7">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredExecutions.slice(0, 10).map((execution) => (
                <tr key={execution.id} className="text-sm border-t">
                  <td className="py-3">{execution.telephony_data?.to_number || "N/A"}</td>
                  <td>{execution.batch_id ? `Batch ${execution.batch_id.slice(0, 8)}` : "Single Call"}</td>
                  <td className="">{execution.conversation_duration? formatDuration(execution.conversation_duration) : "0s"}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${execution.status === "completed" ? "bg-green-100 text-green-700" : execution.status === "busy" || execution.status === "no-answer" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                      {execution.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-7">{new Date(execution.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ isNightMode, title, value, image }) => (
  <div className={`${isNightMode ? "bg-customDarkGray text-white" : "bg-white text-gray-800"} shadow-sm text-end text-lg p-6 rounded-lg relative`}>
    <img src={image} alt="" className="absolute" />
    <h1 className="text-3xl font-bold mt-12 flex">{value}</h1>
    <h2 className="text-gray-500 flex">{title}</h2>
  </div>
);

export default Dashboard;