/*
 * KAYLUV.SITE — Bulletin board rendering (SPEC §6: "Sprite; JSON content")
 *
 * Populates notices (data/notices.json) and listening links
 * (data/listen-links.json) into the Bulletin's markup. Runs in two contexts
 * through one init(root) contract:
 *   - standalone /bulletin/ page: self-inits on DOMContentLoaded
 *   - shell overlay: js/overlay-router.js dispatches "kayluv:overlay-content"
 *     on document after inserting a page's fragment; this module inits
 *     itself when the event's path is /bulletin/
 *
 * The signup slot ([data-signup-slot]) is a deliberate placeholder — no
 * newsletter platform is chosen yet (2026-07-11). Swap its contents for the
 * real signup widget later; nothing else here needs to change.
 */
(function () {
  "use strict";

  function formatDate(iso) {
    var parts = iso.split("-").map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function renderNotices(root, notices) {
    var list = root.querySelector("[data-notices]");
    if (!list) return;
    if (!notices.length) {
      list.innerHTML = '<p class="placeholder-note">No notices posted yet.</p>';
      return;
    }
    list.innerHTML = "";
    notices.forEach(function (notice) {
      var card = document.createElement("article");
      card.className = "notice";

      var when = document.createElement("p");
      when.className = "notice-when";
      when.textContent = formatDate(notice.date) + (notice.time ? " · " + notice.time : "");
      card.appendChild(when);

      var h3 = document.createElement("h3");
      h3.textContent = notice.title;
      card.appendChild(h3);

      if (notice.venue) {
        var venue = document.createElement("p");
        venue.className = "notice-venue";
        venue.textContent = notice.venue;
        card.appendChild(venue);
      }

      var body = document.createElement("p");
      body.textContent = notice.body;
      card.appendChild(body);

      if (notice.href) {
        var link = document.createElement("a");
        link.href = notice.href;
        link.textContent = "More →";
        card.appendChild(link);
      }

      list.appendChild(card);
    });
  }

  function renderListenLinks(root, links) {
    var list = root.querySelector("[data-listen-links]");
    if (!list) return;
    list.innerHTML = "";
    links.forEach(function (link) {
      var li = document.createElement("li");
      if (link.url) {
        var a = document.createElement("a");
        a.href = link.url;
        a.textContent = link.platform;
        a.target = "_blank";
        a.rel = "noopener";
        li.appendChild(a);
      } else {
        li.textContent = link.platform + " — coming soon";
        li.className = "listen-link-pending";
      }
      list.appendChild(li);
    });
  }

  function init(root) {
    fetch("/data/notices.json")
      .then(function (res) { return res.json(); })
      .then(function (data) { renderNotices(root, data.notices || []); })
      .catch(function () {
        var list = root.querySelector("[data-notices]");
        if (list) list.innerHTML = '<p class="placeholder-note">Notices could not be loaded.</p>';
      });

    fetch("/data/listen-links.json")
      .then(function (res) { return res.json(); })
      .then(function (data) { renderListenLinks(root, data.links || []); })
      .catch(function () {
        var list = root.querySelector("[data-listen-links]");
        if (list) list.innerHTML = '<li class="placeholder-note">Links could not be loaded.</li>';
      });
  }

  window.KAYLUV = window.KAYLUV || {};
  window.KAYLUV.bulletin = { init: init };

  document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector("[data-notices]")) init(document);
  });

  document.addEventListener("kayluv:overlay-content", function (e) {
    if (e.detail && e.detail.path === "/bulletin/") init(e.detail.root);
  });
})();
