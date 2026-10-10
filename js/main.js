// ==========================================================================
// Nothing. Corp — script principal (vanilla JS)
// ==========================================================================

// ---------- Marquage du lien de navigation actif ----------
(function highlightActiveNav() {
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  const file = path.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const target = link.getAttribute("data-nav-link");
    const isHome = target === "index.html" && (file === "" || file === "index.html");
    if (isHome || target === file) {
      link.classList.add("active");
    }
  });
})();

// ---------- Menu mobile ----------
(function mobileMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  if (!toggle || !mobileNav) return;

  const iconMenu = toggle.querySelector(".icon-menu");
  const iconClose = toggle.querySelector(".icon-close");

  function setOpen(open) {
    mobileNav.classList.toggle("open", open);
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    if (iconMenu && iconClose) {
      iconMenu.style.display = open ? "none" : "block";
      iconClose.style.display = open ? "block" : "none";
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(!mobileNav.classList.contains("open"));
  });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });
})();

// ---------- Toast ----------
function showToast(title, description) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = '<div class="toast-title"></div><div class="toast-desc"></div>';
    document.body.appendChild(toast);
  }
  toast.querySelector(".toast-title").textContent = title;
  toast.querySelector(".toast-desc").textContent = description || "";
  toast.classList.add("visible");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("visible"), 4000);
}

// ---------- Configurateur de devis (page sites-web) ----------
(function quoteConfigurator() {
  const root = document.querySelector("[data-configurator]");
  if (!root) return;

  const state = {
    activity: "artisan",
    pages: 3,
    seo: true,
    form: true,
    multi: false,
  };

  const activityButtons = root.querySelectorAll("[data-activity]");
  const pagesInput = root.querySelector("[data-pages-input]");
  const pagesLabel = root.querySelector("[data-pages-label]");
  const toggles = root.querySelectorAll("[data-toggle]");
  const estimationEl = root.querySelector("[data-estimation]");
  const finalizeBtn = root.querySelector("[data-finalize]");

  const ACTIVITY_LABELS = {
    horeca: "Horeca",
    artisan: "Artisan / Commerce",
    service: "Service Professionnel",
    autre: "Autre",
  };

  function computeRange({ pages, seo, form, multi }) {
    let min = 150;
    let max = 250;
    if (pages >= 2 && pages <= 5) {
      min = 300;
      max = 500;
    } else if (pages > 5) {
      min = 550;
      max = 900 + (pages - 5) * 80;
    }
    if (seo) { min += 80; max += 150; }
    if (form) { min += 40; max += 90; }
    if (multi) { min += 120; max += 250; }
    return { min, max };
  }

  function render() {
    activityButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.activity === state.activity);
    });
    pagesLabel.textContent = `Nombre de pages : ${state.pages}`;
    toggles.forEach((btn) => {
      const key = btn.dataset.toggle;
      const on = state[key];
      btn.querySelector(".toggle-switch").classList.toggle("on", on);
    });
    const { min, max } = computeRange(state);
    estimationEl.textContent = `${min}€ — ${max}€`;
  }

  activityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activity = btn.dataset.activity;
      render();
    });
  });

  pagesInput.addEventListener("input", (e) => {
    state.pages = Number(e.target.value);
    render();
  });

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.toggle;
      state[key] = !state[key];
      render();
    });
  });

  finalizeBtn.addEventListener("click", () => {
    const { min, max } = computeRange(state);
    const summary = `Configurateur — Activité : ${ACTIVITY_LABELS[state.activity]} · Pages : ${state.pages} · SEO : ${state.seo ? "oui" : "non"} · Formulaire : ${state.form ? "oui" : "non"} · Multilingue : ${state.multi ? "oui" : "non"} · Estimation : ${min}€ — ${max}€`;
    const params = new URLSearchParams({ type: "site-web", message: summary });
    window.location.href = `contact.html?${params.toString()}`;
  });

  render();
})();

// ---------- Pré-remplissage du formulaire de contact via query string ----------
(function prefillContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const message = params.get("message");

  if (type) {
    const select = form.querySelector('[name="type"]');
    if (select && ["site-web", "audiovisuel", "les-deux"].includes(type)) {
      select.value = type;
    }
  }
  if (message) {
    const textarea = form.querySelector('[name="message"]');
    if (textarea) textarea.value = message;
  }
})();

// ---------- Validation & soumission du formulaire de contact ----------
(function contactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');

  function setError(fieldName, message) {
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (errorEl) errorEl.textContent = message || "";
  }

  function validate(data) {
    const errors = {};
    if (!data.name || data.name.trim().length < 2) {
      errors.name = "Nom requis (2 caractères minimum)";
    } else if (data.name.trim().length > 80) {
      errors.name = "Nom trop long";
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRe.test(data.email.trim())) {
      errors.email = "Email invalide";
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.message = "Précisez votre demande (10 caractères min.)";
    } else if (data.message.trim().length > 2000) {
      errors.message = "Message trop long";
    }

    return errors;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    ["name", "email", "message"].forEach((f) => setError(f, ""));

    const errors = validate(data);
    Object.entries(errors).forEach(([field, msg]) => setError(field, msg));
    if (Object.keys(errors).length > 0) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi...";

    // Pas de backend : simulation locale.
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("[contact] submission", data);

    showToast("Message envoyé", "Nous revenons vers vous sous 24-48h.");

    form.reset();
    const select = form.querySelector('[name="type"]');
    if (select) select.value = "site-web";

    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer ma demande";
  });
})();
