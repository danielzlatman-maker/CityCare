// CityCare - JavaScript for interactivity and dynamic behavior

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("open"); // dynamic styling via class
    });
  }

  // jQuery: hide success banner after a short delay
  if (window.$ && $("#successBanner").length) {
    $("#successBanner").hide().slideDown(250);
    setTimeout(() => $("#successBanner").slideUp(250), 2500);
  }

  // Appointment "View" buttons: store selected row data -> navigate to detail screen
  const viewButtons = document.querySelectorAll(".viewBtn");
  if (viewButtons.length) {
    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest("tr");
        const payload = row?.getAttribute("data-appointment");
        if (!payload) return;

        // Passing data between screens using JS:
        sessionStorage.setItem("selectedAppointment", payload);

        // Navigate
        window.location.href = "/appointments/detail";
      });
    });
  }

  // Detail screen: render appointment from sessionStorage
  const detailBox = document.getElementById("detailBox");
  if (detailBox) {
    const raw = sessionStorage.getItem("selectedAppointment");
    if (!raw) {
      detailBox.innerHTML = "<p>No appointment was selected. Go back to the list and click <strong>View</strong>.</p>";
      return;
    }

    const a = JSON.parse(raw);

    // Writing into element:
    detailBox.innerHTML = `
      <div class="grid">
        <article class="card">
          <h2>Patient</h2>
          <p><strong>${escapeHtml(a.patient_name)}</strong></p>
          <p class="muted">${escapeHtml(a.patient_national_id)}</p>
        </article>
        <article class="card">
          <h2>Visit</h2>
          <p><strong>${escapeHtml((a.appointment_datetime || "").toString().slice(0,19).replace("T"," "))}</strong></p>
          <p class="muted">${escapeHtml(a.department_name)} • ${escapeHtml(a.doctor_name)}</p>
        </article>
        <article class="card">
          <h2>Status</h2>
          <p><span class="pill">${escapeHtml(a.status)}</span></p>
          <p class="muted">Reason: ${escapeHtml(a.reason || "—")}</p>
        </article>
      </div>
    `;
  }

  // jQuery: real-time filtering on patient results
  if (window.$ && $("#filterInput").length && $("#patientsTable").length) {
    $("#filterInput").on("input", function () {
      const value = $(this).val().toString().toLowerCase();
      $("#patientsTable tbody tr").each(function () {
        const text = $(this).text().toLowerCase();
        $(this).toggle(text.includes(value));
      });
    });
  }
});

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
