(() => {
  const root = document.getElementById("dora-ep0-parallel");
  if (!root) return;

  const arms = [
    { name: "blue", color: "#4f7cff", text: "#ffffff", pulse: "rgba(79,124,255,0.28)" },
    { name: "green", color: "#2fb36e", text: "#ffffff", pulse: "rgba(47,179,110,0.28)" },
    { name: "red", color: "#ff6b5e", text: "#ffffff", pulse: "rgba(255,107,94,0.28)" },
    { name: "yellow", color: "#f6c445", text: "#111827", pulse: "rgba(246,196,69,0.30)" },
    { name: "purple", color: "#8b5cf6", text: "#ffffff", pulse: "rgba(139,92,246,0.28)" }
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
    run.cumulativeRewards = run.rewards.map((value) => {
      total += value;
      return total;
    });
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

    armsWrap.innerHTML = arms.map((arm, index) => `
      <div
        class="dora-ep0-arm ${index === bestArm ? "best" : ""}"
        data-arm="${index}"
        aria-hidden="true"
        style="background:${arm.color}; color:${arm.text}; --pulse:${arm.pulse};"
      >
        ${arm.name}
      </div>
    `).join("");

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
      const currentArm = run.actions[step];
      const reward = run.rewards[step];
      const refs = panelRefs[run.key];

      refs.armEls.forEach((el, index) => {
        const isActive = index === currentArm;
        el.classList.toggle("active", isActive);
        el.classList.toggle("inactive", !isActive);
        el.classList.remove("blink");
      });

      refs.totalEl.textContent = run.cumulativeRewards[step];
      refs.choiceEl.textContent = arms[currentArm].name;
      refs.rewardEl.textContent = reward ? "+1 reward" : "0 reward";
      refs.rewardEl.classList.toggle("win", Boolean(reward));
      refs.rewardEl.classList.toggle("loss", !reward);

      refs.rewardEl.classList.remove("pop");
      void refs.rewardEl.offsetWidth;
      refs.rewardEl.classList.add("pop");

      if (run.key === "llm") {
        const pulseEl = refs.armEls[currentArm];
        pulseEl.classList.remove("blink");
        void pulseEl.offsetWidth;
        pulseEl.classList.add("blink");
      }
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

  function updateSpeedReadout() {
    if (!speedReadout) return;
    const speedFactor = BASE_STEP_MS / stepMs;
    speedReadout.textContent = `${speedFactor.toFixed(1)}x`;
  }

  function scheduleNext(delay) {
    if (timer !== null) window.clearTimeout(timer);
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
      scheduleNext(stepMs);
    });
  }

  updateSpeedReadout();
  render(0);
  scheduleNext(stepMs);
})();
