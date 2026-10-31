import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReportCard from "../components/ReportCard";
function Dashboard() {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT")}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchReports();
  }, []);
  const handleSupport = async (id) => {
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `http://localhost:5000/api/reports/${id}/support`,
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
            priorityScore: response.data.priorityScore,
          };
        }),
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };
  const handleAffected = async (id) => {
    try {
      const token = localStorage.getItem("JWT");
      const response = await axios.patch(
        `http://localhost:5000/api/reports/${id}/affected`,
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
            affectedCount: response.data.affectedCount,
            priorityScore: response.data.priorityScore,
          };
        }),
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-2">Campus Feed</h2>
          <p className="text-secondary mb-0">
            See and follow maintenance reports around campus.
          </p>
        </div>
        <Link to="/reports/new" className="btn btn-primary align-self-start flex-shrink-0">
          <i className="bi bi-plus-circle me-2"></i>
          Create Report
        </Link>
      </div>
      <div className="row g-3">
        {reports.map((elem) => {
          return (
            <div key={elem._id} className="col-12 col-md-6 col-xl-4">
              <ReportCard
                report={elem}
                onSupport={handleSupport}
                onAffected={handleAffected}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Dashboard;
