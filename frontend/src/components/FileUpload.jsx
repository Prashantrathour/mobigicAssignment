import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {ToastContainer} from "react-toastify"
import { errorAlert, succesAlert, warningAlert } from '../Notification';
import {useNavigate} from "react-router-dom"
const FileUpload = ({update,setupdate}) => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploaded(false)
  };

  const handleUpload = async () => {
    if (!file) {
      warningAlert('Please select a file.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token'); 
      const formData = new FormData();
      formData.append('file', file);

     
      const headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      };

     
      const res=await axios.post(process.env.REACT_APP_BASEURL+'/files/upload', formData, { headers });
      succesAlert(res.data.msg)
      alert("your code is "+res?.data?.code+" Please note")
      setUploaded(!update);
      setupdate(!update)
    } catch (error) {
      console.error('Error uploading file:', error);
      errorAlert(error?.response?.data?.msg||'Error uploading file:')
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
let token=localStorage.getItem("token")
if(!token){
navigate("/login")
}
},[])
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
    <ToastContainer/>
      <input type="file" onChange={handleFileChange} className="mb-4" />

      <button
        onClick={handleUpload}
        disabled={loading || uploaded}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
      >
        {loading ? 'Uploading...' : uploaded ? 'Uploaded' : 'Upload'}
      </button>

      {loading && <p className="text-gray-500">Uploading...</p>}
      {uploaded && <p className="text-green-500">File uploaded successfully!</p>}
    </div>
  );
};

export default FileUpload;
