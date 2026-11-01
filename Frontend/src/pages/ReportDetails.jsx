import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const statusClasses = {
    open: "text-bg-warning",
    in_progress: "text-bg-primary",
    resolved: "text-bg-success",
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      setReport(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setReport(response.data.report || null);
      } catch (error) {
        if (error.response?.status !== 404) {
          setError(error.response?.data?.message || error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold text-dark mb-0">Report Details</h2>
        <Link
          to="/dashboard"
          className="btn btn-outline-primary align-self-start flex-shrink-0"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Campus Feed
        </Link>
      </div>
      {loading ? (
        <p className="text-secondary" role="status">
          Loading report...
        </p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : !report ? (
        <div className="alert alert-warning" role="alert">
          Report not found.
        </div>
      ) : (
        <div className="card bg-white shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start gap-2 pb-2">
              <h3 className="card-title text-break">{report.title}</h3>
              <span
                className={`badge flex-shrink-0 ${statusClasses[report.status] ?? "text-bg-secondary"}`}
              >
                {report.status === "in_progress"
                  ? "in progress"
                  : report.status}
              </span>
            </div>
            <p className="card-text text-break">{report.description}</p>
            <p className="card-text text-secondary text-break mb-3">
              Location: {report.location?.name || "Location unavailable"}
            </p>
            <div className="border-top pt-3">
              <span className="badge bg-light text-dark border">
                Priority Score: {report.priorityScore}
              </span>
            </div>
            {report.images?.length > 0 ? (
              <div className="row g-3 mt-3">
                {report.images.map((image, index) => {
                  return (
                    <div
                      key={image._id || image.url}
                      className="col-12 col-md-6"
                    >
                      <img
                        src={image.url}
                        alt={`${report.title} - image ${index + 1}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-secondary mt-3 mb-0">No images available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default ReportDetails;
