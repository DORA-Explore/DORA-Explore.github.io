(() => {
  const root = document.getElementById("tales-chat-anim");
  if (!root) return;

  const doraSteps = [
    { action: "examine shelf", feedback: "The shelf is unstable.", score: 0, pathway: "explore", room: "Pantry" },
    { action: "open door", feedback: "You open frosted-glass door.", score: 0, pathway: "greedy", room: null },
    { action: "go south", feedback: "You arrive in a kitchen. You can make out a fridge, an oven, a table with a cookbook, a counter, and a stove.", score: 0, pathway: "greedy", room: "Kitchen" },
    { action: "examine oven", feedback: "Useful for roasting things.", score: 0, pathway: "explore", room: null },
    { action: "open oven", feedback: "You open the oven.", score: 0, pathway: "greedy", room: null },
    { action: "look in oven", feedback: "The oven is empty.", score: 0, pathway: "greedy", room: null },
    { action: "examine fridge", feedback: "The fridge looks noble. You can\u2019t see inside it because the lid\u2019s in your way.", score: 0, pathway: "greedy", room: null },
    { action: "open fridge", feedback: "You open the fridge, revealing a fried block of cheese and a cilantro.", score: 0, pathway: "greedy", room: null },
    { action: "take cheese", feedback: "You take the block of cheese from the fridge.\n+1 point!", score: 1, pathway: "greedy", room: null },
    { action: "take cilantro", feedback: "You take the cilantro from the fridge.", score: 1, pathway: "greedy", room: null },
    { action: "look in cookbook", feedback: "You find nothing of interest.", score: 1, pathway: "greedy", room: null },
    { action: "help", feedback: "Available commands: look, goal, inventory, go, examine, eat, open, close, take, put, cook, prepare meal\u2026", score: 1, pathway: "greedy", room: null },
    { action: "inventory", feedback: "You are carrying: a cilantro, a fried block of cheese.", score: 1, pathway: "greedy", room: null },
    { action: "prepare meal", feedback: "Adding the meal to your inventory.\n+1 point!", score: 2, pathway: "greedy", room: null },
    { action: "eat meal", feedback: "You eat the meal. Not bad.\n+1 point!\n\u2605 The End \u2605 \u2014 You scored 3 out of 3!", score: 3, pathway: "greedy", room: null }
  ];

  const zsMessages = [
    { type: "step", action: "look shelf", feedback: "The shelf is unstable.", score: 0, room: "Pantry" },
    { type: "step", action: "look shelf", feedback: "The shelf is unstable.", score: 0, room: null },
    { type: "step", action: "look shelf", feedback: "The shelf is unstable.", score: 0, room: null },
    { type: "step", action: "push shelf", feedback: "It is fixed in place.", score: 0, room: null },
    { type: "step", action: "look shelf", feedback: "The shelf is unstable.", score: 0, room: null },
    { type: "step", action: "look shelf", feedback: "The shelf is unstable.", score: 0, room: null },
    { type: "loop", action: "look shelf", feedback: "The shelf is unstable.", count: 11, score: 0 },
    { type: "step", action: "look shelfdetail", feedback: "You can\u2019t see any such thing.", score: 0, room: null },
    { type: "step", action: "look shelfdetail", feedback: "You can\u2019t see any such thing.", score: 0, room: null },
    { type: "step", action: "look shelfdetail translationclassic", feedback: "You can\u2019t see any such thing.", score: 0, room: null },
    { type: "loop", action: "look shelfdetail translationclassic", feedback: "You can\u2019t see any such thing.", count: 80, score: 0 },
    { type: "end", score: 0 }
  ];

  const doraMessages = doraSteps.map(s => ({ type: "step", ...s }));
  doraMessages.push({ type: "end", score: 3 });

  const totalVisual = Math.max(doraMessages.length, zsMessages.length);

  const stepEl = root.querySelector("[data-tales-step]");
  const progressFill = root.querySelector(".tales-progress-fill");
  const speedSlider = root.querySelector("[data-tales-speed]");
  const speedReadout = root.querySelector("[data-tales-speed-readout]");

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

  function renderStepMsg(msg, isZeroshot) {
    const frag = document.createDocumentFragment();
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

    frag.appendChild(wrapper);
    return frag;
  }

  function renderLoop(msg) {
    const el = document.createElement("div");
    el.className = "tales-loop";
    el.textContent = `\u21BB "${msg.action}" repeated \u00D7${msg.count}`;
    return el;
  }

  function renderEnd(msg, key) {
    const ref = panels[key];
    if (msg.score >= 3) {
      ref.banner.className = "tales-banner win";
      ref.banner.textContent = "\u2713 Task Complete \u2014 3/3";
    } else {
      ref.banner.className = "tales-banner fail";
      ref.banner.textContent = "\u2717 Stuck in Loop \u2014 0/3";
    }
  }

  function showMsg(key, msgs, idx) {
    if (idx >= msgs.length) return;
    const msg = msgs[idx];
    const ref = panels[key];

    if (msg.room) {
      ref.roomEl.textContent = msg.room;
    }

    if (msg.type === "step") {
      ref.chat.appendChild(renderStepMsg(msg, key === "zeroshot"));
      const prevScore = idx > 0 ? msgs[idx - 1].score : 0;
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

  function updateSpeed() {
    if (!speedReadout) return;
    speedReadout.textContent = `${(BASE_MS / intervalMs).toFixed(1)}x`;
  }

  function schedule(delay) {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(tick, delay);
  }

  function tick() {
    if (currentIdx >= totalVisual) {
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
      schedule(intervalMs);
    });
  }

  updateSpeed();
  schedule(intervalMs);
})();
