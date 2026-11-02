import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
function ReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionStatus, setActionStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const isOwner =
    Boolean(user?.id) &&
    user.id === (report?.reportedBy?._id || report?.reportedBy);
  const canManageReport = isOwner && report?.status === "open";
  const isProcessing = isSaving || isDeleting;
  const actionsBlocked = [401, 403, 404, 409].includes(actionStatus);
  const statusClasses = {
    open: "text-bg-warning",
    in_progress: "text-bg-primary",
    resolved: "text-bg-success",
  };
  const timelineActions = {
    created: "Created",
    assigned: "Assigned",
    status_changed: "Status changed",
  };
  const timeline = (report?.timeline || [])
    .slice()
    .sort((a, b) => new Date(a.at) - new Date(b.at));

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError("");
      setReport(null);
      setIsEditing(false);
      setTitle("");
      setDescription("");
      setActionError("");
      setActionStatus(null);
      setSuccessMessage("");
      try {
        const response = await axios.get(
          `https://fixflow-backend-4hrf.onrender.com/api/reports/${id}`,
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

  const handleEdit = () => {
    if (!canManageReport || isProcessing || actionsBlocked) return;
    setTitle(report.title);
    setDescription(report.description);
    setActionError("");
    setSuccessMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isProcessing) return;
    setIsEditing(false);
    setTitle("");
    setDescription("");
    if (!actionsBlocked) setActionError("");
  };

  const handleActionError = (error, action) => {
    const status = error.response?.status;
    let message = error.response?.data?.message || error.message;
    if (status === 400) {
      message =
        error.response?.data?.message || "Please check your report details.";
    } else if (status === 401) {
      message = "Please sign in again to manage this report.";
    } else if (status === 403) {
      message = `You do not have permission to ${action} this report.`;
    } else if (status === 404) {
      message = "This report could not be found. It may have been deleted.";
    } else if (status === 409) {
      message = `${message} Refresh the page to check the report's current state.`;
    } else if (action === "delete" && report.images?.length > 0) {
      message = `${message} Some attached images may already have been removed. Refresh the page before retrying.`;
    }
    setActionStatus(status || null);
    setActionError(message);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canManageReport || isProcessing || actionsBlocked) return;
    setActionError("");
    setSuccessMessage("");
    if (title.trim().length < 5) {
      setActionError(
        "Title must be at least 5 characters after trimming spaces.",
      );
      return;
    }
    if (description.trim().length < 10) {
      setActionError(
        "Description must be at least 10 characters after trimming spaces.",
      );
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `https://fixflow-backend-4hrf.onrender.com/api/reports/${id}`,
        { title: title.trim(), description: description.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setReport((prevReport) => {
        if (!prevReport || prevReport._id !== id) return prevReport;
        return {
          ...prevReport,
          title: response.data.report.title,
          description: response.data.report.description,
        };
      });
      setSuccessMessage(response.data.message);
      setIsEditing(false);
    } catch (error) {
      handleActionError(error, "edit");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canManageReport || isProcessing || actionsBlocked) return;
    if (!window.confirm("Delete this report? This action cannot be undone."))
      return;
    setActionError("");
    setSuccessMessage("");
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("JWT");
      await axios.delete(
        `https://fixflow-backend-4hrf.onrender.com/api/reports/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      navigate("/my-reports");
    } catch (error) {
      handleActionError(error, "delete");
    } finally {
      setIsDeleting(false);
    }
  };

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
            {actionError && (
              <div
                className="alert alert-danger text-break mt-3 mb-0"
                role="alert"
              >
                {actionError}
                {actionStatus === 401 && (
                  <Link to="/login" className="alert-link ms-2">
                    Sign in
                  </Link>
                )}
                {actionStatus === 404 && (
                  <Link to="/my-reports" className="alert-link ms-2">
                    My Reports
                  </Link>
                )}
              </div>
            )}
            {successMessage && (
              <div className="alert alert-success mt-3 mb-0" role="status">
                {successMessage}
              </div>
            )}
            {canManageReport && (
              <div className="border-top mt-3 pt-3">
                {isEditing ? (
                  <form onSubmit={handleSave}>
                    <h4 className="fw-bold text-dark mb-3">Edit Report</h4>
                    <label
                      htmlFor="edit-title"
                      className="form-label fw-semibold"
                    >
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      className="form-control mb-3"
                      value={title}
                      required
                      minLength={5}
                      disabled={isProcessing || actionsBlocked}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label
                      htmlFor="edit-description"
                      className="form-label fw-semibold"
                    >
                      Description
                    </label>
                    <textarea
                      id="edit-description"
                      rows={4}
                      className="form-control mb-3"
                      value={description}
                      required
                      minLength={10}
                      disabled={isProcessing || actionsBlocked}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isProcessing || actionsBlocked}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={isProcessing}
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      disabled={isProcessing || actionsBlocked}
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      disabled={isProcessing || actionsBlocked}
                      onClick={handleDelete}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            )}
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
            <div className="border-top mt-4 pt-3">
              <h4 className="fw-bold text-dark mb-3">Maintenance Timeline</h4>
              {timeline.length > 0 ? (
                <ol className="list-group list-group-flush">
                  {timeline.map((event) => {
                    return (
                      <li key={event._id} className="list-group-item px-0 py-3">
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
                          <span className="badge text-bg-primary align-self-start">
                            {timelineActions[event.action] || event.action}
                          </span>
                          <time
                            dateTime={event.at}
                            className="text-secondary small"
                          >
                            {new Date(event.at).toLocaleString()}
                          </time>
                        </div>
                        {event.details && (
                          <p className="text-break mt-2 mb-0">
                            {event.details}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="text-secondary mb-0">
                  No maintenance history yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ReportDetails;
