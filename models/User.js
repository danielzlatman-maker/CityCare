const db = require("../DataBase/DB");
// console.log(" LOADED User.js FROM:", __filename);

module.exports = class User {
  static create(user) {
    return db.execute(
      `INSERT INTO users 
        (national_id, username, email, password_hash, role, birth_year, city, security_question, security_answer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.nationalId,
        user.username,
        user.email,
        user.passwordHash,
        user.role,
        user.birthYear,
        user.city,
        user.securityQuestion,
        user.securityAnswer,
      ]
    );
  }

  static findByUsername(username) {
    return db.execute("SELECT * FROM users WHERE username = ?", [username]);
  }
};
