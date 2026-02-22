const Department = require("../models/Department");

exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await Department.fetchAll();
    res.render("departments/list", { departments: rows, error: null });
  } catch (err) {
    console.log(err);
    res.status(500).render("departments/list", { departments: [], error: "Failed to load departments." });
  }
};

exports.getAddDepartment = (req, res) => {
  res.render("departments/add", { error: null, success: null, formData: {} });
};

exports.postAddDepartment = async (req, res) => {
  const { name, floor, phoneExt, headDoctor, description, openingHours } = req.body;
  try {
    await Department.create({ name, floor, phoneExt, headDoctor, description, openingHours });
    res.render("departments/add", { error: null, success: "Department saved ✅", formData: {} });
  } catch (err) {
    console.log(err);
    res.status(500).render("departments/add", { error: "Error saving department.", success: null, formData: req.body });
  }
};
