const db = require("../DataBase/DB");

module.exports = class Patient {
  static create(p) {
    return db.execute(
      `INSERT INTO patients
        (national_id, full_name, date_of_birth, gender, phone, address, blood_type, emergency_contact_name, emergency_contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.nationalId,
        p.fullName,
        p.dob,
        p.gender,
        p.phone,
        p.address,
        p.bloodType,
        p.emergencyName,
        p.emergencyPhone,
      ]
    );
  }

  static search({ name, nationalId }) {
    const nameParam = name && name.trim() ? `%${name.trim()}%` : null;
    const idParam = nationalId && nationalId.trim() ? nationalId.trim() : null;

    if (nameParam && idParam) {
      return db.execute(
        "SELECT * FROM patients WHERE full_name LIKE ? OR national_id = ? ORDER BY full_name",
        [nameParam, idParam]
      );
    }
    if (nameParam) {
      return db.execute(
        "SELECT * FROM patients WHERE full_name LIKE ? ORDER BY full_name",
        [nameParam]
      );
    }
    if (idParam) {
      return db.execute(
        "SELECT * FROM patients WHERE national_id = ?",
        [idParam]
      );
    }
    // No search criteria -> return empty list
    return Promise.resolve([[]]);
  }

  static fetchAll() {
    return db.execute("SELECT national_id, full_name FROM patients ORDER BY full_name");
  }
};
