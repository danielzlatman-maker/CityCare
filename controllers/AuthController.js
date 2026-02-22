const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /register
exports.getRegister = (req, res) => {
  res.render("auth/register", { error: null, formData: {} });
};

// POST /register
exports.postRegister = async (req, res) => {
  const {
    nationalId,
    username,
    email,
    password,
    birthYear,
    city,
    securityQuestion,
    securityAnswer,
  } = req.body;

  // Server-side validation (basic)
  if (!nationalId || !username || !password || !birthYear || !city || !securityQuestion || !securityAnswer) {
    return res.status(400).render("auth/register", {
      error: "Please fill all required fields.",
      formData: req.body,
    });
  }

  try {
    const [existing] = await User.findByUsername(username);
    if (existing.length) {
      return res.status(409).render("auth/register", {
        error: "This username already exists. Please choose another one.",
        formData: req.body,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      nationalId,
      username,
      email: email || null,
      passwordHash,
      role: "doctor",
      birthYear,
      city,
      securityQuestion,
      securityAnswer,
    });

    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).render("auth/register", {
      error: "Registration error. Try again later.",
      formData: req.body,
    });
  }
};

// GET /login
exports.getLogin = (req, res) => {
  res.render("auth/login", { error: null, formData: {} });
};

// POST /login
exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await User.findByUsername(username);
    if (!rows.length) {
      return res.status(401).render("auth/login", {
        error: "Invalid username or password.",
        formData: { username },
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).render("auth/login", {
        error: "Invalid username or password.",
        formData: { username },
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = { userId: user.user_id, username: user.username, role: user.role };
    return req.session.save(() => res.redirect("/"));
  } catch (err) {
    console.log(err);
    res.status(500).render("auth/login", {
      error: "Login error. Try again later.",
      formData: { username },
    });
  }
};

// GET /logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
