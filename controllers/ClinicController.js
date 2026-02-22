const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Department = require("../models/Department");

// server-side validation 
const isNineDigits = (v) => /^\d{9}$/.test(String(v || "").trim());

const isPastDate = (yyyyMmDd) => {
  if (!yyyyMmDd) return false;
  const d = new Date(yyyyMmDd + "T00:00");
  if (Number.isNaN(d.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return d < today; // only before today
};

// Safer datetime-local parsing (for <input type="datetime-local">)
const parseDateTimeLocal = (val) => {
  if (!val) return null;

  // Most browsers: "YYYY-MM-DDTHH:mm"
  const direct = new Date(val);
  if (!Number.isNaN(direct.getTime())) return direct;

  // Fallback manual parse
  const m = String(val).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return null;
  const Y = Number(m[1]);
  const Mo = Number(m[2]);
  const Da = Number(m[3]);
  const H = Number(m[4]);
  const Mi = Number(m[5]);
  return new Date(Y, Mo - 1, Da, H, Mi, 0, 0);
};

const isFutureDateTime = (val) => {
  const d = parseDateTimeLocal(val);
  if (!d) return false;
  return d.getTime() > Date.now();
};

const toNullIfEmpty = (v) => {
  if (v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};

const toIntOrNull = (v) => {
  if (v === undefined || v === null) return null;
  const n = Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
};

// Home 
exports.getHome = (req, res) => {
  const username = req.session?.user?.username || "Guest";
  res.render("index", { username });  //  pass username to EJS
};

exports.getAbout = (req, res) => {
  res.render("about");     //  About = about.ejs
};

// Patients 
exports.getAddPatient = (req, res) => {
  res.render("patients/add", { error: null, success: null, formData: {} });
};

exports.postAddPatient = async (req, res) => {
  const {
    nationalId,
    fullName,
    dob,
    gender,
    phone,
    address,
    bloodType,
    emergencyName,
    emergencyPhone,
  } = req.body;

  if (!isNineDigits(nationalId)) {
    return res.status(400).render("patients/add", {
      error: "National ID must be exactly 9 digits.",
      success: null,
      formData: req.body,
    });
  }

  if (!isPastDate(dob)) {
    return res.status(400).render("patients/add", {
      error: "Date of Birth must be in the past.",
      success: null,
      formData: req.body,
    });
  }

  try {
    await Patient.create({
      nationalId: toNullIfEmpty(nationalId),
      fullName: toNullIfEmpty(fullName),
      dob: toNullIfEmpty(dob),
      gender: toNullIfEmpty(gender),
      phone: toNullIfEmpty(phone),
      address: toNullIfEmpty(address),
      bloodType: toNullIfEmpty(bloodType),
      emergencyName: toNullIfEmpty(emergencyName),
      emergencyPhone: toNullIfEmpty(emergencyPhone),
    });

    res.render("patients/add", {
      error: null,
      success: "Patient saved successfully ✅",
      formData: {},
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("patients/add", {
      error: "Error saving patient. Please try again.",
      success: null,
      formData: req.body,
    });
  }
};

exports.getSearchPatient = (req, res) => {
  res.render("patients/search", { error: null });
};

exports.getPatientResults = async (req, res) => {
  const { name, nationalId } = req.query;
  try {
    const [rows] = await Patient.search({ name, nationalId });
    res.render("patients/results", {
      patients: rows,
      query: { name, nationalId },
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("patients/results", {
      patients: [],
      query: { name, nationalId },
      error: "Search failed.",
    });
  }
};

// Appointments 
exports.getAppointments = async (req, res) => {
  try {
    const [rows] = await Appointment.fetchAll();
    res.render("appointments/list", {
      appointments: rows,
      error: null,
      success: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("appointments/list", {
      appointments: [],
      error: "Failed to load appointments.",
      success: null,
    });
  }
};

exports.getAddAppointment = async (req, res) => {
  try {
    const [patients] = await Patient.fetchAll();
    const [departments] = await Department.fetchAll();

    // Debug: if dropdown empty, I will see it in terminal
    console.log("Departments loaded:", Array.isArray(departments) ? departments.length : departments);

    res.render("appointments/add", {
      patients,
      departments,
      error: null,
      success: null,
      formData: {},
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("appointments/add", {
      patients: [],
      departments: [],
      error: "Failed to load form.",
      success: null,
      formData: {},
    });
  }
};

exports.postAddAppointment = async (req, res) => {
  const {
    patientNationalId,
    departmentId,
    doctorName,
    datetime,       // old name
    appointmentAt,  // new name (EJS)
    visitType,
    reason,
    status,
    notes,
  } = req.body;

  const actualDateTime = appointmentAt || datetime;

  const [patients] = await Patient.fetchAll().catch(() => [[]]);
  const [departments] = await Department.fetchAll().catch(() => [[]]);

  if (!isNineDigits(patientNationalId)) {
    return res.status(400).render("appointments/add", {
      patients,
      departments,
      error: "Patient National ID must be exactly 9 digits.",
      success: null,
      formData: req.body,
    });
  }

  if (!departmentId) {
    return res.status(400).render("appointments/add", {
      patients,
      departments,
      error: "Please choose a department.",
      success: null,
      formData: req.body,
    });
  }

  if (!isFutureDateTime(actualDateTime)) {
    return res.status(400).render("appointments/add", {
      patients,
      departments,
      error: "Appointment date/time must be in the future.",
      success: null,
      formData: req.body,
    });
  }

  try {
    await Appointment.create({
      patientNationalId,
      departmentId,
      doctorName,
      datetime: actualDateTime,
      visitType,
      reason,
      status,
      notes,
    });

    return res.render("appointments/add", {
      patients,
      departments,
      error: null,
      success: "Appointment saved ✅",
      formData: {},
    });
  } catch (err) {
    console.log(err);

    // Custom message for FK error (patient not found)
    let msg = "Error saving appointment.";

    // MySQL FK violation: missing parent row (patient not registered)
    if (err && (err.errno === 1452 || err.code === "ER_NO_REFERENCED_ROW_2")) {
      msg = "Error saving appointment: the patient is not registered.";
    }

    // Custom message for FK error (department not found)
    if (err && (err.errno === 1452 || err.code === "ER_NO_REFERENCED_ROW_2")) {
      const constraint = err.sqlMessage || "";
      if (constraint.includes("fk_appt_department")) {
        msg = "Error saving appointment: selected department does not exist.";
      }
    }

    return res.status(500).render("appointments/add", {
      patients,
      departments,
      error: msg,
      success: null,
      formData: req.body,
    });
  }
};


// Appointment detail screen (data passed via JS)
exports.getAppointmentDetail = (req, res) => {
  res.render("appointments/detail");
};
