(function () {
  var root = document.getElementById("listing-results");
  if (!root) return;

  var status = document.getElementById("listing-count");
  var empty = document.getElementById("listing-empty");
  var form = document.getElementById("directory-filters");
  var listings = [];

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function checkedValues(selector) {
    return Array.prototype.filter.call(
      form.querySelectorAll(selector + ":checked"),
      function (box) { return box.value; }
    ).map(function (box) { return box.value; });
  }

  function matches(item) {
    var state = form.querySelector("[name=state]").value;
    var place = form.querySelector("[name=place]").value.trim().toLowerCase();
    var types = checkedValues("[data-type]");
    var services = checkedValues("[data-service]");
    if (state && item.state !== state) return false;
    if (place) {
      var hay = (item.city + " " + item.county + " " + item.zip).toLowerCase();
      if (hay.indexOf(place) === -1) return false;
    }
    if (types.length && types.indexOf(item.providerType) === -1) return false;
    for (var i = 0; i < services.length; i += 1) {
      if (item.services.indexOf(services[i]) === -1) return false;
    }
    if (form.querySelector("[name=sameDay]").checked && !item.sameDay) return false;
    if (form.querySelector("[name=modifiedDuty]").checked && !item.modifiedDuty) return false;
    if (form.querySelector("[name=spanish]").checked && !item.spanish) return false;
    if (form.querySelector("[name=workConditioning]").checked && !item.workConditioning) return false;
    if (form.querySelector("[name=fce]").checked && !item.fce) return false;
    if (form.querySelector("[name=postOffer]").checked && !item.postOffer) return false;
    if (form.querySelector("[name=jobSite]").checked && !item.jobSite) return false;
    if (form.querySelector("[name=directAccess]").checked && !item.directAccess) return false;
    if (form.querySelector("[name=athleticTrainer]").checked && !item.athleticTrainer) return false;
    return true;
  }

  function card(item) {
    var services = item.services.map(function (name) {
      return "<li>" + esc(name) + "</li>";
    }).join("");
    var badge = item.featured ? '<span class="badge stock">Featured</span>' : '<span class="badge line">Listing</span>';
    return (
      '<article class="card listing' + (item.featured ? " featured" : "") + '">' +
        '<div class="card-top">' + badge +
          '<span class="badge line">' + esc(item.state) + " · " + esc(item.county) + " County</span>" +
        "</div>" +
        '<p class="kicker" style="margin:0.35rem 0 0">' + esc(item.providerType) + "</p>" +
        "<h2>" + esc(item.name) + "</h2>" +
        "<p>" + esc(item.address) + "<br>" + esc(item.city) + ", " + esc(item.state) + " " + esc(item.zip) + "</p>" +
        '<p><a href="tel:' + esc(item.phoneTel) + '">' + esc(item.phone) + "</a></p>" +
        '<p><a href="' + esc(item.website) + '" target="_blank" rel="noopener noreferrer">' + esc(item.website.replace(/^https?:\/\//, "")) + ' <span class="sr-only">(opens in a new tab)</span></a></p>' +
        "<p><strong>Hours.</strong> " + esc(item.hours) + "</p>" +
        '<ul class="tag-list">' + services + "</ul>" +
        "<p><strong>Reports.</strong> " + esc(item.reportTurnaround) + "</p>" +
        "<p><strong>DOT certified examiner</strong> (FMCSA National Registry): " + (item.dotExaminer ? "Yes" : "No") + "</p>" +
        "<p><strong>Work conditioning / work hardening:</strong> " + (item.workConditioning ? "Yes" : "No") +
          ". <strong>FCE:</strong> " + (item.fce ? "Yes" : "No") +
          ". <strong>Post-offer / pre-employment screens:</strong> " + (item.postOffer ? "Yes" : "No") +
          ". <strong>Return-to-work / job-site analysis:</strong> " + (item.jobSite ? "Yes" : "No") +
          ". <strong>Direct access:</strong> " + (item.directAccess ? "Yes" : "No") +
          ". <strong>Sports medicine / athletic trainer on staff:</strong> " + (item.athleticTrainer ? "Yes" : "No") + ".</p>" +
        (item.providerType === "Physical Therapy"
          ? '<p class="fine">Check claim authorization. A work comp claim usually still needs an order from the authorized treating physician.</p>'
          : "") +
        "<p><strong>Modified duty / return to work:</strong> " + (item.modifiedDuty ? "Yes" : "No") +
          ". <strong>Same-day access:</strong> " + (item.sameDay ? "Yes" : "No") +
          ". <strong>Spanish spoken:</strong> " + (item.spanish ? "Yes" : "No") + "</p>" +
        "<p><strong>Self-reported carrier and TPA participation:</strong> " + esc(item.participation.join(", ")) + ".</p>" +
        '<p class="fine">Confirm network participation with your carrier.</p>' +
      "</article>"
    );
  }

  function render() {
    var shown = listings.filter(matches);
    shown.sort(function (a, b) {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    root.innerHTML = shown.map(card).join("");
    if (empty) empty.hidden = shown.length !== 0;
    if (status) {
      status.textContent = shown.length + (shown.length === 1 ? " sample listing" : " sample listings");
    }
  }

  function setupAudience() {
    var tabs = document.querySelectorAll("[data-audience]");
    var panels = document.querySelectorAll("[data-audience-panel]");
    function show(name) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-audience") === name;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-audience-panel") !== name;
      });
    }
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { show(tab.getAttribute("data-audience")); });
    });
  }

  setupAudience();
  fetch("/data/providers.json")
    .then(function (response) {
      if (!response.ok) throw new Error("bad status");
      return response.json();
    })
    .then(function (data) {
      listings = data.listings || [];
      form.addEventListener("input", render);
      form.addEventListener("change", render);
      form.addEventListener("reset", function () {
        window.setTimeout(render, 0);
      });
      render();
    })
    .catch(function () {
      root.innerHTML = '<p class="disclaimer">The listing file did not load. Serve this site from a local web server, then reload.</p>';
      if (status) status.textContent = "Listings unavailable";
    });
})();
