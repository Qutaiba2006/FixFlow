const {createReport,getReports,toggleSupport,toggleAffected} = require("../controllers/reportController");
const {protect} = require("../middleware/AuthenticationMiddleware");
const express = require("express");
const router = express.Router();
router.post("/",protect,createReport);
router.get("/",protect,getReports);
router.patch("/:id/support",protect,toggleSupport);
router.patch("/:id/affected",protect,toggleAffected);
module.exports=router;
