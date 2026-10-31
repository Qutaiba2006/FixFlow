function ReportCard({ report, onSupport, onAffected }) {
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
          <span className={`badge flex-shrink-0 ${statusClasses[report.status] ?? "text-bg-secondary"}`}>
            {report.status === "in_progress" ? "in progress" : report.status}
          </span>
        </div>
        <p className="card-text text-break">{report.description}</p>
        <p className="card-text text-secondary text-break mb-3">{report.location?.name}</p>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-auto border-top pt-3">
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onSupport(report._id)}
            >
              <i className="bi bi-hand-thumbs-up-fill me-1"></i>
              Support {report.supportCount ?? report.supporters.length}
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onAffected(report._id)}
            >
              <i className="bi bi-people-fill me-1"></i>
              Affected {report.affectedCount ?? report.affectedUsers.length}
            </button>
          </div>
          <span className="badge bg-light text-dark border ms-auto">Priority Score: {report.priorityScore}</span>
        </div>
      </div>
    </div>
  );
}
export default ReportCard;
