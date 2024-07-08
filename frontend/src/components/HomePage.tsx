import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="text-center">
        <h1 className="text-white text-5xl font-bold mb-8">Welcome to Our Site</h1>
        <button
          onClick={handleLoginClick}
          className="bg-white text-blue-500 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition duration-200 mr-4"
        >
          Login
        </button>
        <button
          onClick={handleSignupClick}
          className="bg-white text-blue-500 font-semibold py-2 px-4 rounded hover:bg-blue-100 transition duration-200"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default HomePage;
