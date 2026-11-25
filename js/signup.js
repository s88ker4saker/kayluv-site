/*
 * Netlify Forms submission over fetch so the visitor stays on the page and
 * gets an inline confirmation. If JS fails the form still POSTs normally.
 */
(function () {
  "use strict";

  var form = document.getElementById("signup-form");
  var msg  = document.getElementById("form-msg");
  if (!form || !msg) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector("button");

    msg.hidden = false;
    msg.className = "form-msg";
    msg.textContent = "Sending…";
    btn.disabled = true;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      form.reset();
      msg.className = "form-msg ok";
      msg.textContent = "Thank you — you’re on the list.";
    }).catch(function () {
      msg.className = "form-msg err";
      msg.textContent = "Something went wrong. Please try again.";
    }).then(function () {
      btn.disabled = false;
    });
  });
})();
