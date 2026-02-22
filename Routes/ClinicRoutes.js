const express = require("express");
const router = express.Router();

const clinicController = require("../controllers/ClinicController");
const departmentController = require("../controllers/DepartmentController");

// Home
router.get("/", clinicController.getHome);
router.get("/about", clinicController.getAbout);

// Patients
router.get("/patients/add", clinicController.getAddPatient);
router.post("/patients/add", clinicController.postAddPatient);
router.get("/patients/search", clinicController.getSearchPatient);
router.get("/patients/results", clinicController.getPatientResults);

// Appointments
router.get("/appointments", clinicController.getAppointments);
router.get("/appointments/add", clinicController.getAddAppointment);
router.post("/appointments/add", clinicController.postAddAppointment);
router.get("/appointments/detail", clinicController.getAppointmentDetail);

// Departments
router.get("/departments", departmentController.getDepartments);
router.get("/departments/add", departmentController.getAddDepartment);
router.post("/departments/add", departmentController.postAddDepartment);

module.exports = router;
