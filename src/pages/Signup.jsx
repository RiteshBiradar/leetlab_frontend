import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Input } from "../components/ui/input.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Signup data:", formData);

  const { name, email, password } = formData;

  if (!name || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      throw new Error("Signup failed");
    }

    const data = await response.json(); 
    console.log("Signup success:", data);

    alert("Signup successful!");
    navigate("/login");
  } catch (err) {
    console.error("Signup error:", err);
    alert("Signup failed. Try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-600">CodeChallenge</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-500 hover:text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
