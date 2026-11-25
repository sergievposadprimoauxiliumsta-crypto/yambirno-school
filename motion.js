(function (win, doc) {
  "use strict";

  var TIER_LABELS = {
    high: "Ультра",
    balanced: "Стандарт",
    lite: "Эконом"
  };

  var MODE_LABELS = {
    auto: "Авто",
    high: "Максимум",
    lite: "Эконом"
  };

  var SPOTLIGHT_GRID_SELECTOR =
    ".facts-grid, .pillars-grid, .teachers-grid, .success-grid, .contacts-grid, .publications-grid, .info-blocks-grid, .steps-guide-grid, .gallery-grid";

  var MAGNETIC_SELECTOR =
    ".hero-actions .btn, .cta-bottom-action .btn-cta, .nav-cta-btn, #scroll-top-btn, .qr-share-actions .btn-max, .brand .logo-img";

  var RIPPLE_SELECTOR =
    ".btn, .btn-pub-action, .digital-tab-btn, .topic-chip, .pub-filter-chip, .btn-share-chat, .btn-max-mini, .btn-copy-mini, .btn-copy-ticket, .btn-refresh, .chalk-btn, .chalk-reveal-btn";

  var flipUpdaters = [];
  var resizeRafId = 0;
  var scrollHeaderRafId = 0;
  var statsAnimatedOnce = false;

  function getGfxTier() {
    if (win.YambirnoGfx && typeof win.YambirnoGfx.getTier === "function") {
      return win.YambirnoGfx.getTier();
    }
    return doc.documentElement.getAttribute("data-gfx-tier") || "balanced";
  }

  function isDesktopHover() {
    try {
      return Boolean(
        win.matchMedia && win.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
    } catch (_) {
      return false;
    }
  }

  function isReducedOrLite() {
    var tier = getGfxTier();
    var reduced = false;
    try {
      reduced = Boolean(
        win.matchMedia && win.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch (_) {}
    var isA11y = Boolean(doc.body && doc.body.classList.contains("visually-impaired"));
    return tier === "lite" || reduced || isA11y;
  }

  function notifyToast(message) {
    if (!message) return;
    if (typeof win.showDynamicIslandToast === "function") {
      win.showDynamicIslandToast(message);
      return;
    }
    var toast = doc.getElementById("dynamic-island-toast");
    var textEl = doc.getElementById("dynamic-island-text");
    if (!toast || !textEl) return;
    textEl.textContent = message;
    toast.setAttribute("aria-hidden", "false");
    toast.classList.add("show");
    win.setTimeout(function () {
      toast.classList.remove("show");
      toast.setAttribute("aria-hidden", "true");
    }, 3000);
  }

  function refreshAllFlipIndicators() {
    for (var i = 0; i < flipUpdaters.length; i++) {
      flipUpdaters[i]();
    }
    if (typeof win.refreshAllGlidePills === "function") {
      win.refreshAllGlidePills();
    }
  }

  function syncA11yWithGfxEngine() {
    if (!doc.body) return;

    var pushState = function () {
      var isEnabled = doc.body.classList.contains("visually-impaired");
      if (win.YambirnoGfx && typeof win.YambirnoGfx.syncA11y === "function") {
        win.YambirnoGfx.syncA11y(isEnabled);
      }
    };

    pushState();

    if (typeof win.MutationObserver === "function") {
      var bodyObserver = new win.MutationObserver(function () {
        pushState();
      });
      bodyObserver.observe(doc.body, {
        attributes: true,
        attributeFilter: ["class"]
      });
    }
  }

  function flushRevealAndCountersForLite() {
    if (!isReducedOrLite()) return;

    var pending = doc.querySelectorAll(".reveal.reveal-pending");
    for (var i = 0; i < pending.length; i++) {
      pending[i].classList.remove("reveal-pending");
      pending[i].classList.add("visible");
    }

    var statsBanner = doc.querySelector(".stats-banner");
    if (statsBanner) {
      statsBanner.classList.remove("stats-pending");
      statsBanner.classList.add("stats-animated");
      statsAnimatedOnce = true;
    }

    var counters = doc.querySelectorAll("[data-target]");
    for (var j = 0; j < counters.length; j++) {
      var el = counters[j];
      var target = parseFloat(el.getAttribute("data-target"));
      if (!isNaN(target)) {
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }
  }

  function enforceLiteLazyImages(rootNode) {
    if (getGfxTier() !== "lite") return;
    var scope = rootNode && rootNode.querySelectorAll ? rootNode : doc;
    var imgs = scope.querySelectorAll("img:not(#hero-backdrop-img):not(.logo-img)");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
      if (!img.getAttribute("decoding")) {
        img.setAttribute("decoding", "async");
      }
    }
  }

  function resetHighOnlyTransforms() {
    if (getGfxTier() === "high") return;

    var hero = doc.getElementById("hero-ambient");
    if (hero) {
      hero.style.setProperty("--hero-parallax", "0px");
    }

    var tilted = doc.querySelectorAll(".tilt-card");
    for (var i = 0; i < tilted.length; i++) {
      tilted[i].style.setProperty("--rx", "0deg");
      tilted[i].style.setProperty("--ry", "0deg");
    }

    var magnets = doc.querySelectorAll(".magnetic-target");
    for (var m = 0; m < magnets.length; m++) {
      magnets[m].style.setProperty("--mag-x", "0px");
      magnets[m].style.setProperty("--mag-y", "0px");
    }

    var grids = doc.querySelectorAll(".spotlight-grid");
    for (var g = 0; g < grids.length; g++) {
      grids[g].classList.remove("is-spotlight-active");
    }
  }

  function initSmartFloatingHeader() {
    var header = doc.querySelector(".site-header");
    if (!header) return;

    var syncScrolled = function () {
      scrollHeaderRafId = 0;
      var y = win.scrollY || doc.documentElement.scrollTop || 0;
      header.classList.toggle("is-scrolled", y > 28);
    };

    var onScroll = function () {
      if (scrollHeaderRafId) return;
      scrollHeaderRafId = win.requestAnimationFrame(syncScrolled);
    };

    win.addEventListener("scroll", onScroll, { passive: true });
    syncScrolled();
  }

  function initGradeGlideCapsule() {
    var bar = doc.getElementById("schedule-grade-pills");
    if (!bar) return;

    var indicator = bar.querySelector(".grade-glide-indicator");
    if (!indicator) {
      indicator = doc.createElement("span");
      indicator.className = "grade-glide-indicator";
      indicator.setAttribute("aria-hidden", "true");
      bar.prepend(indicator);
    }

    var rafId = 0;
    var update = function () {
      rafId = 0;
      var active = bar.querySelector(".grade-pill.active");
      if (
        !active ||
        isReducedOrLite() ||
        bar.classList.contains("hidden") ||
        active.offsetWidth === 0 ||
        active.offsetHeight === 0
      ) {
        bar.classList.remove("has-glide");
        return;
      }

      bar.classList.add("has-glide");
      indicator.style.setProperty("--grade-x", active.offsetLeft.toFixed(1) + "px");
      indicator.style.setProperty("--grade-y", active.offsetTop.toFixed(1) + "px");
      indicator.style.setProperty("--grade-w", active.offsetWidth.toFixed(1) + "px");
      indicator.style.setProperty("--grade-h", active.offsetHeight.toFixed(1) + "px");
    };

    var schedule = function () {
      if (rafId) return;
      rafId = win.requestAnimationFrame(update);
    };

    flipUpdaters.push(schedule);

    bar.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest(".grade-pill")) {
        schedule();
      }
    });

    if (typeof win.MutationObserver === "function") {
      new win.MutationObserver(schedule).observe(bar, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    schedule();
  }

  function initGfxSwitcherGlide() {
    var switcher = doc.getElementById("gfx-switcher");
    if (!switcher) return;

    var indicator = switcher.querySelector(".gfx-glide-indicator");
    if (!indicator) {
      indicator = doc.createElement("span");
      indicator.className = "gfx-glide-indicator";
      indicator.setAttribute("aria-hidden", "true");
      switcher.prepend(indicator);
    }

    var rafId = 0;
    var update = function () {
      rafId = 0;
      var active = switcher.querySelector(".gfx-choice-btn.active");
      if (
        !active ||
        isReducedOrLite() ||
        switcher.classList.contains("is-a11y-locked") ||
        active.offsetWidth === 0
      ) {
        switcher.classList.remove("has-glide");
        return;
      }

      switcher.classList.add("has-glide");
      indicator.style.setProperty("--gfx-x", active.offsetLeft.toFixed(1) + "px");
      indicator.style.setProperty("--gfx-w", active.offsetWidth.toFixed(1) + "px");
    };

    var schedule = function () {
      if (rafId) return;
      rafId = win.requestAnimationFrame(update);
    };

    flipUpdaters.push(schedule);

    if (typeof win.MutationObserver === "function") {
      new win.MutationObserver(schedule).observe(switcher, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    schedule();
  }

  function initDigitalTabsGlide() {
    var container = doc.querySelector(".digital-tabs");
    if (!container) return;

    var indicator = container.querySelector(".dtab-glide-indicator");
    if (!indicator) {
      indicator = doc.createElement("span");
      indicator.className = "dtab-glide-indicator";
      indicator.setAttribute("aria-hidden", "true");
      container.prepend(indicator);
    }

    var rafId = 0;
    var update = function () {
      rafId = 0;
      var active = container.querySelector(".digital-tab-btn.active");
      if (
        !active ||
        isReducedOrLite() ||
        active.offsetWidth === 0 ||
        active.offsetHeight === 0
      ) {
        container.classList.remove("has-glide");
        return;
      }

      container.classList.add("has-glide");
      indicator.style.setProperty("--dtab-x", active.offsetLeft.toFixed(1) + "px");
      indicator.style.setProperty("--dtab-y", active.offsetTop.toFixed(1) + "px");
      indicator.style.setProperty("--dtab-w", active.offsetWidth.toFixed(1) + "px");
      indicator.style.setProperty("--dtab-h", active.offsetHeight.toFixed(1) + "px");
    };

    var schedule = function () {
      if (rafId) return;
      rafId = win.requestAnimationFrame(update);
    };

    flipUpdaters.push(schedule);

    container.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest(".digital-tab-btn")) {
        schedule();
      }
    });

    if (typeof win.MutationObserver === "function") {
      new win.MutationObserver(schedule).observe(container, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    schedule();
  }

  function initMainNavGlide() {
    var nav = doc.querySelector(".main-nav");
    if (!nav) return;

    var indicator = nav.querySelector(".nav-glide-indicator");
    if (!indicator) {
      indicator = doc.createElement("span");
      indicator.className = "nav-glide-indicator";
      indicator.setAttribute("aria-hidden", "true");
      nav.prepend(indicator);
    }

    var hoveredLink = null;
    var rafId = 0;

    var isTrackableNavLink = function (el) {
      return Boolean(
        el &&
        el.classList.contains("nav-link") &&
        !el.classList.contains("nav-link-accent") &&
        !el.classList.contains("nav-link-live") &&
        !el.classList.contains("hidden")
      );
    };

    var update = function () {
      rafId = 0;
      if (isReducedOrLite()) {
        nav.classList.remove("has-glide");
        return;
      }

      var target = hoveredLink;
      if (!target) {
        var spyEl = nav.querySelector(".nav-link.spy-active:not(.nav-link-accent):not(.nav-link-live):not(.hidden)");
        target = spyEl || null;
      }

      if (!target || target.offsetWidth === 0 || target.offsetHeight === 0) {
        nav.classList.remove("has-glide");
        return;
      }

      nav.classList.add("has-glide");
      indicator.style.setProperty("--nav-x", target.offsetLeft.toFixed(1) + "px");
      indicator.style.setProperty("--nav-y", target.offsetTop.toFixed(1) + "px");
      indicator.style.setProperty("--nav-w", target.offsetWidth.toFixed(1) + "px");
      indicator.style.setProperty("--nav-h", target.offsetHeight.toFixed(1) + "px");
    };

    var schedule = function () {
      if (rafId) return;
      rafId = win.requestAnimationFrame(update);
    };

    flipUpdaters.push(schedule);

    if (isDesktopHover()) {
      nav.addEventListener("pointerover", function (e) {
        var link = e.target && e.target.closest ? e.target.closest(".nav-link") : null;
        hoveredLink = isTrackableNavLink(link) ? link : null;
        schedule();
      });

      nav.addEventListener("pointerleave", function () {
        hoveredLink = null;
        schedule();
      });
    }

    if (typeof win.MutationObserver === "function") {
      new win.MutationObserver(schedule).observe(nav, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    schedule();
  }

  function applyRevealStaggerDelays() {
    var grids = doc.querySelectorAll(
      ".facts-grid, .pillars-grid, .teachers-grid, .success-grid, .contacts-grid, .gallery-grid, .cta-reasons-grid"
    );
    for (var i = 0; i < grids.length; i++) {
      var cards = grids[i].children;
      for (var j = 0; j < cards.length; j++) {
        var delayMs = Math.min((j % 4) * 55, 220);
        cards[j].style.setProperty("--reveal-delay", delayMs + "ms");
      }
    }
  }

  function initStatsProgressReveal() {
    var banner = doc.querySelector(".stats-banner");
    if (!banner) return;

    if (isReducedOrLite() || !("IntersectionObserver" in win)) {
      banner.classList.remove("stats-pending");
      banner.classList.add("stats-animated");
      statsAnimatedOnce = true;
      return;
    }

    if (statsAnimatedOnce) return;
    banner.classList.add("stats-pending");

    var io = new win.IntersectionObserver(
      function (entries, observer) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            banner.classList.remove("stats-pending");
            banner.classList.add("stats-animated");
            statsAnimatedOnce = true;
            observer.unobserve(banner);
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(banner);
  }

  function bindSpotlightGrid(grid) {
    if (!grid) return;

    var refreshCards = function () {
      var items = grid.querySelectorAll(":scope > .elevate-card, :scope > .guide-step-card");
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add("spotlight-card");
      }
      return items;
    };

    var cards = refreshCards();

    if (grid.dataset.spotlightBound === "1") return;
    grid.dataset.spotlightBound = "1";
    grid.classList.add("spotlight-grid");

    if (!isDesktopHover()) return;

    var rafId = 0;
    var lastClientX = 0;
    var lastClientY = 0;

    var paintFrame = function () {
      rafId = 0;
      if (getGfxTier() !== "high" || isReducedOrLite()) {
        grid.classList.remove("is-spotlight-active");
        return;
      }
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var rect = card.getBoundingClientRect();
        var x = lastClientX - rect.left;
        var y = lastClientY - rect.top;
        card.style.setProperty("--mx", x.toFixed(1) + "px");
        card.style.setProperty("--my", y.toFixed(1) + "px");
      }
    };

    grid.addEventListener("pointermove", function (e) {
      if (getGfxTier() !== "high" || isReducedOrLite()) return;
      lastClientX = e.clientX;
      lastClientY = e.clientY;
      grid.classList.add("is-spotlight-active");
      if (!rafId) {
        rafId = win.requestAnimationFrame(paintFrame);
      }
    });

    grid.addEventListener("pointerleave", function () {
      if (rafId) {
        win.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      grid.classList.remove("is-spotlight-active");
    });

    if (typeof win.MutationObserver === "function") {
      new win.MutationObserver(function () {
        cards = refreshCards();
      }).observe(grid, { childList: true });
    }
  }

  function initBorderSpotlightGrids() {
    var grids = doc.querySelectorAll(SPOTLIGHT_GRID_SELECTOR);
    for (var i = 0; i < grids.length; i++) {
      bindSpotlightGrid(grids[i]);
    }
  }

  function initMagneticButtons() {
    if (!isDesktopHover()) return;

    var targets = doc.querySelectorAll(MAGNETIC_SELECTOR);
    for (var i = 0; i < targets.length; i++) {
      (function (el) {
        if (el.dataset.magneticBound === "1") return;
        el.dataset.magneticBound = "1";
        el.classList.add("magnetic-target");

        var rafId = 0;
        var nextX = 0;
        var nextY = 0;

        var applyPull = function () {
          rafId = 0;
          el.style.setProperty("--mag-x", nextX.toFixed(2) + "px");
          el.style.setProperty("--mag-y", nextY.toFixed(2) + "px");
        };

        var resetPull = function () {
          if (rafId) {
            win.cancelAnimationFrame(rafId);
            rafId = 0;
          }
          el.style.setProperty("--mag-x", "0px");
          el.style.setProperty("--mag-y", "0px");
        };

        el.addEventListener("pointermove", function (e) {
          if (getGfxTier() !== "high" || isReducedOrLite() || el.disabled) return;
          var rect = el.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          var relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          var relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          nextX = Math.max(-5.5, Math.min(5.5, relX * 5.5));
          nextY = Math.max(-4.5, Math.min(4.5, relY * 4.5));
          if (!rafId) {
            rafId = win.requestAnimationFrame(applyPull);
          }
        });

        el.addEventListener("pointerleave", resetPull);
        el.addEventListener("pointerdown", resetPull);
      })(targets[i]);
    }
  }

  function initMaterialRipple() {
    doc.addEventListener(
      "pointerdown",
      function (e) {
        if (isReducedOrLite()) return;
        if (typeof e.button === "number" && e.button !== 0) return;

        var host = e.target && e.target.closest ? e.target.closest(RIPPLE_SELECTOR) : null;
        if (!host || host.disabled) return;

        host.classList.add("ui-ripple-host");

        var rect = host.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        var diameter = Math.max(rect.width, rect.height) * 2.15;
        var isKeyboardOrigin = e.clientX === 0 && e.clientY === 0;
        var x = isKeyboardOrigin ? rect.width / 2 : e.clientX - rect.left;
        var y = isKeyboardOrigin ? rect.height / 2 : e.clientY - rect.top;

        var wave = doc.createElement("span");
        wave.className = "ui-ripple-wave";
        wave.setAttribute("aria-hidden", "true");
        wave.style.width = diameter.toFixed(1) + "px";
        wave.style.height = diameter.toFixed(1) + "px";
        wave.style.left = x.toFixed(1) + "px";
        wave.style.top = y.toFixed(1) + "px";

        host.appendChild(wave);

        var cleaned = false;
        var cleanup = function () {
          if (cleaned) return;
          cleaned = true;
          if (wave.parentNode) {
            wave.parentNode.removeChild(wave);
          }
        };

        wave.addEventListener("animationend", cleanup, { once: true });
        win.setTimeout(cleanup, 650);
      },
      { passive: true }
    );
  }

  function initExtendedAmbientAutoPause() {
    var targets = [
      doc.getElementById("chalkboard-widget"),
      doc.getElementById("school-publications"),
      doc.querySelector(".stats-banner"),
      doc.querySelector(".cta-card")
    ].filter(Boolean);

    if (targets.length === 0) return;

    var visibilityState = new WeakMap();
    for (var i = 0; i < targets.length; i++) {
      visibilityState.set(targets[i], true);
    }

    var syncPause = function () {
      var hiddenTab = Boolean(doc.hidden);
      var liteTier = getGfxTier() === "lite";
      for (var k = 0; k < targets.length; k++) {
        var el = targets[k];
        var inView = visibilityState.get(el) !== false;
        el.classList.toggle("ambient-paused", hiddenTab || liteTier || !inView);
      }
    };

    if ("IntersectionObserver" in win) {
      var io = new win.IntersectionObserver(
        function (entries) {
          for (var j = 0; j < entries.length; j++) {
            visibilityState.set(entries[j].target, entries[j].isIntersecting);
          }
          syncPause();
        },
        { threshold: 0.01 }
      );
      for (var m = 0; m < targets.length; m++) {
        io.observe(targets[m]);
      }
    }

    doc.addEventListener("visibilitychange", syncPause);
    win.addEventListener("yambirno:gfxchange", syncPause);
    syncPause();
  }

  function observeDynamicFeedImages() {
    var pubGrid = doc.getElementById("publications-grid");
    if (!pubGrid || typeof win.MutationObserver !== "function") return;

    new win.MutationObserver(function () {
      enforceLiteLazyImages(pubGrid);
      bindSpotlightGrid(pubGrid);
    }).observe(pubGrid, { childList: true });
  }

  function bindGfxChangeReactions() {
    win.addEventListener("yambirno:gfxchange", function (e) {
      var detail = (e && e.detail) || {};
      var tier = detail.tier || getGfxTier();
      var mode = detail.mode || "auto";

      resetHighOnlyTransforms();
      flushRevealAndCountersForLite();
      enforceLiteLazyImages(doc);
      refreshAllFlipIndicators();

      if (detail.isUserAction && !detail.isA11y) {
        var modeName = MODE_LABELS[mode] || "Авто";
        var tierName = TIER_LABELS[tier] || "Стандарт";
        var text =
          mode === "auto"
            ? "Графика: Авто (" + tierName + ")"
            : "Графика: " + modeName;
        notifyToast(text);
      }
    });

    win.addEventListener(
      "resize",
      function () {
        if (resizeRafId) return;
        resizeRafId = win.requestAnimationFrame(function () {
          resizeRafId = 0;
          refreshAllFlipIndicators();
        });
      },
      { passive: true }
    );

    win.addEventListener("load", refreshAllFlipIndicators, { once: true });
  }

  function bootMotionLayer() {
    if (win.YambirnoGfx && typeof win.YambirnoGfx.bindSwitcher === "function") {
      win.YambirnoGfx.bindSwitcher();
    }
    syncA11yWithGfxEngine();
    initSmartFloatingHeader();
    applyRevealStaggerDelays();
    initStatsProgressReveal();
    initGradeGlideCapsule();
    initGfxSwitcherGlide();
    initDigitalTabsGlide();
    initMainNavGlide();
    initBorderSpotlightGrids();
    initMagneticButtons();
    initMaterialRipple();
    initExtendedAmbientAutoPause();
    observeDynamicFeedImages();
    bindGfxChangeReactions();
    resetHighOnlyTransforms();
    flushRevealAndCountersForLite();
    enforceLiteLazyImages(doc);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", bootMotionLayer);
  } else {
    bootMotionLayer();
  }

  win.YambirnoMotion = {
    refreshAllFlips: refreshAllFlipIndicators,
    refreshGradeCapsule: refreshAllFlipIndicators,
    enforceLiteLazy: function () {
      enforceLiteLazyImages(doc);
    }
  };
})(window, document);
