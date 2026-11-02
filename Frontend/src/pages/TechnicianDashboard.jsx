import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function TechnicianDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isTechnician = user?.role === "technician";
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const statusClasses = {
    open: "text-bg-warning",
    in_progress: "text-bg-primary",
    resolved: "text-bg-success",
  };

  useEffect(() => {
    if (!isTechnician) return;
    const fetchAssignedReports = async () => {
      try {
        const response = await axios.get(
          "https://fixflow-backend-4hrf.onrender.com/api/reports/assigned",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setReports(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedReports();
  }, [isTechnician]);

  const handleStatusChange = async (id, status) => {
    if (updatingId) return;
    setUpdatingId(id);
    setUpdateError("");
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `https://fixflow-backend-4hrf.onrender.com/api/reports/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setReports((prevReports) =>
        prevReports.map((report) => {
          if (report._id !== id) {
            return report;
          }
          return {
            ...report,
            status: response.data.status,
          };
        }),
      );
    } catch (error) {
      setUpdateError(error.response?.data?.message || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-2">Technician Dashboard</h2>
        <p className="text-secondary mb-0">
          View your assigned maintenance reports and update their status.
        </p>
      </div>
      {!isTechnician ? (
        <div className="alert alert-danger" role="alert">
          This page is only available to technicians.
        </div>
      ) : loading ? (
        <p className="text-secondary" role="status">
          Loading assigned reports...
        </p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="alert alert-info" role="status">
          No maintenance reports are assigned to you yet.
        </div>
      ) : (
        <div>
          {updateError && (
            <div className="alert alert-danger text-break" role="alert">
              Could not update report status. {updateError}
            </div>
          )}
          <div className="row g-3">
            {reports.map((elem) => {
              return (
                <div key={elem._id} className="col-12 col-md-6 col-xl-4">
                  <div className="card bg-white shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start gap-2 pb-2">
                        <h5 className="card-title text-break">{elem.title}</h5>
                        <span
                          className={`badge flex-shrink-0 ${statusClasses[elem.status] ?? "text-bg-secondary"}`}
                        >
                          {elem.status === "in_progress"
                            ? "in progress"
                            : elem.status}
                        </span>
                      </div>
                      <p className="card-text text-secondary text-break mb-3">
                        {elem.location?.name || "Location unavailable"}
                      </p>
                      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-auto border-top pt-3">
                        <Link
                          to={`/reports/${elem._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                        <span className="badge bg-light text-dark border ms-auto">
                          Priority Score: {elem.priorityScore}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label
                          htmlFor={`status-${elem._id}`}
                          className="form-label fw-semibold"
                        >
                          Update status
                        </label>
                        <select
                          id={`status-${elem._id}`}
                          className="form-select"
                          value={elem.status}
                          disabled={Boolean(updatingId)}
                          onChange={(e) => {
                            handleStatusChange(elem._id, e.target.value);
                          }}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        {updatingId === elem._id && (
                          <p
                            className="text-secondary small mt-2 mb-0"
                            role="status"
                          >
                            Updating status...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export default TechnicianDashboard;
