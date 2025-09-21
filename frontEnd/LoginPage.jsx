import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  console.log(import.meta.env.VITE_BACKEND_ADDRESS);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_ADDRESS}/auth/login`, {
        email,
        password,
      },{withCredentials:true});

      setMessage(` Login successful: Welcome ${response.data.user}`);
      navigate("/home"); 
    } catch (error) {
      if (error.response) {
        setMessage(` ${error.response.data.message}`);
      } else {
        setMessage("Something went wrong!");
      }
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Login
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={handleRegister}
              className="w-full border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Create an account
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
