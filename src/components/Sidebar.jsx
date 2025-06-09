import { useState,  useEffect } from "react";
import { Link } from "react-router-dom";
import { useNightMode } from "../contexts/NightModeContext";
import { useLogin } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiPhoneCallFill } from "react-icons/pi";
import { RiBillFill } from "react-icons/ri";
import { FaBullhorn } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [active, setActive] = useState(location.pathname);
  // const [active, setActive] = useState("false"z);
  const { isNightMode, toggleNightMode } = useNightMode();

  const { logout } = useLogin(); // Get logout function here
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout(); // Call the logout function
  };
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LuLayoutDashboard />,
      // icon: "",
      // activeIcon: "./images/dashboadicon.webp",
      activeIcon: <LuLayoutDashboard />,
    },
    {
      name: "Call Logs",
      path: "/call-logs",
      icon: <PiPhoneCallFill />
,
      activeIcon: <PiPhoneCallFill />
,
    },
    {
      name: "Billing & Usage",
      path: "/billing",
      icon: <RiBillFill />
,
      activeIcon: <RiBillFill />
,
    },
    {
      name: "Campaigns",
      path: "/campaigns",
      icon: <FaBullhorn />
,
      activeIcon: <FaBullhorn />
,
    },
  ];
  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div className=" relative sm:pr-16 ">
      {/* Toggle Button */}
      <button
        className="absolute top-4 left-1 z-50 text-2xl p-2 rounded md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      <div
        className={`fixed top-0 left-0 h-screen w-full shadow-xl  transition-transform duration-300 z-40  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:fixed md:left-0 md:top-0 md:h-screen md:w-64 ${isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
          } flex flex-col`}
      >
        {/* Logo Section */}
        <div className="border-b-2 p-5 ">
          <div className="flex p-4 justify-center items-center">
            <img src="./images/LogoTagline.png" alt="logo" className="h-24 w-24" />
          </div>
        </div>

        {/* Sidebar Menu */}
        <div
          className={`${isNightMode ? "bg-gray-950 text-white" : "bg-white text-gray-700"
            }   mt-10 p-2`}
        >
          {menuItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              onClick={() => {
                setActive(item.path);
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              className={`flex items-center mb-7 gap-3 px-4 py-3 w-[100%] rounded-lg transition-all duration-300
                            ${active === item.path
                  ? "bg-blue-100  text-[#BD695D] "
                  : " relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-[#BD695D] after:transition-all after:duration-300 hover:after:w-full"
                }
                        `}
            >
              {/* Icon changes when active */}
                <span className="h-auto w-auto flex justify-center pt-1">
                {active === item.path ? item.activeIcon : item.icon}
              </span>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto mb-6 px-4">
        <button
          className={`flex items-center text-2xl gap-2 px-4 py-3 w-full text-red-600 rounded-lg transition-all duration-300
                        ${active === "Logout"
              ? "bg-blue-100 text-pink-500"
              : " relative pb-3 after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[3px] after:bg-red-500 after:transition-all after:duration-300 hover:after:w-full"
            }
                    `}
          onClick={handleLogout}
        >
        <MdLogout />
        Logout
        </button>
        </div>
        
      </div>

    </div>

  );
};

export default Sidebar;
