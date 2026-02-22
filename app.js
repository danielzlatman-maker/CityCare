const express = require("express");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();

// View engine (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body 
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "I_AM_A_SECRET_KEY(default)",
    resave: false,
    saveUninitialized: false,
  })
);

// Attach session info to all views
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.isLoggedIn;
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const authRoutes = require("./Routes/AuthRoutes");
const clinicRoutes = require("./Routes/ClinicRoutes");

// Public routes ONLY (login/register/logout)
app.use(authRoutes);

// Protect middleware: block EVERYTHING else until logged in
function protect(req, res, next) {
  // Allow only auth pages when not logged in
  const openPaths = ["/login", "/register", "/logout"];

  // If your AuthRoutes are under /auth/*, also allow them
  const isAuthRoute = req.path.startsWith("/auth") || openPaths.includes(req.path);

  if (isAuthRoute) return next();

  if (req.session.isLoggedIn) return next();

  // Not logged in → always go to login
  return res.redirect("/login");
}

// Everything below requires login
app.use(protect);
app.use(clinicRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
