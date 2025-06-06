import { useEffect, useState } from "react";
import { useNightMode } from "../contexts/NightModeContext";
import axios from "../helper/axios";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Loader from "../components/Loader";
import ProfileSettings from "./Profile";
const Campaigns = () => {
  const [showForm, setShowForm] = useState(false);
  // const { isNightMode } = useNightMode();
  const [fileData, setFileData] = useState(null);
  const [BatchData, setBatchData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("12:00");
  const [batchId, setBatchId] = useState("");
  const token = localStorage.getItem("token");
  const [load, setLoad] = useState(true);
  const { isNightMode, toggleNightMode } = useNightMode();

  const DeleteBatch = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`/api/batches/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response) {
          Swal.fire({
            icon: "success",
            title: "data is deleted",
          });
          window.location.reload();


        }
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: `${e}`,
        });
      }
    }

  };
  const handleSchedule = () => {
    if (!batchId) {
      Swal.fire({
        icon: "error",
        title: "Batch ID is missing!",
      });
      return;
    }

    const [hours, minutes] = time.split(":");
    const scheduledDate = new Date(date);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const scheduled_at = scheduledDate.toISOString().slice(0, 19);

    // console.log("Scheduled Time:", scheduled_at);
    // console.log("Batch ID:", batchId);

    setScheduledTime(scheduled_at);
    setShowCalendar(false);
    ScheduleCall(scheduled_at);
  };

  const ScheduleCall = async (scheduled_at) => {
    try {
      const response = await axios.post(
        "/api/batches/schedule/call/",
        {
          batch_id: batchId,
          scheduled_at: scheduled_at,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Call Scheduled Successfully",
      });
      // console.log(response.data);
    } catch (e) {
      const errorMessage = e.response?.data?.detail || e.message;
      Swal.fire({
        icon: "error",
        title: "Error Scheduling Call",
        text: `${errorMessage}`,
      });
    }
  };

  const getBatch = async () => {
    try {
      const response = await axios.get("/api/batches/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setBatchData(response.data);
      setLoad(false);
    } catch (e) {
      console.error("Error fetching batches:", e.response?.data);
    }
  };

  const handleFileChange = (e) => {


    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setFileData(file);
    } else {

      Swal.fire({
        icon: 'warning',
        title: "Please Upload .CSV file",
      });
      e.target.value = "";
    }

  };

  const BatchCreate = async () => {
    try {
      const formData = new FormData();
      formData.append("file", fileData);

      await axios.post("/api/batch_create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        icon: "success",
        title: "File Uploaded Successfully",
      });
      setShowForm(false);
      getBatch(); // Refresh batch list after upload
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: `${e.response?.data?.message || "Upload failed"}`,
      });
    }
  };

  useEffect(() => {
    getBatch();
  }, []);
  const ProfileRef = (null);
  const profileToggleRef = (null);
    const [showProfile, setShowProfile] = useState(false);

  const handleCancel = () => {
    setShowProfile(!showProfile); // Toggle profile visibility
  };
  return (
    <div
      className={`${isNightMode ? "bg-black text-white" : "bg-gray-50 text-gray-700"
        } p-4 md:p-6 lg:p-9 h-screen md:ml-48`}
    >
      <div className="flex flex-col  md:flex-row justify-end">
        {/* Show logo on mobile and text on larger screens */}
       
        <div className="flex flex-col md:flex-row items-center mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-4">
          <button
            className="flex items-center bg-gray-100 rounded-full sm:rounded-md p-2 text-lg font-semibold text-gray-600 absolute sm:static top-4 right-14 gap-2"
            onClick={toggleNightMode}
          >
            {isNightMode ? (
              <>
                <h2 className="hidden sm:inline"> Light mode{" "}</h2>
                <img src="./images/Light mode.png" alt="" className="" />
              </>
            ) : (
              <> 
                <h2 className="hidden sm:inline">Night mode</h2>
                <img src="./images/material-symbols-light_dark-mode-rounded.png" alt="" className="" />
              </>
            )}
          </button>

          <div
            ref={profileToggleRef}
            className="w-9 h-9 sm:w-12 sm:h-12 mr-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl sm:text-3xl font-bold cursor-pointer absolute sm:static top-0 -right-3 "
            onClick={handleCancel}
          >
            {/* {profileData?.username?.slice(0, 1)} */}
            <svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512"><path fill="white" fillRule="evenodd" d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64"></path></svg>

          </div>

          {/* <img src="./images/Rectangle.webp" alt="" className="w-10 h-10 cursor-pointer" onClick={handleCancel} /> */}
        </div>
      </div>

      <div
        className={`${isNightMode ? "bg-black text-white" : "bg-white text-gray-700"
          } flex justify-between shadow p-4 mt-10 rounded-lg `}
      >
        <h1 className="text-3xl flex items-center font-bold">Campaigns</h1>
        <button
          onClick={() => setShowForm(true)}
          className="border flex text-white text-lg bg-orange-500 hover:bg-orange-700 rounded-lg px-5 p-3 items-center gap-2"
        >
          New Campaign
        </button>
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-[9999]">
          <div
            className={`${isNightMode
                ? "bg-customDarkGray text-white"
                : "bg-gray-50 text-gray-700"
              } border w-[90%] sm:w-[30%] py-8 shadow-lg rounded-xl p-6 mt-6`}
          >
            <h2 className="text-2xl flex justify-between font-bold mb-7">
              Create New Campaign
              <button onClick={() => setShowForm(false)}>X</button>
            </h2>
            <form>
              <div className="mb-4">
                <label className="block font-medium mb-2">Upload File</label>
                <input
                  type="file"
                  className="w-full border rounded-lg px-4 py-2 text-gray-700"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
            </form>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-black px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition"
                onClick={BatchCreate}
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
      {load && (
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
        //   <Loader />
        // </div>
        <div className="fixed inset-0 right-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-30">
          <Loader />
        </div>
      )}
       {showProfile && (
        <div ref={ProfileRef}><ProfileSettings handleCancel={() => setShowProfile(false)} /></div>
      )}
      {showCalendar && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70 z-[1000]">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-3">Schedule Campaign</h2>
            <Calendar onChange={setDate} value={date} className="mb-3" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border p-2 rounded mb-3 w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowCalendar(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shadow-md mt-9 overflow-x-auto">
        <table className="min-w-full rounded-lg border">
          <thead>
            <tr
              className={`${isNightMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
                } text-left border-b`}
            >
              <th className="p-3">Campaign Name</th>
              <th className="p-3">Caller</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {BatchData.map((batch) => (
              <tr
                key={batch.batch_id}
                className={`${isNightMode
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-700"
                  } h-14`}
              >
                <td className="p-3">{batch.file_name}</td>
                <td className="p-3">{batch.from_phone_number}</td>
                <td className="p-3">{batch.status}</td>
                <td className="p-3">{batch.created_at}</td>
                <td className="p-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowCalendar(true);
                      setBatchId(batch.batch_id);
                    }}
                    className="bg-green-500 p-2 px-4 text-white rounded-lg"
                  >
                    Schedule
                  </button>
                  <MdDelete
                    className="cursor-pointer"
                    size={25}
                    onClick={() => DeleteBatch(batch.batch_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;
