function ReportCard({ report, onSupport, onAffected }) {
  return (
    <div className="card shadow-sm mb-3" style={{ maxWidth: "24rem" }}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 pb-2">
          <h5 className="card-title">{report.title}</h5>
          <span className="badge text-bg-secondary">{report.status}</span>
        </div>
        <p className="card-text">{report.description}</p>
        <p className="card-text">{report.location?.name}</p>
        <div className="d-flex justify-content-around">
          <div>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onSupport(report._id)}
            >
              <i className="bi bi-hand-thumbs-up-fill me-2"></i>
            </button>
            <span> {report.supportCount ?? report.supporters.length}</span>
          </div>
          <div>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onAffected(report._id)}
            >
              <i className="bi bi-people-fill me-2"></i>
            </button>
            <span>{report.affectedCount ?? report.affectedUsers.length} </span>
          </div>
          <p className="card-text">Priority Score: {report.priorityScore}</p>
        </div>
      </div>
    </div>
  );
}
export default ReportCard;
