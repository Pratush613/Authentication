import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css'; 



const User: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch("http://localhost:3000/protected", {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        const yourName = result.msg.charAt(0).toUpperCase() + result.msg.slice(1)
        setUserName(yourName);
      }
    };
    fetchData();
  }, []);

  function handleLogout(){
    localStorage.removeItem("token")
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-blue-500 text-white relative">
      <div className="absolute top-0 left-0 p-4 text-2xl font-bold">
        {userName}
      </div>
      <div className="content bg-white p-8 rounded-lg shadow-lg text-center text-gray-800 w-full max-w-md">
        <p className="text-2xl font-bold">Welcome to the User Dashboard</p>
        <p className="mt-4 text-gray-600">Your user name is displayed at the top left corner.</p>
        <button 
          onClick={handleLogout}
          className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default User;
