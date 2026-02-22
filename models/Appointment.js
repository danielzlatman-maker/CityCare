const db = require("../DataBase/DB");

module.exports = class Appointment {
  static fetchAll() {
    return db.execute(
      `SELECT 
          a.appointment_id,
          a.patient_national_id,
          p.full_name AS patient_name,
          d.department_name AS department_name,
          a.department_id,
          a.doctor_name,
          a.appointment_datetime,
          a.reason,
          a.status,
          a.notes
       FROM appointments a
       JOIN patients p ON p.national_id = a.patient_national_id
       JOIN departments d ON d.department_id = a.department_id
       ORDER BY a.appointment_datetime ASC`
    );
  }

  static create(a) {
    return db.execute(
      `INSERT INTO appointments
        (patient_national_id, department_id, doctor_name, appointment_datetime, reason, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        a.patientNationalId ?? null,
        a.departmentId ?? null,
        a.doctorName ?? null,
        a.datetime ?? null,
        a.reason ?? "",
        a.status ?? "Scheduled",
        a.notes ?? null
      ]
    );
  }
};
