import { Link } from "react-router-dom";
function ReportCard({
  report,
  onSupport,
  onAffected,
  showActions = true,
  isPending = false,
  interactionError = "",
}) {
  const statusClasses = {
    open: "text-bg-warning",
    in_progress: "text-bg-primary",
    resolved: "text-bg-success",
  };

  return (
    <div className="card bg-white shadow-sm h-100">
      {report.images?.length > 0 && (
        <img
          src={report.images[0].url}
          alt={report.title}
          className="card-img-top"
          style={{
            height: "200px",
            objectFit: "cover",
          }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 pb-2">
          <h5 className="card-title text-break">{report.title}</h5>
          <span
            className={`badge flex-shrink-0 ${statusClasses[report.status] ?? "text-bg-secondary"}`}
          >
            {report.status === "in_progress" ? "in progress" : report.status}
          </span>
        </div>
        <p className="card-text text-break">{report.description}</p>
        <p className="card-text text-secondary text-break mb-3">
          {report.location?.name}
        </p>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-auto border-top pt-3">
          <div className="d-flex flex-wrap gap-2">
            <Link
              to={`/reports/${report._id}`}
              className="btn btn-outline-primary btn-sm"
            >
              View Details
            </Link>
            {showActions && (
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={isPending}
                  onClick={() => onSupport(report._id)}
                >
                  <i className="bi bi-hand-thumbs-up-fill me-1"></i>
                  Support {report.supportCount ?? report.supporters.length}
                </button>
                <button
                  className="btn btn-outline-primary btn-sm"
                  disabled={isPending}
                  onClick={() => onAffected(report._id)}
                >
                  <i className="bi bi-people-fill me-1"></i>
                  Affected {report.affectedCount ?? report.affectedUsers.length}
                </button>
              </div>
            )}
          </div>
          <span className="badge bg-light text-dark border ms-auto">
            Priority Score: {report.priorityScore}
          </span>
        </div>
        {interactionError && (
          <div className="alert alert-danger text-break mt-3 mb-0" role="alert">
            Could not update report. {interactionError}
          </div>
        )}
      </div>
    </div>
  );
}
export default ReportCard;
