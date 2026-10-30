import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );
      localStorage.setItem("JWT", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Sign in  failed");
    }
  };
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light p-3">
      <div
        className="card shadow-sm border-0 rounded-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4">
          <h3 className="mb-3 text-center fw-bold text-primary mb-2">
            <i className="bi bi-tools me-2"></i>
            FixFlow
          </h3>
          <p className="text-center text-secondary mb-4">
            Welcome back! Sign in to your account.
          </p>
          <form className="mb-3  rounded-3 py-2" onSubmit={handleSubmit}>
            <label htmlFor="email" className="form-label fw-bold">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              className="form-control mb-3"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className="form-control mb-3"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3 py-2 fw-semibold"
            >
              Sign in
            </button>
            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
          </form>
          <p className="card-text mb-3 text-center">
            Don't have an account?
            <Link to="/register" className="fw-bold  text-decoration-none ms-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
