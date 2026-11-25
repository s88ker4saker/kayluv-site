/*
 * Two small behaviours: the "more about the concert" dialog, and the
 * tap-to-play audio. Nothing autoplays — browsers block it, and people
 * open this standing next to a poster in public.
 */
(function () {
  "use strict";

  /* ---- more-info dialog (native <dialog>: Escape and focus come free) */
  var dlg = document.getElementById("more");
  var open = document.getElementById("more-btn");
  var close = document.getElementById("dialog-close");
  if (dlg && open && close) {
    open.addEventListener("click", function () {
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    });
    close.addEventListener("click", function () { dlg.close(); });
    // click on the backdrop closes
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg) dlg.close();
    });
    dlg.addEventListener("close", function () { open.focus(); });
  }

  /* ---- audio ---- */
  var audio = document.getElementById("audio");
  var btn = document.getElementById("play-btn");
  var label = document.getElementById("play-text");
  if (!audio || !btn || !label) return;

  function setState(playing) {
    btn.setAttribute("aria-pressed", String(playing));
    label.textContent = playing ? "Pause" : "Play";
  }

  btn.addEventListener("click", function () {
    if (audio.paused) {
      label.textContent = "Loading…";
      audio.play().then(function () {
        setState(true);
      }).catch(function () {
        label.textContent = "Couldn’t play";
      });
    } else {
      audio.pause();
      setState(false);
    }
  });

  audio.addEventListener("ended", function () {
    setState(false);
    audio.currentTime = 0;
  });
  audio.addEventListener("pause", function () { setState(false); });
  audio.addEventListener("play", function () { setState(true); });
})();
