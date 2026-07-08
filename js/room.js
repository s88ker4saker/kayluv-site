/*
 * KAYLUV.SITE — room shell (build step 2, SPEC §9)
 * Renders the hotspot overlay from ROOM_HOTSPOTS (js/hotspot-data.js) and
 * handles the pan/centering behavior of the cover-fit room.
 */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var data = window.ROOM_HOTSPOTS;
  var layer = document.getElementById("hotspot-layer");
  var viewport = document.getElementById("room-viewport");

  /* ------------------------------------------------- fire-glow filter
   * SVG dialect of the shared fire-gradient hover language: same three
   * shadows as the CSS .fire-glow class (css/main.css), as feDropShadow
   * primitives, because WebKit/Safari does not apply CSS filter() to
   * elements inside an <svg>. stdDeviation is in canvas user units.
   * If you retune one, retune both.
   */
  function buildGlowFilter() {
    var defs = document.createElementNS(SVG_NS, "defs");
    var filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", "fire-glow-svg");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");

    [
      ["12", "#F0A800", "0.95"], // gold core
      ["26", "#E85C10", "0.70"], // orange bloom
      ["48", "#C81E1E", "0.45"]  // red fringe
    ].forEach(function (layer) {
      var shadow = document.createElementNS(SVG_NS, "feDropShadow");
      shadow.setAttribute("dx", "0");
      shadow.setAttribute("dy", "0");
      shadow.setAttribute("stdDeviation", layer[0]);
      shadow.setAttribute("flood-color", layer[1]);
      shadow.setAttribute("flood-opacity", layer[2]);
      filter.appendChild(shadow);
    });

    defs.appendChild(filter);
    layer.appendChild(defs);
  }

  /* ------------------------------------------------- hotspot overlay
   * One shape per interactive object, positioned in canvas units derived
   * from the percentage coordinates in the data file. Destination objects
   * are real links (Enter activates natively); no-destination objects
   * (clock, cat) are focusable buttons whose behavior arrives with the
   * sound layer (SPEC §9 step 7). staticAtLaunch objects (radio, lantern)
   * render nothing yet (SPEC §6: no hover/click at launch).
   */
  function buildHotspots() {
    var cw = data.canvas.width;
    var ch = data.canvas.height;

    data.objects.forEach(function (obj) {
      if (obj.staticAtLaunch) return;

      var el;
      if (obj.href) {
        el = document.createElementNS(SVG_NS, "a");
        el.setAttribute("href", obj.href);
      } else {
        el = document.createElementNS(SVG_NS, "g");
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault(); // in-room reaction arrives with the sound layer
          }
        });
      }

      el.classList.add("hotspot");
      el.setAttribute("aria-label", obj.label);
      el.setAttribute("data-object", obj.id);

      var title = document.createElementNS(SVG_NS, "title");
      title.textContent = obj.label;

      var rect = document.createElementNS(SVG_NS, "rect");
      rect.setAttribute("class", "hotspot-shape");
      rect.setAttribute("x", (obj.coords.x / 100) * cw);
      rect.setAttribute("y", (obj.coords.y / 100) * ch);
      rect.setAttribute("width", (obj.coords.w / 100) * cw);
      rect.setAttribute("height", (obj.coords.h / 100) * ch);
      rect.setAttribute("rx", 18);

      el.appendChild(title);
      el.appendChild(rect);
      layer.appendChild(el);
    });
  }

  /* ------------------------------------------------- pan & centering
   * Narrow viewports: the stage is wider than the screen; native
   * overflow-x scroll gives touch pan. Here we center the initial view
   * and add mouse-drag panning for pointer users.
   */
  function centerRoom() {
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
  }

  function enableMouseDrag() {
    var dragging = false;
    var suppressClick = false;
    var startX = 0;
    var startScroll = 0;

    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      suppressClick = false;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
    });

    viewport.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) suppressClick = true;
      viewport.scrollLeft = startScroll - dx;
    });

    ["pointerup", "pointercancel"].forEach(function (type) {
      viewport.addEventListener(type, function () {
        dragging = false;
      });
    });

    // a drag that ends on a hotspot must not activate it
    viewport.addEventListener(
      "click",
      function (e) {
        if (suppressClick) {
          e.preventDefault();
          e.stopPropagation();
          suppressClick = false;
        }
      },
      true
    );
  }

  buildGlowFilter();
  buildHotspots();
  enableMouseDrag();
  centerRoom();
  window.addEventListener("resize", centerRoom);
})();
