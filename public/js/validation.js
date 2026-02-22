// CityCare - JS validations
// 1) Real-time constraints (typing limits)
// 2) Submit-time validation (prevent saving bad data)

document.addEventListener("DOMContentLoaded", () => {
  // Helpers
  const onlyDigits = (s) => (s || "").replace(/\D+/g, "");
  const pad2 = (n) => String(n).padStart(2, "0");

  const toDateInputValue = (d) => {
    // YYYY-MM-DD in local time
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  };

  const toDateTimeLocalValue = (d) => {
    // YYYY-MM-DDTHH:mm in local time
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(
      d.getHours()
    )}:${pad2(d.getMinutes())}`;
  };

  const ensureHint = (inputEl) => {
    if (!inputEl) return null;
    let hint = inputEl.parentElement?.querySelector(".hint-inline");
    if (!hint) {
      hint = document.createElement("div");
      hint.className = "hint hint-inline";
      hint.style.marginTop = "4px";
      inputEl.parentElement?.appendChild(hint);
    }
    return hint;
  };

  const setHint = (inputEl, msg) => {
    const hint = ensureHint(inputEl);
    if (hint) hint.textContent = msg || "";
  };

  const markInvalid = (inputEl, msg) => {
    if (!inputEl) return;
    inputEl.classList.add("is-invalid");
    setHint(inputEl, msg);
  };

  const clearInvalid = (inputEl) => {
    if (!inputEl) return;
    inputEl.classList.remove("is-invalid");
    setHint(inputEl, "");
  };

  // National ID: force 9 digits while typing 
  const bindNationalId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      const digits = onlyDigits(el.value).slice(0, 9);
      if (el.value !== digits) el.value = digits;

      if (digits.length === 0) return clearInvalid(el);

      if (digits.length !== 9) markInvalid(el, "ID must be exactly 9 digits.");
      else clearInvalid(el);
    });
  };

  bindNationalId("nationalId");        // register/patient
  bindNationalId("patientNationalId"); // appointment

  // DOB: must be in the past 
  const dobEl = document.getElementById("dob");
  if (dobEl) {
    dobEl.max = toDateInputValue(new Date());

    dobEl.addEventListener("change", () => {
      const v = dobEl.value;
      if (!v) return clearInvalid(dobEl);

      const d = new Date(v + "T00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (d > today) markInvalid(dobEl, "Date of birth must be in the past.");
      else clearInvalid(dobEl);
    });
  }

  // -- Appointment datetime: must be in the future --
  // EJS uses id="appointmentAt"
  const dtEl = document.getElementById("appointmentAt") || document.getElementById("datetime");
  if (dtEl) {
    // min = now + 5 minutes
    const minDate = new Date(Date.now() + 5 * 60 * 1000);
    dtEl.min = toDateTimeLocalValue(minDate);

    dtEl.addEventListener("change", () => {
      const v = dtEl.value;
      if (!v) return clearInvalid(dtEl);

      const chosen = new Date(v);
      const min = new Date(Date.now() + 5 * 60 * 1000);

      if (chosen < min) markInvalid(dtEl, "Appointment date/time must be in the future.");
      else clearInvalid(dtEl);
    });
  }

  // -- Submit-time validations --
  // Register validations
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const nationalId = document.getElementById("nationalId")?.value.trim();
      const password = document.getElementById("password")?.value;

      if (!/^\d{9}$/.test(nationalId || "")) {
        e.preventDefault();
        markInvalid(document.getElementById("nationalId"), "National ID must be exactly 9 digits.");
        alert("National ID must be exactly 9 digits.");
        return;
      }

      if (!password || password.length < 8 || !/\d/.test(password)) {
        e.preventDefault();
        markInvalid(document.getElementById("password"), "Password must be 8+ chars and include a number.");
        alert("Password must be at least 8 characters and include at least 1 number.");
        return;
      }
    });
  }

  // Patient validations
  const patientForm = document.getElementById("patientForm");
  if (patientForm) {
    patientForm.addEventListener("submit", (e) => {
      const dob = document.getElementById("dob")?.value;
      const dobDate = dob ? new Date(dob + "T00:00") : null;

      if (dobDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dobDate > today) {
          e.preventDefault();
          markInvalid(document.getElementById("dob"), "Date of birth must be in the past.");
          alert("Date of birth must be in the past.");
          return;
        }
      }
    });
  }

  // Appointment validations
  const appointmentForm = document.getElementById("appointmentForm");
  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (e) => {
      const dtInput = document.getElementById("appointmentAt") || document.getElementById("datetime");
      const dt = dtInput?.value;
      const dtDate = dt ? new Date(dt) : null;

      if (dtDate) {
        const min = new Date(Date.now() + 5 * 60 * 1000);
        if (dtDate < min) {
          e.preventDefault();
          markInvalid(dtInput, "Appointment date/time must be in the future.");
          alert("Appointment date/time must be in the future.");
          return;
        }
      }
    });
  }
});
