/* ===== Scroll Fade-in Animation (inspired by TimeWarp) ===== */
(() => {
  const run = () => {
    const fadeEls = document.querySelectorAll(".fade-in");
    if (!fadeEls.length) return;

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Safety: always reveal after a short timeout in case the observer
    // never fires (e.g. elements inside a hidden ancestor).
    const revealAll = () => {
      fadeEls.forEach((el) => el.classList.add("is-visible"));
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      document.documentElement.classList.add("js-fade");
      revealAll();
      return;
    }

    // Activate hidden initial state only now that JS is ready.
    document.documentElement.classList.add("js-fade");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );

    fadeEls.forEach((el) => observer.observe(el));

    // Ultimate fallback: after 3s, force-reveal anything still hidden.
    window.setTimeout(revealAll, 3000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();

(() => {
  const root = document.getElementById("dora-ep0-parallel");
  if (!root) return;

  const arms = [
    { name: "blue",   color: "#4f7cff", text: "#ffffff" },
    { name: "green",  color: "#2fb36e", text: "#ffffff" },
    { name: "red",    color: "#ff6b5e", text: "#ffffff" },
    { name: "yellow", color: "#f6c445", text: "#111827" },
    { name: "purple", color: "#8b5cf6", text: "#ffffff" }
  ];

  const bestArm = 4;
  const runs = [
    {
      key: "dora",
      actions: [
        2, 0, 1, 1, 0, 0, 3, 0, 0, 2, 4, 0, 2, 3, 2, 1, 1, 4, 1, 0, 3, 4, 4, 4, 2,
        2, 3, 0, 3, 0, 2, 3, 2, 4, 3, 2, 2, 4, 4, 2, 4, 4, 4, 3, 1, 2, 3, 1, 4, 4,
        4, 4, 3, 2, 2, 2, 4, 2, 0, 2, 4, 2, 0, 4, 3, 2, 3, 4, 2, 3, 4, 3, 0, 2, 2,
        4, 2, 2, 2, 4, 4, 2, 2, 2, 4, 4, 3, 2, 4, 2, 4, 4, 4, 4, 2, 4, 4, 3, 3, 4,
        4, 4, 3, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
        4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4
      ],
      rewards: [
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0,
        1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1,
        0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1,
        1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1
      ]
    },
    {
      key: "llm",
      actions: Array(200).fill(0),
      rewards: [
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1,
        0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0,
        1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0,
        1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1,
        0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1,
        1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1
      ]
    }
  ];

  runs.forEach((run) => {
    let total = 0;
    run.cumulativeRewards = run.rewards.map((v) => (total += v));
  });

  const totalSteps = runs[0].actions.length;
  const stepValue = root.querySelector("[data-step-value]");
  const progressFill = root.querySelector(".dora-ep0-progress-fill");
  const speedSlider = root.querySelector("[data-speed-slider]");
  const speedReadout = root.querySelector("[data-speed-readout]");
  const panelRefs = {};

  runs.forEach((run) => {
    const panel = root.querySelector(`[data-run="${run.key}"]`);
    const armsWrap = panel.querySelector(".dora-ep0-arms");

    armsWrap.innerHTML = arms.map((arm, i) =>
      `<div class="dora-ep0-arm${i === bestArm ? " best" : ""}"
            data-arm="${i}"
            style="--arm-color:${arm.color}; --arm-text:${arm.text};
                   background:${arm.color}; color:${arm.text};
                   border-color:${arm.color};"
       >${arm.name}</div>`
    ).join("");

    panelRefs[run.key] = {
      armEls: Array.from(armsWrap.querySelectorAll(".dora-ep0-arm")),
      totalEl: panel.querySelector(".dora-ep0-total strong"),
      choiceEl: panel.querySelector(".dora-ep0-choice strong"),
      rewardEl: panel.querySelector(".dora-ep0-reward-pill")
    };
  });

  function render(step) {
    stepValue.textContent = step;
    progressFill.style.width = `${((step + 1) / totalSteps) * 100}%`;

    runs.forEach((run) => {
      const chosen = run.actions[step];
      const reward = run.rewards[step];
      const refs = panelRefs[run.key];

      refs.armEls.forEach((el, i) => {
        el.classList.toggle("pressed", i === chosen);
        el.classList.remove("blink");
      });
      const chosenEl = refs.armEls[chosen];
      void chosenEl.offsetWidth;
      chosenEl.classList.add("blink");

      refs.totalEl.textContent = run.cumulativeRewards[step];
      refs.choiceEl.textContent = arms[chosen].name;
      refs.rewardEl.textContent = reward ? "+1 reward" : "0 reward";
      refs.rewardEl.classList.toggle("win", Boolean(reward));
      refs.rewardEl.classList.toggle("loss", !reward);
    });
  }

  const MIN_STEP_MS = 90;
  const MAX_STEP_MS = 420;
  const DEFAULT_SLIDER_VALUE = 55;
  const RESET_MS = 1000;

  function sliderToStepMs(value) {
    const t = (Number(value) - 1) / 99;
    return Math.round(MAX_STEP_MS - t * (MAX_STEP_MS - MIN_STEP_MS));
  }

  const BASE_STEP_MS = sliderToStepMs(DEFAULT_SLIDER_VALUE);
  let stepMs = BASE_STEP_MS;
  let step = 1;
  let timer = null;
  let paused = false;
  const pauseBtn = root.querySelector("[data-mab-pause]");

  function updateSpeedReadout() {
    if (!speedReadout) return;
    speedReadout.textContent = `${(BASE_STEP_MS / stepMs).toFixed(1)}x`;
  }

  function scheduleNext(delay) {
    if (timer !== null) window.clearTimeout(timer);
    if (paused) return;
    timer = window.setTimeout(tick, delay);
  }

  function tick() {
    render(step);
    step += 1;
    if (step >= totalSteps) {
      step = 0;
      scheduleNext(RESET_MS);
    } else {
      scheduleNext(stepMs);
    }
  }

  if (speedSlider) {
    speedSlider.value = DEFAULT_SLIDER_VALUE;
    speedSlider.addEventListener("input", () => {
      stepMs = sliderToStepMs(speedSlider.value);
      updateSpeedReadout();
      if (!paused) scheduleNext(stepMs);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.textContent = paused ? "\u25B6" : "\u23F8";
      pauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
      if (!paused) scheduleNext(stepMs);
    });
  }

  updateSpeedReadout();
  render(0);
  scheduleNext(stepMs);
})();
