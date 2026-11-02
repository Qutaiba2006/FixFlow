import { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard";
function Dashboard() {
  const [reports, setReports] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [interactionErrors, setInteractionErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const searchTerm = search.trim().toLowerCase();
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.title || "").toLowerCase().includes(searchTerm) ||
      (report.description || "").toLowerCase().includes(searchTerm) ||
      (report.location?.name || "").toLowerCase().includes(searchTerm);
    const matchesStatus =
      statusFilter === "active"
        ? report.status === "open" || report.status === "in_progress"
        : statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const reportsPerPage = 6;
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage,
  );
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          "https://fixflow-backend-4hrf.onrender.com/api/reports",
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
    fetchReports();
  }, []);
  const handleSupport = async (id) => {
    if (pendingReports.includes(id)) return;
    setPendingReports((prevReports) => [...prevReports, id]);
    setInteractionErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `https://fixflow-backend-4hrf.onrender.com/api/reports/${id}/support`,
        {},
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
            supportCount: response.data.supportCount,
            affectedCount: response.data.affectedCount,
            priorityScore: response.data.priorityScore,
          };
        }),
      );
    } catch (error) {
      setInteractionErrors((prevErrors) => ({
        ...prevErrors,
        [id]: error.response?.data?.message || error.message,
      }));
    } finally {
      setPendingReports((prevReports) =>
        prevReports.filter((reportId) => reportId !== id),
      );
    }
  };
  const handleAffected = async (id) => {
    if (pendingReports.includes(id)) return;
    setPendingReports((prevReports) => [...prevReports, id]);
    setInteractionErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `https://fixflow-backend-4hrf.onrender.com/api/reports/${id}/affected`,
        {},
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
            supportCount: response.data.supportCount,
            affectedCount: response.data.affectedCount,
            priorityScore: response.data.priorityScore,
          };
        }),
      );
    } catch (error) {
      setInteractionErrors((prevErrors) => ({
        ...prevErrors,
        [id]: error.response?.data?.message || error.message,
      }));
    } finally {
      setPendingReports((prevReports) =>
        prevReports.filter((reportId) => reportId !== id),
      );
    }
  };
  return (
    <div className="container py-3">
      <div className="mb-3">
        <h2 className="fw-bold text-dark mb-2">Campus Feed</h2>
        <p className="text-secondary mb-0">
          See and follow maintenance reports around campus.
        </p>
      </div>
      {loading ? (
        <p className="text-secondary" role="status">
          Loading reports...
        </p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className="row g-2 align-items-end mb-3">
            <div className="col-12 col-md-8">
              <label
                htmlFor="report-search"
                className="form-label fw-semibold mb-1"
              >
                Search Reports
              </label>
              <input
                id="report-search"
                type="search"
                className="form-control"
                placeholder="Search title, description, or location"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-12 col-md-4">
              <label
                htmlFor="report-status"
                className="form-label fw-semibold mb-1"
              >
                Status
              </label>
              <select
                id="report-status"
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="active">Active</option>
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          <p className="text-secondary mb-3" role="status" aria-live="polite">
            {filteredReports.length} matching{" "}
            {filteredReports.length === 1 ? "report" : "reports"}
          </p>
          {filteredReports.length === 0 ? (
            <div className="alert alert-info" role="status">
              {reports.length === 0
                ? "No reports yet. Create a report to get started."
                : "No reports match your search and status filter. Try another search or select All."}
            </div>
          ) : (
            <div className="row g-3">
              {paginatedReports.map((elem) => {
                return (
                  <div key={elem._id} className="col-12 col-md-6 col-xl-4">
                    <ReportCard
                      report={elem}
                      onSupport={handleSupport}
                      onAffected={handleAffected}
                      isPending={pendingReports.includes(elem._id)}
                      interactionError={interactionErrors[elem._id]}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {totalPages > 1 && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-3">
              <p className="text-secondary mb-0">
                Page {currentPage} of {totalPages}
              </p>
              <nav aria-label="Campus Feed pages">
                <ul className="pagination flex-wrap mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default Dashboard;
