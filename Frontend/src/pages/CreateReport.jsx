import { useState, useEffect } from "react";
import axios from "axios";
function CreateReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReportId, setCreatedReportId] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/locations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("JWT")}`,
            },
          },
        );
        setLocations(response.data);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };
    fetchLocations();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || isComplete || imageError) return;
    setIsSubmitting(true);
    setSubmitError("");
    let reportId = createdReportId;
    try {
      const token = localStorage.getItem("JWT");
      if (!reportId) {
        const response = await axios.post(
          "http://localhost:5000/api/reports",
          {
            title,
            description,
            location,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        reportId = response.data.report?._id ?? response.data._id;
        if (!reportId) {
          throw new Error("Report ID not found in server response");
        }
        setCreatedReportId(reportId);
      }
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file) => {
          formData.append("images", file);
        });
        await axios.post(
          `http://localhost:5000/api/reports/${reportId}/images`,
          formData,
          {
            timeout: 75_000,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
      setIsComplete(true);
      alert("Report created successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ECONNABORTED"
          ? "The upload request timed out."
          : error.message === "Network Error"
            ? "Could not reach the image upload service. Check your connection."
            : error.message);
      if (reportId) {
        setSubmitError(
          `Report created, but image upload failed. ${message} Click Retry Upload.`,
        );
      } else {
        setSubmitError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImageError("");
    if (selectedFiles.length > 2) {
      setImageError("You can upload a maximum of 2 images.");
      setImages([]);
      e.target.value = "";
      return;
    }
    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setImageError("Only JPEG, PNG, and WebP images are allowed.");
        setImages([]);
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Each image must be at most 5MB.");
        setImages([]);
        e.target.value = "";
        return;
      }
    }
    setImages(selectedFiles);
  };
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-center bg-light rounded-3 p-3 p-sm-4">
        <div
          className="card shadow-sm border-0 rounded-3 w-100"
          style={{ maxWidth: "520px" }}
        >
          <div className="card-body p-3 p-sm-4">
            <h2 className="h4 fw-bold text-primary mb-2">Create Report</h2>
            <p className="text-secondary mb-4">
              Describe the maintenance issue and where it is on campus.
            </p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title" className="form-label fw-semibold">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                className="form-control mb-3"
                placeholder="Enter your title"
                required
                disabled={isSubmitting || Boolean(createdReportId)}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
              <label htmlFor="description" className="form-label fw-semibold">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                className="form-control mb-3"
                placeholder="Describe the maintenance issue"
                required
                disabled={isSubmitting || Boolean(createdReportId)}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
              <label htmlFor="location" className="form-label fw-semibold">
                Location
              </label>
              <select
                id="location"
                className="form-select mb-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                disabled={isSubmitting || Boolean(createdReportId)}
              >
                <option value="">Select a location</option>
                {locations.map((elem) => (
                  <option key={elem._id} value={elem._id}>
                    {elem.name} {elem.buildingCode}-{elem.floor}
                  </option>
                ))}
              </select>
              <label htmlFor="photo" className="form-label fw-semibold">
                Attach Images
              </label>
              <input
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={isSubmitting || isComplete}
                className="form-control mb-2"
                onChange={handleImagesChange}
              />
              <small className="text-secondary d-block mb-3">
                Maximum 2 images, 5MB each.
              </small>
              {imageError && (
                <div className="alert alert-danger text-break py-2 mb-3" role="alert">{imageError}</div>
              )}
              {images.length > 0 && (
                <p className="small text-success mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  {images.length} image(s) selected
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || isComplete || Boolean(imageError)}
                className="btn btn-primary w-100 rounded-3 py-2 fw-semibold"
              >
                {isSubmitting
                  ? "Processing..."
                  : isComplete
                    ? "Report Created"
                    : createdReportId
                      ? "Retry Upload"
                      : "Create Report"}
              </button>
              {submitError && (
                <div className="alert alert-danger text-break mt-3 mb-0" role="alert">{submitError}</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateReport;
