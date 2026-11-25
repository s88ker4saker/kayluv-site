/*
 * Two dialogs (concert details, recording details) and the tap-to-play
 * disc. Nothing autoplays; the audio is preload="none" so the file is
 * only fetched when someone asks for it.
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

  /* ---- the record ---- */
  var audio = document.getElementById("audio");
  var disc = document.getElementById("play-btn");
  if (!audio || !disc) return;

  function setState(playing) {
    disc.setAttribute("aria-pressed", String(playing));
    disc.setAttribute("aria-label",
      (playing ? "Pause" : "Play") + " \u201cDay by Day\u201d");
  }

  disc.addEventListener("click", function () {
    if (audio.paused) audio.play().catch(function () {
      disc.setAttribute("aria-label", "Could not play \u201cDay by Day\u201d");
    });
    else audio.pause();
  });

  audio.addEventListener("play", function () { setState(true); });
  audio.addEventListener("pause", function () { setState(false); });
  audio.addEventListener("ended", function () {
    setState(false);
    audio.currentTime = 0;
  });
})();
