/*
 * KAYLUV.SITE — gear menu (build step 2, SPEC §9)
 * Top-right gear button opening the nav + sound panel (SPEC §2). The panel's
 * nav is the complete non-mouse path through the site (SPEC §3). Sound
 * controls are stubs — the audio manager arrives in build step 7.
 */
(function () {
  "use strict";

  var button = document.getElementById("gear-button");
  var panel = document.getElementById("gear-panel");
  var soundToggle = document.getElementById("sound-toggle");

  function isOpen() {
    return !panel.hidden;
  }

  function openPanel() {
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    var first = panel.querySelector("a, button, input");
    if (first) first.focus();
  }

  function closePanel(returnFocus) {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (returnFocus) button.focus();
  }

  button.addEventListener("click", function () {
    if (isOpen()) {
      closePanel(false);
    } else {
      openPanel();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      closePanel(true);
    }
  });

  // click outside closes (the gear button handles its own toggle)
  document.addEventListener("pointerdown", function (e) {
    if (!isOpen()) return;
    if (panel.contains(e.target) || button.contains(e.target)) return;
    closePanel(false);
  });

  /* Tiny cross-module hooks for the overlay router: it closes the panel
     after a nav link opens an overlay, and defers to an open panel when
     deciding who consumes an Escape press. */
  window.KAYLUV = window.KAYLUV || {};
  window.KAYLUV.isGearMenuOpen = isOpen;
  window.KAYLUV.closeGearMenu = function () {
    if (isOpen()) closePanel(false);
  };

  /* Sound stub: flips its own state so the control is testable, but is
     wired to nothing — the audio manager lands in build step 7. */
  soundToggle.addEventListener("click", function () {
    var on = soundToggle.getAttribute("aria-pressed") === "true";
    soundToggle.setAttribute("aria-pressed", String(!on));
    soundToggle.textContent = on ? "Sound: off" : "Sound: on";
  });
})();
