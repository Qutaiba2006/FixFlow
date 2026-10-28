const mongoose = require("mongoose");
const locationModel = require("../models/locationModel");
const reportModel = require("../models/reportModel");
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
const toggleSupport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid id",
      });
    }
    const findReport = await reportModel.findById(id);
    if (!findReport) {
      return res.status(404).json({
        message: "Report not found",
      });
    }
    const userId = req.user._id;
    const alreadySupported = findReport.supporters.some((supporter) =>
      supporter.equals(userId),
    );
    if (!alreadySupported) {
      findReport.supporters.push(userId);
    } else {
      findReport.supporters.pull(userId);
    }
    findReport.priorityScore =
      findReport.supporters.length * 2 + findReport.affectedUsers.length * 5;
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
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid id",
      });
    }
    const findReport = await reportModel.findById(id);
    if (!findReport) {
      return res.status(404).json({
        message: "Report not found",
      });
    }
    const userId = req.user._id;
    const alreadyAffected = findReport.affectedUsers.some((affectedUsers) =>
      affectedUsers.equals(userId),
    );
    if (!alreadyAffected) {
      findReport.affectedUsers.push(userId);
    } else {
      findReport.affectedUsers.pull(userId);
    }
    findReport.priorityScore =
      findReport.supporters.length * 2 + findReport.affectedUsers.length * 5;
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
module.exports = { createReport, getReports, toggleSupport, toggleAffected };
