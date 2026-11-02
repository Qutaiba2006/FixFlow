import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const statusClasses = {
    open: "text-bg-warning",
    in_progress: "text-bg-primary",
    resolved: "text-bg-success",
  };

  useEffect(() => {
    if (!isAdmin) return;
    const fetchDashboard = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT")}`,
          },
        });
        const techniciansResponse = await axios.get(
          "http://localhost:5000/api/users/technicians",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setReports(response.data);
        setTechnicians(techniciansResponse.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isAdmin]);

  const handleAssign = async (id) => {
    const technicianId = selectedTechnicians[id];
    if (updatingId || !technicianId) return;
    setUpdatingId(id);
    setUpdateError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `http://localhost:5000/api/reports/${id}/assign`,
        { technicianId },
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
            assignedTo: response.data.report.assignedTo,
          };
        }),
      );
      setSuccessMessage(response.data.message);
    } catch (error) {
      setUpdateError(error.response?.data?.message || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    if (updatingId) return;
    setUpdatingId(id);
    setUpdateError("");
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `http://localhost:5000/api/reports/${id}/status`,
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
      setSuccessMessage(response.data.message);
    } catch (error) {
      setUpdateError(error.response?.data?.message || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-2">Admin Dashboard</h2>
        <p className="text-secondary mb-0">
          Manage maintenance reports and assign technicians.
        </p>
      </div>
      {!isAdmin ? (
        <div className="alert alert-danger" role="alert">
          This page is only available to admins.
        </div>
      ) : loading ? (
        <p className="text-secondary" role="status">
          Loading reports and technicians...
        </p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="alert alert-info" role="status">
          No maintenance reports have been submitted yet.
        </div>
      ) : (
        <div>
          {updateError && (
            <div className="alert alert-danger text-break" role="alert">
              Could not update report. {updateError}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="status">
              {successMessage}
            </div>
          )}
          {technicians.length === 0 && (
            <div className="alert alert-warning" role="status">
              No active technicians are available for assignment.
            </div>
          )}
          <div className="row g-3">
            {reports.map((elem) => {
              let assignedTechnician = elem.assignedTo
                ? "Assigned technician unavailable"
                : "Unassigned";
              for (const technician of technicians) {
                if (technician._id === elem.assignedTo) {
                  assignedTechnician = technician.name;
                }
              }
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
                      <p className="card-text text-secondary text-break mb-2">
                        {elem.location?.name || "Location unavailable"}
                      </p>
                      <p className="card-text text-break mb-3">
                        Assigned technician: {assignedTechnician}
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
                          htmlFor={`technician-${elem._id}`}
                          className="form-label fw-semibold"
                        >
                          Assign technician
                        </label>
                        <select
                          id={`technician-${elem._id}`}
                          className="form-select mb-2"
                          value={selectedTechnicians[elem._id] || ""}
                          disabled={
                            Boolean(updatingId) || technicians.length === 0
                          }
                          onChange={(e) => {
                            const technicianId = e.target.value;
                            setSelectedTechnicians((prevTechnicians) => ({
                              ...prevTechnicians,
                              [elem._id]: technicianId,
                            }));
                          }}
                        >
                          <option value="">Select a technician</option>
                          {technicians.map((technician) => {
                            return (
                              <option
                                key={technician._id}
                                value={technician._id}
                              >
                                {technician.name} ({technician.email})
                              </option>
                            );
                          })}
                        </select>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={
                            Boolean(updatingId) ||
                            !selectedTechnicians[elem._id] ||
                            selectedTechnicians[elem._id] === elem.assignedTo
                          }
                          onClick={() => handleAssign(elem._id)}
                        >
                          Assign Technician
                        </button>
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
                            Updating report...
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
export default AdminDashboard;
