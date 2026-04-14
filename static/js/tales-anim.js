(() => {
  const root = document.getElementById("tales-chat-anim");
  if (!root) return;

  const TASK_DESC = "You are hungry! Let\u2019s cook a delicious meal. Check the cookbook in the kitchen for the recipe. Once done, enjoy your meal!";
  const MAX_SCORE = 5;

  const doraSteps = [
    { action: "look shelf", feedback: "The shelf is unstable.", score: 0, pathway: "greedy", room: "Pantry" },
    { action: "examine shelf", feedback: "The shelf is unstable.", score: 0, pathway: "explore", room: null },
    { action: "check door", feedback: "It is what it is, a frosted-glass door. You can\u2019t see inside it because the lid\u2019s in your way.", score: 0, pathway: "greedy", room: null },
    { action: "open door", feedback: "You open frosted-glass door.", score: 0, pathway: "greedy", room: null },
    { action: "go south", feedback: "You arrive in a kitchen with a fridge, oven, table with a cookbook, counter, and stove.", score: 0, pathway: "greedy", room: "Kitchen" },
    { action: "take cookbook", feedback: "You take the cookbook from the table.", score: 0, pathway: "greedy", room: null },
    { action: "read cookbook", feedback: "Recipe #1: Gather banana, block of cheese, purple potato. Directions: dice the banana, fry the block of cheese, slice the purple potato, prepare meal.", score: 0, pathway: "greedy", room: null },
    { action: "go east", feedback: "You are in a livingroom with a sofa.", score: 0, pathway: "explore", room: "Livingroom" },
    { action: "go west", feedback: "Back in the kitchen.", score: 0, pathway: "explore", room: "Kitchen" },
    { action: "look counter", feedback: "On the counter are a sliced fried purple potato, a diced roasted banana and a raw yellow potato.", score: 0, pathway: "greedy", room: null },
    { action: "open fridge", feedback: "You open the fridge, revealing a diced fried block of cheese.", score: 0, pathway: "explore", room: null },
    { action: "take block of cheese", feedback: "You take the block of cheese from the fridge.\n+1 point!", score: 1, pathway: "greedy", room: null },
    { action: "take purple potato", feedback: "You take the purple potato from the counter.\n+1 point!", score: 2, pathway: "greedy", room: null },
    { action: "take diced roasted banana", feedback: "You take the banana from the counter.\n+1 point!", score: 3, pathway: "greedy", room: null },
    { action: "prepare meal", feedback: "Adding the meal to your inventory.\n+1 point!", score: 4, pathway: "greedy", room: null },
    { action: "eat meal", feedback: "You eat the meal. Not bad.\n+1 point!\n\u2605 The End \u2605 \u2014 You scored 5 out of 5!", score: 5, pathway: "greedy", room: null }
  ];

  const zsMessages = [
    { type: "task" },
    { type: "step", action: "look shelf", feedback: "The shelf is unstable.", score: 0, room: "Pantry" },
    { type: "step", action: "open door", feedback: "You open frosted-glass door.", score: 0, room: null },
    { type: "step", action: "go south", feedback: "You arrive in a kitchen with a fridge, oven, table, counter, and stove.", score: 0, room: "Kitchen" },
    { type: "step", action: "take cookbook", feedback: "You take the cookbook from the table.", score: 0, room: null },
    { type: "step", action: "go east", feedback: "You are in a livingroom with a sofa.", score: 0, room: "Livingroom" },
    { type: "step", action: "go west", feedback: "Back in the kitchen.", score: 0, room: "Kitchen" },
    { type: "step", action: "go east", feedback: "Back to the livingroom.", score: 0, room: "Livingroom" },
    { type: "step", action: "go north", feedback: "You arrive in a bedroom.", score: 0, room: "Bedroom" },
    { type: "step", action: "go south", feedback: "Back to the livingroom.", score: 0, room: "Livingroom" },
    { type: "step", action: "sit on sofa", feedback: "That\u2019s not something you can sit down on.", score: 0, room: null },
    { type: "step", action: "check cookbook", feedback: "Recipe #1: banana, block of cheese, purple potato.", score: 0, room: null },
    { type: "step", action: "gather banana block of cheese purple potato", feedback: "That\u2019s not a verb I recognise.", score: 0, room: null },
    { type: "step", action: "take banana block of cheese purple potato", feedback: "You can\u2019t see any such thing.", score: 0, room: null },
    { type: "step", action: "look inside fridge", feedback: "You can\u2019t see any such thing.", score: 0, room: null },
    { type: "step", action: "open fridge", feedback: "You can\u2019t see any such thing.", score: 0, room: null },
    { type: "step", action: "check inside fridge", feedback: "I only understood you as far as wanting to check inside.", score: 0, room: null },
    { type: "loop", action: "open fridge / look inside fridge / check inside fridge / inspect fridge", feedback: "Cycles through invalid fridge commands\u2026 none succeed.", count: 66, score: 0 },
    { type: "end", score: 0 }
  ];

  const doraMessages = [{ type: "task" }].concat(
    doraSteps.map(s => ({ type: "step", ...s })),
    [{ type: "end", score: MAX_SCORE }]
  );

  const totalVisual = Math.max(doraMessages.length, zsMessages.length);

  const stepEl = root.querySelector("[data-tales-step]");
  const progressFill = root.querySelector(".tales-progress-fill");
  const speedSlider = root.querySelector("[data-tales-speed]");
  const speedReadout = root.querySelector("[data-tales-speed-readout]");
  const pauseBtn = root.querySelector("[data-tales-pause]");

  const panels = {};
  ["dora", "zeroshot"].forEach(key => {
    const panel = root.querySelector(`[data-tales-run="${key}"]`);
    panels[key] = {
      panel,
      scoreEl: panel.querySelector(".tales-score"),
      scoreNum: panel.querySelector(".tales-score strong"),
      roomEl: panel.querySelector("[data-tales-room]"),
      chat: panel.querySelector(".tales-chat"),
      chatScroll: panel.querySelector(".tales-chat-scroll"),
      banner: panel.querySelector(".tales-banner")
    };
  });

  function escHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function renderTask() {
    const el = document.createElement("div");
    el.className = "tales-task-msg";
    el.innerHTML = `<span class="tales-task-icon">\uD83C\uDF73</span> <strong>Task:</strong> ${escHtml(TASK_DESC)}`;
    return el;
  }

  function renderStepMsg(msg, isZeroshot) {
    const wrapper = document.createElement("div");
    wrapper.className = "tales-msg";

    const actionBub = document.createElement("div");
    if (isZeroshot) {
      actionBub.className = "tales-action zeroshot";
      actionBub.innerHTML = escHtml(msg.action);
    } else {
      const pw = msg.pathway || "greedy";
      actionBub.className = `tales-action ${pw}`;
      const badgeLabel = pw === "explore" ? "Explore" : "Greedy";
      actionBub.innerHTML =
        `<span class="tales-badge ${pw}">${badgeLabel}</span>${escHtml(msg.action)}`;
    }
    wrapper.appendChild(actionBub);

    const fbBub = document.createElement("div");
    const isScoreUp = msg.feedback && (msg.feedback.includes("+1") || msg.feedback.includes("The End"));
    fbBub.className = "tales-feedback" + (isScoreUp ? " score-up" : "");
    fbBub.innerHTML = escHtml(msg.feedback).replace(/\n/g, "<br>");
    wrapper.appendChild(fbBub);

    return wrapper;
  }

  function renderLoop(msg) {
    const el = document.createElement("div");
    el.className = "tales-loop";
    el.innerHTML = `<span class="tales-loop-icon">\u21BB</span> <strong>${escHtml(msg.action)}</strong><br>repeated \u00D7${msg.count} \u2014 ${escHtml(msg.feedback)}`;
    return el;
  }

  function renderEnd(msg, key) {
    const ref = panels[key];
    if (msg.score >= MAX_SCORE) {
      ref.banner.className = "tales-banner win";
      ref.banner.textContent = `\u2713 Task Complete \u2014 ${MAX_SCORE}/${MAX_SCORE}`;
    } else {
      ref.banner.className = "tales-banner fail";
      ref.banner.textContent = `\u2717 Stuck in Loop \u2014 0/${MAX_SCORE}`;
    }
  }

  function showMsg(key, msgs, idx) {
    if (idx >= msgs.length) return;
    const msg = msgs[idx];
    const ref = panels[key];

    if (msg.room) ref.roomEl.textContent = msg.room;

    if (msg.type === "task") {
      ref.chat.appendChild(renderTask());
    } else if (msg.type === "step") {
      ref.chat.appendChild(renderStepMsg(msg, key === "zeroshot"));
      const prevScore = idx > 0 ? (msgs[idx - 1].score || 0) : 0;
      if (msg.score > prevScore) {
        ref.scoreNum.textContent = msg.score;
        ref.scoreEl.classList.add("scored", "flash");
        setTimeout(() => ref.scoreEl.classList.remove("flash"), 450);
      }
    } else if (msg.type === "loop") {
      ref.chat.appendChild(renderLoop(msg));
    } else if (msg.type === "end") {
      renderEnd(msg, key);
    }

    ref.chatScroll.scrollTop = ref.chatScroll.scrollHeight;
  }

  const MIN_MS = 400;
  const MAX_MS = 2200;
  const DEFAULT_VAL = 40;

  function sliderToMs(v) {
    const t = (Number(v) - 1) / 99;
    return Math.round(MAX_MS - t * (MAX_MS - MIN_MS));
  }

  const BASE_MS = sliderToMs(DEFAULT_VAL);
  let intervalMs = BASE_MS;
  let currentIdx = 0;
  let timer = null;
  let paused = false;

  function updateSpeed() {
    if (!speedReadout) return;
    speedReadout.textContent = `${(BASE_MS / intervalMs).toFixed(1)}x`;
  }

  function schedule(delay) {
    if (timer !== null) clearTimeout(timer);
    if (paused) return;
    timer = setTimeout(tick, delay);
  }

  function resetState() {
    currentIdx = 0;
    panels.dora.chat.innerHTML = "";
    panels.zeroshot.chat.innerHTML = "";
    panels.dora.banner.className = "tales-banner";
    panels.zeroshot.banner.className = "tales-banner";
    panels.dora.scoreNum.textContent = "0";
    panels.zeroshot.scoreNum.textContent = "0";
    panels.dora.scoreEl.classList.remove("scored");
    panels.zeroshot.scoreEl.classList.remove("scored");
    panels.dora.roomEl.textContent = "Pantry";
    panels.zeroshot.roomEl.textContent = "Pantry";
  }

  function tick() {
    if (currentIdx >= totalVisual) {
      resetState();
      schedule(1200);
      return;
    }

    stepEl.textContent = currentIdx + 1;
    progressFill.style.width = `${((currentIdx + 1) / totalVisual) * 100}%`;

    showMsg("dora", doraMessages, currentIdx);
    showMsg("zeroshot", zsMessages, currentIdx);

    currentIdx++;
    schedule(intervalMs);
  }

  if (speedSlider) {
    speedSlider.value = DEFAULT_VAL;
    speedSlider.addEventListener("input", () => {
      intervalMs = sliderToMs(speedSlider.value);
      updateSpeed();
      if (!paused) schedule(intervalMs);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      paused = !paused;
      pauseBtn.textContent = paused ? "\u25B6" : "\u23F8";
      pauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
      if (!paused) schedule(intervalMs);
    });
  }

  updateSpeed();
  schedule(intervalMs);
})();
