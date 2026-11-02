import { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "../components/ReportCard";
function MyReports() {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const response = await axios.get(
          "https://fixflow-backend-4hrf.onrender.com/api/reports/mine",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setReports(response.data);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchMyReports();
  }, []);
  return (
    <div className="row g-3">
      {reports.map((elem) => {
        return (
          <div key={elem._id} className="col-12 col-md-6 col-xl-4">
            <ReportCard report={elem} showActions={false} />
          </div>
        );
      })}
    </div>
  );
}

export default MyReports;
