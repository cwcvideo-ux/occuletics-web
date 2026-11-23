/* ============================================================
   OCCULETICS — edit this file only
   ------------------------------------------------------------
   Paste real Square Payment Links over every REPLACE_ME URL.
   Paste the Facebook and LinkedIn page URLs the same way.
   The credential line is a placeholder until the final wording
   is confirmed. The site writes these values into the pages.
   After a Square payment, set the link's redirect to:
   https://occuletics.com/thank-you/
   ============================================================ */
window.OCCULETICS = {
  credential: "David M. Wilson, LAT, ATC",
  contact: {
    email: "occuletics@gmail.com",
    phoneDisplay: "219-781-0765",
    phoneTel: "+12197810765"
  },
  social: {
    facebook: "https://www.facebook.com/REPLACE_ME",
    linkedin: "https://www.linkedin.com/company/REPLACE_ME"
  },
  /* mailto opens the visitor's email app.
     To use a hosted form instead, paste a full https URL, for example
     https://formspree.io/f/xxxxxxxx */
  formAction: "mailto:occuletics@gmail.com",
  images: {
    poster: "/images/pre-shift-warm-up.png",
    miners: "/images/stretches/miners.svg",
    overhead: "/images/stretches/overhead-side.svg",
    shoulder: "/images/stretches/posterior-shoulder.svg",
    chest: "/images/stretches/chest.svg",
    hamstring: "/images/stretches/hamstring.svg",
    quad: "/images/stretches/standing-quad.svg"
  },
  /* Paste a real Square Payment Link over each url.
     Until that url no longer contains REPLACE_ME, the button
     emails occuletics@gmail.com with the subject below. */
  payments: {
    "pre-shift-pdf": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Pre-Shift Warm-Up digital PDF",
      label: "Buy PDF"
    },
    "pre-shift-print": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Pre-Shift Warm-Up printed 18x24",
      label: "Buy print"
    },
    "pre-shift-laminated": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Pre-Shift Warm-Up laminated 18x24",
      label: "Buy laminated"
    },
    "kit-starter": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Break-room starter kit",
      label: "Buy the starter"
    },
    "kit-shift": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Shift kit",
      label: "Buy the shift kit"
    },
    "directory-standard-year": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Directory standard listing, one year",
      label: "Pay the year"
    },
    "directory-standard-month": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Directory standard listing, one month",
      label: "Pay the month"
    },
    "directory-featured-year": {
      url: "https://square.link/u/REPLACE_ME",
      subject: "Order: Directory featured listing, one year",
      label: "Pay featured"
    }
  }
};
