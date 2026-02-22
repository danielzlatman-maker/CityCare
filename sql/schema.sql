-- CityCare DB schema (Meets assignment: 4 tables, each 6+ real fields)

CREATE DATABASE IF NOT EXISTS citycare_db;
USE citycaren_db;

-- USERS (6+ fields excluding ID)
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  national_id VARCHAR(9) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(120) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'patient',
  birth_year INT NOT NULL,
  city VARCHAR(80) NOT NULL,
  security_question VARCHAR(50) NOT NULL,
  security_answer VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PATIENTS (6+ fields excluding ID)
CREATE TABLE IF NOT EXISTS patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  national_id VARCHAR(9) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(180) NOT NULL,
  blood_type VARCHAR(3) NOT NULL,
  emergency_contact_name VARCHAR(120) NOT NULL,
  emergency_contact_phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEPARTMENTS (6+ fields excluding ID)
CREATE TABLE IF NOT EXISTS departments (
  department_id INT AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(120) NOT NULL UNIQUE,
  floor INT NOT NULL,
  phone_ext VARCHAR(10) NOT NULL,
  head_doctor VARCHAR(120) NOT NULL,
  description TEXT NULL,
  opening_hours VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- APPOINTMENTS (6+ fields excluding ID)
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_national_id VARCHAR(9) NOT NULL,
  department_id INT NOT NULL,
  doctor_name VARCHAR(120) NOT NULL,
  appointment_datetime DATETIME NOT NULL,
  reason VARCHAR(180) NOT NULL,
  status VARCHAR(20) NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appt_patient FOREIGN KEY (patient_national_id) REFERENCES patients(national_id),
  CONSTRAINT fk_appt_dept FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Seed departments )
INSERT IGNORE INTO departments (department_name, floor, phone_ext, head_doctor, description, opening_hours)
VALUES 
  ('Cardiology', 3, '301', 'Dr. Levy', 'Heart-related treatments.', 'Sun–Thu 08:00–16:00'),
  ('Dermatology', 2, '215', 'Dr. Cohen', 'Skin treatments and consults.', 'Sun–Thu 08:00–16:00');
