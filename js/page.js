/*
 * Two dialogs (concert details, recording details) and the gramophone.
 * Nothing autoplays, and the audio is preload="none" so the file is only
 * fetched when someone asks for it. The seek bar appears once the
 * recording has been started and stays for the rest of the visit.
 */
(function () {
  "use strict";

  /* ---- dialogs: native <dialog> gives Escape and focus return free ---- */
  [["more-btn", "more"], ["song-info-btn", "song-info"]].forEach(function (pair) {
    var btn = document.getElementById(pair[0]);
    var dlg = document.getElementById(pair[1]);
    if (!btn || !dlg) return;
    btn.addEventListener("click", function () {
      if (typeof dlg.showModal === "function") dlg.showModal();
      else dlg.setAttribute("open", "");
    });
    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.hasAttribute("data-close")) dlg.close();
    });
    dlg.addEventListener("close", function () { btn.focus(); });
  });

  /* ---- the gramophone ---- */
  var audio = document.getElementById("audio");
  var phono = document.getElementById("play-btn");
  var bar   = document.getElementById("seekbar");
  var seek  = document.getElementById("seek");
  var tCur  = document.getElementById("t-cur");
  var tDur  = document.getElementById("t-dur");
  if (!audio || !phono) return;

  var scrubbing = false;

  function clock(sec) {
    if (!isFinite(sec)) return "";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function setState(playing) {
    phono.setAttribute("aria-pressed", String(playing));
    phono.setAttribute("aria-label",
      (playing ? "Pause" : "Play") + " \u201cDay by Day\u201d");
  }

  function paint() {
    if (!seek || !audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    if (!scrubbing) seek.value = String(Math.round(pct * 10));
    seek.style.setProperty("--pct", pct.toFixed(2) + "%");
    seek.setAttribute("aria-valuetext", clock(audio.currentTime) + " of " + clock(audio.duration));
    if (tCur) tCur.textContent = clock(audio.currentTime);
  }

  phono.addEventListener("click", function () {
    if (audio.paused) {
      if (bar) bar.hidden = false;      // reveal on first activation, keep it
      audio.play().catch(function () {
        phono.setAttribute("aria-label", "Could not play \u201cDay by Day\u201d");
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", function () { setState(true); });
  audio.addEventListener("pause", function () { setState(false); });
  audio.addEventListener("ended", function () {
    setState(false);
    audio.currentTime = 0;
    paint();
  });
  audio.addEventListener("loadedmetadata", function () {
    if (tDur) tDur.textContent = clock(audio.duration);
    paint();
  });
  audio.addEventListener("timeupdate", paint);

  if (seek) {
    seek.addEventListener("pointerdown", function () { scrubbing = true; });
    seek.addEventListener("input", function () {
      if (!audio.duration) return;
      var t = (Number(seek.value) / 1000) * audio.duration;
      seek.style.setProperty("--pct", (Number(seek.value) / 10).toFixed(2) + "%");
      if (tCur) tCur.textContent = clock(t);
    });
    seek.addEventListener("change", function () {
      if (!audio.duration) return;
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration;
      scrubbing = false;
    });
  }
})();
