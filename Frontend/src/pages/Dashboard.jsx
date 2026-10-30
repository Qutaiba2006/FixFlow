import { useState, useEffect } from "react";
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
      <h2 className="fw-bold">Campus Feed</h2>
      <p className="text-secondary">
        See and follow maintenance reports around campus.
      </p>
      {reports.map((elem) => {
        return (
          <ReportCard
            key={elem._id}
            report={elem}
            onSupport={handleSupport}
            onAffected={handleAffected}
          />
        );
      })}
    </div>
  );
}
export default Dashboard;
