import React, { useState } from "react";
import axios from "axios"
import {ToastContainer,toast} from "react-toastify"
import { errorAlert, succesAlert } from "../Notification";
import { ImSpinner9 } from "react-icons/im";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom"
function Login() {
  const navigate=useNavigate()
   const [Loading,setLoading]=useState(false)
        const [formData, setFormData] = useState({
        
          username: '',
          password: '',
         
          
        });
      
        const handleChange = (e) => {
            
          const { name, value } = e.target;
          setFormData({
            ...formData,
            [name]: value,
          });
        };
        const LoginData=async(formData)=>{
            setLoading(true)
            try {
                let res=await axios.post(`${process.env.REACT_APP_BASEURL}/users/login`,{...formData})
                
               succesAlert(res.data.msg)
              
               localStorage.setItem("token",res.data.token)
               
                setLoading(false)
              navigate("/")
            } catch (error) {
                errorAlert(error.response.data.msg)
          setLoading(false)
            }
    
        } 
        const handleSubmit = (e) => {
          e.preventDefault();
        LoginData(formData)
          setFormData({
           
            username: '',
            password: '',
           
            
          })
        };
      
  return (
    <div className=" h-screen w-full bg-black flex justify-center items-center">
        <div >
        <ToastContainer/>
        <h1 className="font-mono text-white p-4 px-28 text-2xl font-semibold">User Login</h1>
    <form onSubmit={handleSubmit} className="max-w-lg overflow-hidden mx-auto bg-white p-4 rounded-2xl shadow-2xl shadow-red-600 text-left font-mono flex flex-col space-y-5">
      
      <div className="relative z-0 w-full mb-5 group flex flex-col text-left ">
        <input onChange={handleChange}
          type="text"
          name="username"
          value={formData.username}
          id="floating_username"
          className="block py-3 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="floating_username"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          username 
        </label>
      </div>
      <div className="relative z-0  mb-5 group">
        <input onChange={handleChange}
        value={formData.password}
          type="password"
          name="password"
          id="floating_password"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="floating_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Password
        </label>
      </div>
    
    
      <button
        type="submit"
        disabled={Loading}
        className="text-white flex justify-center items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
      {Loading?<ImSpinner9 className="animate-spin text-center text-xl" />:  "Submit"}
      </button>
      <Link to={"/register"} className="underline text-blue-600 text-right">New Member ?</Link>
    </form>


        </div>

    </div>
  );
}

export default Login;
