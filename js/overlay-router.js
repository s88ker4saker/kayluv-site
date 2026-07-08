/*
 * KAYLUV.SITE — overlay router (build step 3, SPEC §4/§9)
 *
 * The room is a persistent shell: clicking a same-origin section link
 * (hotspot or gear nav) fetches that section's standalone page, extracts its
 * [data-overlay-root] fragment, and shows it in an overlay above the dimmed
 * room. history.pushState keeps real URLs; Back and Escape both return to
 * the room. Full page loads never happen inside the shell, so the future
 * audio manager (radio, SPEC §8) survives navigation.
 *
 * Content is authored once, in the standalone pages (/counter/index.html
 * etc.) — this router is just a reader of those pages.
 *
 * History invariant: opening from the room PUSHES one entry; navigating
 * overlay→overlay REPLACES it. The entry beneath an open overlay is
 * therefore always the room, so "close" is always exactly history.back().
 */
(function () {
  "use strict";

  var SHELL_TITLE = document.title;
  var scrim = document.getElementById("overlay-scrim");
  var panel = document.getElementById("overlay-panel");
  var body = document.getElementById("overlay-body");
  var closeButton = document.getElementById("overlay-close");
  var room = document.getElementById("room-viewport");

  var cache = new Map(); // path -> { title, label, fragment }
  var isOpen = false;
  var closing = false;   // a history.back() is in flight; ignore repeat closes
  var openSeq = 0;       // only the latest fetch may render
  var invoker = null;    // element to refocus when the overlay closes

  function normalize(path) {
    return path.replace(/\/index\.html$/, "/");
  }

  /* Section URLs are directories (SPEC §5). Anything else (files, the room
     itself) is not overlay material. */
  function isSectionPath(path) {
    return path !== "/" && path.slice(-1) === "/";
  }

  function load(path) {
    if (cache.has(path)) return Promise.resolve(cache.get(path));
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " for " + path);
      return res.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var root = doc.querySelector("[data-overlay-root]");
      if (!root) throw new Error("no [data-overlay-root] in " + path);
      var heading = root.querySelector("h1");
      var entry = {
        title: doc.title || SHELL_TITLE,
        label: heading ? heading.textContent : doc.title,
        fragment: document.importNode(root, true)
      };
      cache.set(path, entry);
      return entry;
    });
  }

  function openOverlay(path, historyMode) { // "push" | "replace" | "none"
    var seq = ++openSeq;

    if (historyMode === "push") history.pushState({}, "", path);
    else if (historyMode === "replace") history.replaceState({}, "", path);

    if (!isOpen) {
      isOpen = true;
      scrim.hidden = false;
      panel.hidden = false;
      room.inert = true; // room unfocusable + hidden from AT while overlaid
    }

    body.innerHTML = '<p class="overlay-loading">Fetching the pages&hellip;</p>';
    body.scrollTop = 0;
    body.focus();

    load(path).then(function (entry) {
      if (seq !== openSeq || !isOpen) return; // superseded or closed meanwhile
      panel.setAttribute("aria-label", entry.label);
      document.title = entry.title;
      body.innerHTML = "";
      body.appendChild(entry.fragment.cloneNode(true));
      body.scrollTop = 0;
      body.focus();
    }).catch(function () {
      if (seq !== openSeq) return;
      // page missing or unreachable: fall back to a real navigation so the
      // browser shows the actual page or the in-world 404
      location.assign(path);
    });
  }

  function closeNow() {
    closing = false;
    if (!isOpen) return;
    isOpen = false;
    openSeq++; // cancel any in-flight render
    panel.hidden = true;
    scrim.hidden = true;
    room.inert = false;
    body.innerHTML = "";
    document.title = SHELL_TITLE;
    if (invoker) {
      invoker.focus();
      // invoker may be inside the (now closed) gear panel and unfocusable
      if (document.activeElement !== invoker) {
        document.getElementById("gear-button").focus();
      }
      invoker = null;
    }
  }

  function requestClose() {
    if (!isOpen || closing) return;
    closing = true;
    history.back(); // lands on the room ('/') — see history invariant above
  }

  /* Back/forward buttons: the URL is the state; mirror it. */
  window.addEventListener("popstate", function () {
    var path = normalize(location.pathname);
    if (isSectionPath(path)) openOverlay(path, "none");
    else closeNow();
  });

  /* Intercept plain left-clicks on same-origin section links anywhere in
     the shell (SVG hotspots, gear nav, links inside overlay content). */
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.hasAttribute("download")) return;

    // SVG <a> exposes href/target as SVGAnimatedString
    var href = typeof a.href === "string" ? a.href : a.href.baseVal;
    var target = typeof a.target === "string" ? a.target : a.target.baseVal;
    if (target && target !== "_self") return;

    var url = new URL(href, location.href);
    if (url.origin !== location.origin) return;

    var path = normalize(url.pathname);

    if (path === "/") { // "Return to the Shop" / gear's "The Shop" link
      e.preventDefault();
      if (window.KAYLUV && window.KAYLUV.closeGearMenu) window.KAYLUV.closeGearMenu();
      if (isOpen) requestClose();
      return;
    }

    if (!isSectionPath(path)) return; // not a section — let the browser go

    e.preventDefault();
    invoker = a;
    if (window.KAYLUV && window.KAYLUV.closeGearMenu) window.KAYLUV.closeGearMenu();
    openOverlay(path, isOpen ? "replace" : "push");
  });

  /* Escape returns to the room (SPEC §4) — unless the gear panel is open,
     in which case gear-menu.js consumes this press to close itself first.
     Capture phase so we decide before the gear menu's bubble handler runs. */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !isOpen) return;
    if (window.KAYLUV && window.KAYLUV.isGearMenuOpen && window.KAYLUV.isGearMenuOpen()) return;
    requestClose();
  }, true);

  closeButton.addEventListener("click", requestClose);
  scrim.addEventListener("click", requestClose);
})();
