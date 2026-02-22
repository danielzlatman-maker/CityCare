const db = require("../DataBase/DB");

module.exports = class Department {
  static fetchAll() {
    // schema uses: department_id (PK) and department_name
    return db.execute(
      `SELECT department_id, department_name, floor, phone_ext, head_doctor, description, opening_hours, created_at
       FROM departments
       ORDER BY department_name`
    );
  }

  static create(d) {
    return db.execute(
      `INSERT INTO departments
        (department_name, floor, phone_ext, head_doctor, description, opening_hours)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        d.name,
        d.floor,
        d.phoneExt,
        d.headDoctor,
        d.description,
        d.openingHours
      ]
    );
  }
};
