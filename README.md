# CityCare (Web + Server-Side Programming)
CityCare (Web + Server-Side Programming)

CityCare is a medical management system developed as part of the Web and Server-Side Programming courses.
The system is designed to manage patients and appointments while demonstrating full integration between frontend, backend, and database components.

The application runs on Node.js using Express, EJS views, and a MySQL database.



Open:  http://localhost:3000

## Notes for submission

*Since the node_modules folder is excluded from the repository , you must install the prerequisites:
1.npm install.
2.npm start.

1) System Functionality

After authenticating into the system, users can:

Register new patients

Schedule appointments for patients

Assign appointments to existing departments

Add deparments

View patient details

View appointment details

2) Main Features

The system includes:

Session-based authentication

Password hashing using bcrypt

Client-side validation (JavaScript)

Server-side validation (Express)

MySQL database integration

Foreign key constraints enforcing relational integrity

Validation rules ensure:

Proper national ID format

Valid birth dates

Future appointment dates

Prevention of invalid database relations

3) Database Setup

Before running the application, initialize the database:

schema.sql

4) Personas & Scenarios
Persona

Clinic Secretary

A clinic secretary uses the system during daily work to register patients and manage appointments.
The secretary requires a simple and reliable interface that prevents data entry mistakes and ensures appointments are correctly scheduled.

Scenario 1 – Patient Registration & Appointment Scheduling

The secretary logs into the system

Registers a new patient

Schedules an appointment for the patient

Assigns the appointment to a department

This scenario demonstrates data entry, validation, and database persistence.

Scenario 2 – Viewing Information

The secretary accesses the dashboard

Views patient records

Views appointment details

This scenario demonstrates data retrieval and presentation.

