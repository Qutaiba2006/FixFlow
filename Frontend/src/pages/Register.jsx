import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: name,
        email: email,
        password: password,
      });
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light p-4">
      <div
        className="card shadow-sm border-0 rounded-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4">
          <h3 className="mb-3 text-center fw-bold text-primary mb-2">
            <i className="bi bi-tools me-2"></i>
            FixFlow
          </h3>
          <form className="mb-3  rounded-3 py-2" onSubmit={handleSubmit}>
            <label htmlFor="name" className="form-label  fw-bold">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              className="form-control mb-3"
              placeholder="Enter your Full name"
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label htmlFor="email" className="form-label  fw-bold">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              className="form-control mb-3"
              placeholder="Enter your email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="password" className="form-label  fw-bold">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              className="form-control mb-3"
              placeholder="Enter your password"
              required
              minLength={8}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3 py-2 fw-semibold"
            >
              Register
            </button>
            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
          </form>
          <p className="card-text mb-3 text-center">
            Already have an account?
            <Link to="/login" className="fw-bold  text-decoration-none">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
