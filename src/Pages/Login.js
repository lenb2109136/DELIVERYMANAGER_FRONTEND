import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const navigate = useNavigate();
  const [isCustomer, setIsCustomer] = useState(false);

  const handleLogin = () => {
    var userName = document.getElementById("sdt").value;
    var pass = document.getElementById("pas").value;
    const loginUrl = isCustomer
      ? "http://localhost:8080/login/customer"
      : "http://localhost:8080/login/nhanvien";

    axios
      .post(
        loginUrl,
        { sdt: userName, password: pass },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        localStorage.setItem("accessToken", response.data.data.token);
        localStorage.setItem("role", JSON.stringify(response.data.data.role));
        
        if (response.data.data.role === "SHIPPER") {
          navigate("/shipper");
        }
        if (response.data.data.role === "ADMIN") {
          navigate("/admin");
        }
        if (isCustomer) {
          navigate("/customer"); 
        }
      })
      .catch((error) => {
        alert(error.response?.data?.message || "Có lỗi xảy ra");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <div className="text-white bg-blue-700 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-12 h-12"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="17" cy="20" r="1" />
              <path d="M3 3h4l3 8m5-8h6m-3 16a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
          </div>
        </div>
        <input
          type="text"
          placeholder="PHONE NUMBER"
          id="sdt"
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          id="pas"
          placeholder="PASSWORD"
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isCustomer"
            checked={isCustomer}
            onChange={(e) => setIsCustomer(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isCustomer">Bạn là khách hàng?</label>
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default LoginComponent;
