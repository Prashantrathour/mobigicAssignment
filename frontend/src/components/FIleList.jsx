import React, { useState, useEffect } from "react";
import axios from "axios";
import saveAs from "file-saver";
import { FaClosedCaptioning, FaCross, FaSpinner } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { IoIosCloseCircle } from "react-icons/io";
import { errorAlert, succesAlert } from "../Notification";
import {useNavigate} from "react-router-dom"
const FileListItem = ({ file, onRemove, loading }) => {
  console.log(loading);
  const [Loading,setLoading]=useState(false)
  const [showModal, setShowModal] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [downloadError, setDownloadError] = useState(null);

  const handleDownload = async () => {
    setShowModal(true);
  };

  const handleConfirmDownload = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_BASEURL}/files/download/${codeInput}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      saveAs(res.data, file.filename);
      setShowModal(false);
      setCodeInput("");
      setDownloadError(null);
      setLoading(false)
    } catch (error) {
      console.error("Error downloading file:", error);
      errorAlert(error?.response?.statusText || "Error downloading file:");
      setDownloadError("Invalid code. Please try again.");
      setLoading(false)
    }
  };

  const handleRemove = async () => {
    onRemove(file._id);
  };

  return (
    <div className="mb-4">
      <ToastContainer />
      <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                File Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap ">
                <span className="max-w-[10rem] overflow-x-scroll inline-block">
                  {file.filename}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{file.code}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleDownload}
                  className="text-indigo-600 hover:text-indigo-900 border border-indigo-500 p-1 px-2 rounded-md focus:outline-none focus:underline"
                >
                  Download
                </button>{" "}
                <button
                  disabled={loading}
                  onClick={handleRemove}
                  className="text-red-600 hover:text-red-900 focus:outline-none border min-w-28 min-h-8 border-red-500 p-1 px-2 rounded-md focus:underline"
                >
                  {!loading ? (
                    <span className="">Remove</span>
                  ) : (
                    <FaSpinner className="animate-spin " />
                  )}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-1/2">
            <div className="flex  w-full justify-end">
              <button onClick={() => setShowModal(!showModal)}>
                <IoIosCloseCircle className="text-2xl" />
              </button>
            </div>
            <div className="w-full flex justify-between py-2 items-center">
              <p className="text-lg font-semibold mb-4">
                Enter 6-digit code to download:
              </p>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="py-[-10px] rounded-xl"
              />
            </div>
            {downloadError && (
              <p className="text-red-500 mb-4 w-full">{downloadError}</p>
            )}
            <button
              onClick={handleConfirmDownload}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {!Loading?"Confirm Download":"Loading...."}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FileList = ({ update, setupdate }) => {
  const navigate=useNavigate()
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          process.env.REACT_APP_BASEURL + "/files",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFiles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        errorAlert(error?.response?.data?.msg||"Please login again")
        if(!error?.response?.data?.login){
          navigate("/login")
        }
        setLoading(false);
      }
    };

    fetchFiles();
  }, [update]);

  const handleRemove = async (fileId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        process.env.REACT_APP_BASEURL +"/files/delete/" + fileId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      succesAlert(res?.data?.msg);
      setupdate(!update);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching files:", error);
      errorAlert(error?.response?.data?.msg || "Error fetching files:");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-10 p-6 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>
      <ToastContainer />
      {loading ? (
        <p className="text-gray-500">Loading files...</p>
      ) : files.length === 0 ? (
        <p className="text-gray-500">No files found.</p>
      ) : (
        <div>
          {files?.map((file) => (
            <FileListItem
              key={file._id}
              file={file}
              onRemove={handleRemove}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
