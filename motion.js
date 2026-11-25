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

  var gradeGlideRafId = 0;
  var resizeRafId = 0;
  var gradeGlideUpdater = null;

  function getGfxTier() {
    if (win.YambirnoGfx && typeof win.YambirnoGfx.getTier === "function") {
      return win.YambirnoGfx.getTier();
    }
    return doc.documentElement.getAttribute("data-gfx-tier") || "balanced";
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

    var updateGradeCapsule = function () {
      gradeGlideRafId = 0;
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

    var scheduleUpdate = function () {
      if (gradeGlideRafId) return;
      gradeGlideRafId = win.requestAnimationFrame(updateGradeCapsule);
    };

    gradeGlideUpdater = scheduleUpdate;

    bar.addEventListener("click", function (e) {
      if (e.target && e.target.closest && e.target.closest(".grade-pill")) {
        scheduleUpdate();
      }
    });

    if (typeof win.MutationObserver === "function") {
      var gradeObserver = new win.MutationObserver(scheduleUpdate);
      gradeObserver.observe(bar, {
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
      });
    }

    scheduleUpdate();
  }

  function initExtendedAmbientAutoPause() {
    var targets = [
      doc.getElementById("chalkboard-widget"),
      doc.getElementById("school-publications"),
      doc.querySelector(".stats-banner")
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

    var feedObserver = new win.MutationObserver(function () {
      enforceLiteLazyImages(pubGrid);
    });
    feedObserver.observe(pubGrid, { childList: true });
  }

  function bindGfxChangeReactions() {
    win.addEventListener("yambirno:gfxchange", function (e) {
      var detail = (e && e.detail) || {};
      var tier = detail.tier || getGfxTier();
      var mode = detail.mode || "auto";

      resetHighOnlyTransforms();
      flushRevealAndCountersForLite();
      enforceLiteLazyImages(doc);

      if (typeof gradeGlideUpdater === "function") {
        gradeGlideUpdater();
      }
      if (typeof win.refreshAllGlidePills === "function") {
        win.refreshAllGlidePills();
      }

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
          if (typeof gradeGlideUpdater === "function") {
            gradeGlideUpdater();
          }
        });
      },
      { passive: true }
    );
  }

  function bootMotionLayer() {
    if (win.YambirnoGfx && typeof win.YambirnoGfx.bindSwitcher === "function") {
      win.YambirnoGfx.bindSwitcher();
    }
    syncA11yWithGfxEngine();
    initGradeGlideCapsule();
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
    refreshGradeCapsule: function () {
      if (typeof gradeGlideUpdater === "function") {
        gradeGlideUpdater();
      }
    },
    enforceLiteLazy: function () {
      enforceLiteLazyImages(doc);
    }
  };
})(window, document);
