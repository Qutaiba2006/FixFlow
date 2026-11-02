import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.removeItem("JWT");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid px-3 px-lg-4">
          <Link
            to="/dashboard"
            className="navbar-brand d-flex align-items-center gap-2 text-primary fw-bold"
          >
            FixFlow
            <i className="bi bi-tools me-2"></i>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user?.role === "technician" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/technician-dashboard">
                    Technician Dashboard
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/my-reports">
                  My Reports
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Campus Feed
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn border-0"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  Account
                </button>

                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/account">
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
            <Link
              to="/reports/new"
              className="btn btn-primary align-self-start flex-shrink-0"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create Report
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
