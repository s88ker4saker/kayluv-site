/*
 * Countdown to the concert, counted in America/Denver regardless of where
 * the visitor is. Never shows zero or a negative number: day 0 gets its own
 * note, and from Dec 12 the section switches to a thank-you state.
 */
(function () {
  "use strict";

  var CONCERT = { y: 2026, m: 12, d: 11 };          // Dec 11 2026, Denver
  var TZ = "America/Denver";

  var label  = document.getElementById("countdown-label");
  var note   = document.getElementById("note");
  var number = document.getElementById("note-number");
  if (!label || !note || !number) return;

  function denverTodayUTC() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date()).split("-");
    return Date.UTC(+parts[0], +parts[1] - 1, +parts[2]);
  }

  function render() {
    var days = Math.round(
      (Date.UTC(CONCERT.y, CONCERT.m - 1, CONCERT.d) - denverTodayUTC()) / 86400000
    );

    if (days > 1) {
      label.textContent = "days until the concert";
      number.textContent = String(days);
      note.classList.remove("is-text");
    } else if (days === 1) {
      label.textContent = "day until the concert";
      number.textContent = "1";
      note.classList.remove("is-text");
    } else if (days === 0) {
      label.textContent = "";
      number.textContent = "Tonight.";
      note.classList.add("is-text");
      addProgramLink();
    } else {
      label.textContent = "";
      number.textContent = "Thank you.";
      note.classList.add("is-text");
      addProgramLink();
    }
  }

  function addProgramLink() {
    if (document.getElementById("program-link")) return;
    var a = document.createElement("a");
    a.id = "program-link";
    a.className = "note-link";
    a.href = "/program";
    a.textContent = "Read the program →";
    note.insertAdjacentElement("afterend", a);
  }

  render();
  // re-check if the tab is left open across local midnight
  setInterval(render, 60 * 60 * 1000);
})();
