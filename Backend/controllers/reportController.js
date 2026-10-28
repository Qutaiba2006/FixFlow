const mongoose = require("mongoose");
const locationModel = require("../models/locationModel");
const reportModel = require("../models/reportModel");
const userModel = require("../models/user");
const createReport = async (req, res) => {
  const { title, description, location } = req.body || {};
  if (
    typeof title !== "string" ||
    title.trim().length < 5 ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    return res.status(400).json({
      message: "Invalid Data",
    });
  }
  if (!mongoose.isValidObjectId(location)) {
    return res.status(400).json({
      message: "Invalid Data",
    });
  }
  try {
    const checkLocation = await locationModel.findById(location);
    if (!checkLocation) {
      return res.status(404).json({
        message: "Location Not Found",
      });
    }
    const newReport = await reportModel.create({
      title: title,
      description: description,
      location: location,
      reportedBy: req.user._id,
    });
    res.status(201).json({
      message: "Report is created",
      report: newReport,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getReports = async (req, res) => {
  try {
    const foundReports = await reportModel
      .find()
      .populate("reportedBy", "name")
      .populate("location", "name buildingCode floor")
      .sort({ priorityScore: -1, createdAt: -1 });
    res.status(200).json(foundReports);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const toggleInteraction = (report, field, userId) => {
  const alreadyInteracted = report[field].some((user) => user.equals(userId));
  if (alreadyInteracted) {
    report[field].pull(userId);
  } else {
    report[field].push(userId);
  }
  report.priorityScore =
    report.supporters.length * 2 + report.affectedUsers.length * 5;
  return report;
};
const toggleSupport = async (req, res) => {
  try {
    const findReport = toggleInteraction(
      req.report,
      "supporters",
      req.user._id,
    );
    await findReport.save();
    res.status(200).json({
      message: "Support updated successfully",
      supportCount: findReport.supporters.length,
      affectedCount: findReport.affectedUsers.length,
      priorityScore: findReport.priorityScore,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const toggleAffected = async (req, res) => {
  try {
    const findReport = toggleInteraction(
      req.report,
      "affectedUsers",
      req.user._id,
    );
    await findReport.save();
    res.status(200).json({
      message: "Affected updated successfully",
      affectedCount: findReport.affectedUsers.length,
      supportCount: findReport.supporters.length,
      priorityScore: findReport.priorityScore,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body || {};
    if (!mongoose.isValidObjectId(technicianId)) {
      return res.status(400).json({
        message: "Invalid technician ID",
      });
    }
    const checkUser = await userModel.findById(technicianId);
    if (!checkUser) {
      return res.status(404).json({
        message: "Technican not found",
      });
    }
    if (checkUser.role !== "technician" || checkUser.isActive !== true) {
      return res.status(400).json({
        message: "User is not an active technician",
      });
    }
    req.report.assignedTo = checkUser._id;
    await req.report.save();
    return res.status(200).json({
      message: "Technician assigned successfully",
      report: req.report,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
const updateStatus = async (req, res) => {
  try {
    const allowedStatuses = ["open", "in_progress", "resolved"];
    const { status } = req.body || {};
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }
    const isAdmin = req.user.role === "admin";
    const isAssignedTechnician =
      req.user.role === "technician" &&
      req.report.assignedTo?.equals(req.user._id);
    if (!isAdmin && !isAssignedTechnician) {
      return res.status(403).json({
        message: "You do not have permission to update this report",
      });
    }
    req.report.status = status;
    await req.report.save();
    return res.status(200).json({
      message: "Status changed successfully",
      status: req.report.status,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = {
  createReport,
  getReports,
  toggleSupport,
  toggleAffected,
  assignTechnician,
  updateStatus,
};
