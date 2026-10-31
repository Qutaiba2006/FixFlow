import { Link } from "react-router-dom";
function Account() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="container py-5">
      <div
        className="card shadow-sm border-0 rounded-3 mx-auto"
        style={{ maxWidth: "480px" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i
              className="bi bi-person-circle text-primary"
              style={{ fontSize: "60px" }}
            ></i>
            <h3 className="fw-bold mt-2">{user?.name ?? "Unknown User"}</h3>
            <span className="badge text-bg-primary">
              {user?.role ?? "Unknown"}
            </span>
          </div>
          <hr />
          <div className="mb-3">
            <label className="fw-semibold text-secondary mb-1">
              <i className="bi bi-person me-2"></i>
              Full Name
            </label>
            <p className="mb-0">{user?.name ?? "N/A"}</p>
          </div>
          <div className="mb-3">
            <label className="fw-semibold text-secondary mb-1">
              <i className="bi bi-envelope me-2"></i>
              Email Address
            </label>
            <p className="mb-0 text-break">{user?.email ?? "N/A"}</p>
          </div>
          <div className="mb-4">
            <label className="fw-semibold text-secondary mb-1">
              <i className="bi bi-shield-check me-2"></i>
              Account Role
            </label>
            <p className="mb-0 text-capitalize">{user?.role ?? "N/A"}</p>
          </div>
          <Link to="/dashboard" className="btn btn-primary w-100">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Account;
