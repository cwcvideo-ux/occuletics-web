(function () {
  var cfg = window.OCCULETICS || {};

  if (cfg.credential) {
    document.querySelectorAll("[data-credential]").forEach(function (el) {
      el.textContent = cfg.credential;
    });
  }

  if (cfg.contact) {
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.textContent = cfg.contact.email;
      if (el.tagName === "A") el.href = "mailto:" + cfg.contact.email;
    });
    document.querySelectorAll("[data-phone]").forEach(function (el) {
      el.textContent = cfg.contact.phoneDisplay;
      if (el.tagName === "A") el.href = "tel:" + cfg.contact.phoneTel;
    });
  }

  if (cfg.payments) {
    var orderEmail = (cfg.contact && cfg.contact.email) || "occuletics@gmail.com";
    document.querySelectorAll("[data-payment]").forEach(function (el) {
      var key = el.getAttribute("data-payment");
      var entry = cfg.payments[key];
      var url = typeof entry === "string" ? entry : (entry && entry.url);
      var subject = (entry && entry.subject) || ("Order: " + key);
      var ready = url && url.indexOf("REPLACE_ME") === -1;
      if (ready) {
        el.href = url;
        if (entry && entry.label) el.textContent = entry.label;
      } else {
        el.href = "mailto:" + orderEmail + "?subject=" + encodeURIComponent(subject);
        el.textContent = "Order by email";
      }
    });
  }

  var socialList = document.querySelector(".social");
  if (socialList && cfg.social) {
    var socialIcons = {
      facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.5V6.9c0-.5.3-.6.6-.6h1.6V4h-2.2C12.1 4 11.4 5.5 11.4 6.8v1.7H9.4V11h2v8h2.5v-8h2.1l.3-2.5h-2.1z"/></svg>',
      linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 9H3.6v11.5h2.6V9zM4.9 3.6C4 3.6 3.3 4.3 3.3 5.2s.7 1.6 1.6 1.6 1.6-.7 1.6-1.6-.7-1.6-1.6-1.6zM20.2 13.3c0-2.4-1.3-3.5-3-3.5-1.4 0-2 .8-2.4 1.3V9h-2.5v11.5h2.5v-6.4c0-.3 0-.6.1-.9.3-.6.8-1.2 1.8-1.2 1.3 0 1.8 1 1.8 2.4v6.1h2.5V13.3z"/></svg>'
    };
    var socialLabels = {
      facebook: "Occuletics on Facebook",
      linkedin: "Occuletics on LinkedIn"
    };
    socialList.textContent = "";
    ["facebook", "linkedin"].forEach(function (name) {
      var url = cfg.social[name];
      if (!url || url.indexOf("REPLACE_ME") !== -1) return;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", socialLabels[name]);
      a.innerHTML = socialIcons[name];
      li.appendChild(a);
      socialList.appendChild(li);
    });
  }

  if (cfg.images) {
    document.querySelectorAll("[data-image]").forEach(function (el) {
      var src = cfg.images[el.getAttribute("data-image")];
      if (src) el.src = src;
    });
  }

  var check = document.querySelector(".nav-check");
  var toggle = document.querySelector(".nav-toggle");
  if (check && toggle) {
    var sync = function () {
      toggle.setAttribute("aria-expanded", check.checked ? "true" : "false");
    };
    check.addEventListener("change", sync);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && check.checked) {
        check.checked = false;
        sync();
        toggle.focus();
      }
    });
    document.querySelectorAll(".site-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        check.checked = false;
        sync();
      });
    });
  }

  var buttons = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-line]");
  var count = document.getElementById("filter-count");

  function applyFilter(name) {
    var shown = 0;
    cards.forEach(function (card) {
      var on = name === "all" || card.getAttribute("data-line") === name;
      card.hidden = !on;
      if (on) shown += 1;
    });
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-filter") === name ? "true" : "false");
    });
    if (count) {
      var label = name === "all" ? "All lines" : name.charAt(0).toUpperCase() + name.slice(1);
      count.textContent = label + " · " + shown + (shown === 1 ? " title" : " titles");
    }
  }

  if (buttons.length && cards.length) {
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-filter");
        applyFilter(name);
        if (history.replaceState) {
          history.replaceState(null, "", name === "all" ? "#all" : "#" + name);
        }
      });
    });
    var hash = (location.hash || "").replace("#", "");
    if (hash === "industrial" || hash === "office" || hash === "retail") applyFilter(hash);
    else applyFilter("all");
  }

  var form = document.querySelector("[data-inquiry]");
  if (!form) return;

  var params = new URLSearchParams(location.search);
  var interest = params.get("interest");
  var select = form.querySelector("[name=interest]");
  var message = form.querySelector("[name=message]");
  if (interest && select) {
    var match = Array.prototype.some.call(select.options, function (opt) {
      return opt.value === interest;
    });
    if (match) select.value = interest;
    else if (message && !message.value) {
      message.value = "Please tell me when this is ready: " + interest;
    }
  }

  var action = cfg.formAction || "";
  if (/^https?:/i.test(action)) {
    form.action = action;
    form.method = "post";
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var email = (cfg.contact && cfg.contact.email) || "occuletics@gmail.com";
    var listing = form.getAttribute("data-inquiry") === "listing";
    var subject = listing
      ? "Directory listing application — " + (data.get("clinic") || "Clinic")
      : "Occuletics inquiry — " + (data.get("interest") || "General");
    var body;
    if (listing) {
      var lines = [];
      data.forEach(function (value, key) {
        if (key === "services" || key === "pt") return;
        lines.push(key + ": " + value);
      });
      var services = data.getAll("services");
      if (services.length) lines.push("services: " + services.join(", "));
      var pt = data.getAll("pt");
      if (pt.length) lines.push("pt capabilities: " + pt.join(", "));
      body = lines.join("\n");
    } else {
      body = [
        "Name: " + (data.get("name") || ""),
        "Company: " + (data.get("company") || ""),
        "Email: " + (data.get("email") || ""),
        "Phone: " + (data.get("phone") || ""),
        "Interest: " + (data.get("interest") || ""),
        "",
        data.get("message") || ""
      ].join("\n");
    }
    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    var status = document.getElementById("form-status");
    if (status) {
      status.textContent = "Your email app should open with this message. If it does not, write " + email + ".";
    }
  });
})();
