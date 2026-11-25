(function (win, doc) {
  "use strict";

  var MODE_STORAGE_KEY = "yambirno_gfx_mode_v1";
  var A11Y_STORAGE_KEY = "yambirno_visually_impaired";
  var VALID_MODES = { auto: true, high: true, lite: true };
  var FPS_SAMPLE_MS = 1500;
  var FPS_DELAY_MS = 800;
  var FPS_THRESHOLD = 35;

  var root = doc.documentElement;
  var currentMode = "auto";
  var currentTier = "balanced";
  var a11yOverride = null;
  var fpsDowngraded = false;
  var fpsCheckStarted = false;
  var switcherBound = false;

  function readStorage(key) {
    try {
      return win.localStorage ? win.localStorage.getItem(key) : null;
    } catch (_) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      if (win.localStorage) {
        win.localStorage.setItem(key, value);
      }
    } catch (_) {}
  }

  function matchMediaSafe(query) {
    try {
      return Boolean(win.matchMedia && win.matchMedia(query).matches);
    } catch (_) {
      return false;
    }
  }

  function getSavedMode() {
    var raw = readStorage(MODE_STORAGE_KEY);
    return raw && VALID_MODES[raw] ? raw : "auto";
  }

  function isA11yEnabled() {
    if (a11yOverride !== null) return a11yOverride;
    if (doc.body && doc.body.classList.contains("visually-impaired")) {
      return true;
    }
    return readStorage(A11Y_STORAGE_KEY) === "true";
  }

  function detectAutoTier() {
    if (matchMediaSafe("(prefers-reduced-motion: reduce)")) {
      return "lite";
    }

    var nav = win.navigator || {};
    var conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (conn) {
      if (conn.saveData === true) return "lite";
      var eff = String(conn.effectiveType || "").toLowerCase();
      if (eff === "slow-2g" || eff === "2g") return "lite";
    }

    var mem = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 0;
    var cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 0;
    var ua = String(nav.userAgent || "");
    var isIos = /iP(hone|ad|od)/i.test(ua);
    var isCoarse = matchMediaSafe("(pointer: coarse)");
    var isMobile = isCoarse || /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(ua);

    if (mem > 0 && mem <= 2) return "lite";
    if (isMobile && !isIos && cores > 0 && cores <= 4) return "lite";
    if (isIos && cores > 0 && cores <= 2) return "lite";
    if (mem > 0 && mem <= 4) return "balanced";

    if (isMobile) {
      if (mem >= 6 && cores >= 8) {
        return fpsDowngraded ? "balanced" : "high";
      }
      return "balanced";
    }

    if (cores > 0 && cores <= 2) return "balanced";
    return fpsDowngraded ? "balanced" : "high";
  }

  function computeEffectiveTier(mode, a11yActive) {
    if (a11yActive) return "lite";
    if (mode === "lite") return "lite";
    if (mode === "high") return "high";
    return detectAutoTier();
  }

  function syncSwitcherUI(a11yActive) {
    var buttons = doc.querySelectorAll("[data-gfx-choice]");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var choice = btn.getAttribute("data-gfx-choice");
      var isSelected = !a11yActive && choice === currentMode;
      btn.classList.toggle("active", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
      btn.setAttribute("aria-disabled", String(a11yActive));
      btn.disabled = a11yActive;
    }

    var switcher = doc.getElementById("gfx-switcher");
    if (switcher) {
      switcher.setAttribute("data-effective-tier", currentTier);
      switcher.classList.toggle("is-a11y-locked", a11yActive);
    }
  }

  function dispatchChangeEvent(isUserAction, a11yActive) {
    var detail = {
      tier: currentTier,
      mode: currentMode,
      isA11y: a11yActive,
      isUserAction: Boolean(isUserAction)
    };
    try {
      if (typeof win.CustomEvent === "function") {
        win.dispatchEvent(new win.CustomEvent("yambirno:gfxchange", { detail: detail }));
      }
    } catch (_) {}
  }

  function applyState(isUserAction) {
    var a11yActive = isA11yEnabled();
    var nextTier = computeEffectiveTier(currentMode, a11yActive);
    var changed = nextTier !== currentTier || root.getAttribute("data-gfx-tier") !== nextTier;

    currentTier = nextTier;
    root.setAttribute("data-gfx-tier", currentTier);
    root.setAttribute("data-gfx-mode", currentMode);
    if (a11yActive) {
      root.setAttribute("data-gfx-a11y", "true");
    } else {
      root.removeAttribute("data-gfx-a11y");
    }

    syncSwitcherUI(a11yActive);
    if (changed || isUserAction) {
      dispatchChangeEvent(isUserAction, a11yActive);
    }
  }

  function setMode(nextMode, isUserAction) {
    var normalized = VALID_MODES[nextMode] ? nextMode : "auto";
    currentMode = normalized;
    if (normalized === "high") {
      fpsDowngraded = false;
      root.removeAttribute("data-gfx-fps-downgraded");
    }
    writeStorage(MODE_STORAGE_KEY, currentMode);
    applyState(Boolean(isUserAction));
  }

  function syncA11y(isEnabled) {
    a11yOverride = Boolean(isEnabled);
    applyState(false);
  }

  function bindSwitcherControls() {
    if (switcherBound) {
      syncSwitcherUI(isA11yEnabled());
      return;
    }
    var buttons = doc.querySelectorAll("[data-gfx-choice]");
    if (buttons.length === 0) return;

    switcherBound = true;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        if (isA11yEnabled()) return;
        var choice = this.getAttribute("data-gfx-choice") || "auto";
        setMode(choice, true);
      });
    }
    syncSwitcherUI(isA11yEnabled());
  }

  function runPassiveFpsSafeguard() {
    if (fpsCheckStarted) return;
    if (currentMode !== "auto" || currentTier !== "high" || isA11yEnabled()) return;
    if (typeof win.requestAnimationFrame !== "function") return;
    if (!win.performance || typeof win.performance.now !== "function") return;

    fpsCheckStarted = true;

    win.setTimeout(function () {
      if (doc.hidden || currentMode !== "auto" || currentTier !== "high" || isA11yEnabled()) {
        return;
      }

      var frames = 0;
      var startTs = 0;
      var aborted = false;

      var onVisibilityChange = function () {
        if (doc.hidden) {
          aborted = true;
        }
      };

      doc.addEventListener("visibilitychange", onVisibilityChange);

      var tick = function (now) {
        if (aborted || doc.hidden || currentMode !== "auto" || isA11yEnabled()) {
          doc.removeEventListener("visibilitychange", onVisibilityChange);
          return;
        }

        if (!startTs) {
          startTs = now;
        } else {
          frames += 1;
        }

        var elapsed = now - startTs;
        if (elapsed < FPS_SAMPLE_MS) {
          win.requestAnimationFrame(tick);
          return;
        }

        doc.removeEventListener("visibilitychange", onVisibilityChange);
        var fps = (frames * 1000) / Math.max(elapsed, 1);
        if (frames >= 5 && fps < FPS_THRESHOLD) {
          fpsDowngraded = true;
          root.setAttribute("data-gfx-fps-downgraded", "1");
          applyState(false);
        }
      };

      win.requestAnimationFrame(tick);
    }, FPS_DELAY_MS);
  }

  function bindEnvironmentListeners() {
    try {
      if (win.matchMedia) {
        var mq = win.matchMedia("(prefers-reduced-motion: reduce)");
        var onMotionChange = function () {
          if (currentMode === "auto") applyState(false);
        };
        if (typeof mq.addEventListener === "function") {
          mq.addEventListener("change", onMotionChange);
        } else if (typeof mq.addListener === "function") {
          mq.addListener(onMotionChange);
        }
      }
    } catch (_) {}

    try {
      var nav = win.navigator || {};
      var conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (conn && typeof conn.addEventListener === "function") {
        conn.addEventListener("change", function () {
          if (currentMode === "auto") applyState(false);
        });
      }
    } catch (_) {}
  }

  currentMode = getSavedMode();
  applyState(false);
  bindEnvironmentListeners();

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", function () {
      bindSwitcherControls();
      runPassiveFpsSafeguard();
    });
  } else {
    bindSwitcherControls();
    runPassiveFpsSafeguard();
  }

  win.YambirnoGfx = {
    getTier: function () {
      return currentTier;
    },
    getMode: function () {
      return currentMode;
    },
    isHigh: function () {
      return currentTier === "high";
    },
    isBalanced: function () {
      return currentTier === "balanced";
    },
    isLite: function () {
      return currentTier === "lite";
    },
    setMode: function (mode) {
      setMode(mode, true);
    },
    syncA11y: syncA11y,
    refresh: function () {
      applyState(false);
    },
    bindSwitcher: bindSwitcherControls
  };
})(window, document);
