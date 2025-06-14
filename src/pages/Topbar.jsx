import { useRef,useState } from 'react';
import { useNightMode } from "../contexts/NightModeContext";
import ProfileSettings from './Profile';
const Topbar = ({text, desc}) => {
      const { isNightMode, toggleNightMode } = useNightMode();
  const profileToggleRef = useRef(null);
    const [showProfile, setShowProfile] = useState(false);
    const ProfileRef = null;

const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };

  return (
    <>
          <div className="flex flex-col md:flex-row justify-between mt-5 md:mt-0">
        <div className="flex items-center">
          {/* <img
            src="./images/MAITRIAILOGO4.png"
            alt="Company Logo"
            className="w-40 sm:hidden -mt-0 ml-10"
          /> */}
          <div className="hidden sm:block font-bold text-2xl md:text-3xl">
            {text}
            <p className="text-lg md:text-xl font-semibold text-gray-400">
             {desc}
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

          {showProfile && (
        <div ref={ProfileRef}>
          <ProfileSettings handleCancel={() => setShowProfile(false)} />
        </div>
      )}

          <div
            ref={profileToggleRef}
            className="w-9 h-9 sm:w-12 sm:h-12 mr-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-bold cursor-pointer absolute sm:static top-0 -right-8"
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

      
    </>
  )
}

export default Topbar;