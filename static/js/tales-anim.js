(() => {
  const root = document.getElementById("tales-chat-anim");
  if (!root) return;

  const TASK_DESC = "You are hungry! Let\u2019s cook a delicious meal. Check the cookbook in the kitchen for the recipe. Once done, enjoy your meal!";
  const MAX_SCORE = 3;

  const doraSteps = [
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, pathway: "explore", room: "Shed" },
    { action: "examine toolbox", feedback: "The toolbox looks manageable. You can't see inside it because the lid's in your way.", score: 0, pathway: "explore", room: null },
    { action: "open toolbox", feedback: "You open the toolbox.", score: 0, pathway: "explore", room: null },
    { action: "look inside", feedback: "You see nothing unexpected in that direction.", score: 0, pathway: "greedy", room: null },
    { action: "search toolbox", feedback: "The toolbox is empty.", score: 0, pathway: "greedy", room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, pathway: "explore", room: null },
    { action: "open barn door", feedback: "You open barn door.", score: 0, pathway: "explore", room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, pathway: "explore", room: null },
    { action: "examine BBQ", feedback: "Useful for grilling things.", score: 0, pathway: "greedy", room: "Backyard" },
    { action: "open patio door", feedback: "You open patio door.", score: 0, pathway: "explore", room: null },
    { action: "go south", feedback: "[Corridor] You've come into an ordinary room. Your mind races to think of what kind of room would be ordinary", score: 0, pathway: "greedy", room: null },
    { action: "go south", feedback: "[Bathroom] Well, here we are in a bathroom. You begin looking for stuff.\n\nYou can see a toilet", score: 0, pathway: "greedy", room: "Corridor" },
    { action: "examine toilet", feedback: "The toilet is stable.", score: 0, pathway: "greedy", room: "Bathroom" },
    { action: "search bathroom", feedback: "You can't see any such thing.", score: 0, pathway: "greedy", room: null },
    { action: "go north", feedback: "[Corridor] You've come into an ordinary room. Your mind races to think of what kind of room would be ordinary", score: 0, pathway: "greedy", room: null },
    { action: "go west", feedback: "[Bedroom] You find yourself in a bedroom.\n\nYou can see a bed. But the thing is empty, unfortunately.\n\nYou need an exit without a d...", score: 0, pathway: "greedy", room: "Corridor" },
    { action: "examine bed", feedback: "The bed is undependable.", score: 0, pathway: "greedy", room: "Bedroom" },
    { action: "go south", feedback: "[Livingroom] You are in a livingroom. A standard kind of place.\n\nYou can see a sofa", score: 0, pathway: "greedy", room: null },
    { action: "examine sofa", feedback: "The sofa is shaky.", score: 0, pathway: "greedy", room: "Livingroom" },
    { action: "go north", feedback: "[Bedroom] You find yourself in a bedroom.\n\nYou can see a bed. But the thing is empty, unfortunately.\n\nYou need an exit without a d...", score: 0, pathway: "greedy", room: null },
    { action: "go east", feedback: "[Corridor] You've come into an ordinary room. Your mind races to think of what kind of room would be ordinary", score: 0, pathway: "greedy", room: "Bedroom" },
    { action: "go west", feedback: "[Bedroom] You find yourself in a bedroom.\n\nYou can see a bed. But the thing is empty, unfortunately.\n\nYou need an exit without a d...", score: 0, pathway: "greedy", room: "Corridor" },
    { action: "go south", feedback: "[Livingroom] You are in a livingroom. A standard kind of place.\n\nYou can see a sofa", score: 0, pathway: "greedy", room: "Bedroom" },
    { action: "go west", feedback: "[Kitchen] You've entered a kitchen. The room seems oddly familiar, as though it were only superficially different from the other r...", score: 0, pathway: "greedy", room: "Livingroom" },
    { action: "examine cookbook", feedback: "You open the copy of \"Cooking: A Modern Approach (3rd Ed.)\" and start reading:\n\nRecipe #1\n---------\nGather all following ingredients and follow the directions to prepare this tasty...", score: 0, pathway: "greedy", room: "Kitchen" },
    { action: "get block of cheese", feedback: "You can't see any such thing.", score: 0, pathway: "greedy", room: null },
    { action: "examine oven", feedback: "Useful for roasting things.", score: 0, pathway: "explore", room: null },
    { action: "open oven", feedback: "You open the oven.", score: 0, pathway: "greedy", room: null },
    { action: "look inside", feedback: "You see nothing unexpected in that direction.", score: 0, pathway: "greedy", room: null },
    { action: "search oven", feedback: "The oven is empty.", score: 0, pathway: "greedy", room: null },
    { action: "examine stove", feedback: "Useful for frying things.", score: 0, pathway: "greedy", room: null },
    { action: "search stove", feedback: "There is nothing on the stove.", score: 0, pathway: "greedy", room: null },
    { action: "go north", feedback: "You have to open the frosted-glass door first.", score: 0, pathway: "greedy", room: null },
    { action: "open frosted-glass door", feedback: "You open frosted-glass door.", score: 0, pathway: "greedy", room: null },
    { action: "go north", feedback: "[Pantry] You're now in the pantry.\n\nYou make out a shelf. On the shelf you can make out a salt", score: 0, pathway: "greedy", room: null },
    { action: "take salt", feedback: "You take the salt from the shelf.", score: 0, pathway: "greedy", room: "Pantry" },
    { action: "go south", feedback: "[Kitchen] You've entered a kitchen. The room seems oddly familiar, as though it were only superficially different from the other r...", score: 0, pathway: "greedy", room: null },
    { action: "cook with salt", feedback: "You can't see any such thing.", score: 0, pathway: "greedy", room: "Kitchen" },
    { action: "examine stove", feedback: "Useful for frying things.", score: 0, pathway: "greedy", room: null },
    { action: "light stove", feedback: "This dangerous act would achieve little.", score: 0, pathway: "greedy", room: null },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, pathway: "greedy", room: null },
    { action: "cook block of cheese with stove", feedback: "You can't see any such thing.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal", feedback: "You still miss something.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal with salt", feedback: "I didn't understand that sentence.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal with block of cheese", feedback: "I didn't understand that sentence.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal", feedback: "You still miss something.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal with salt and block of cheese", feedback: "I didn't understand that sentence.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal with salt and cheese", feedback: "I didn't understand that sentence.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal", feedback: "You still miss something.", score: 0, pathway: "greedy", room: null },
    { action: "prepare meal with salt", feedback: "I didn't understand that sentence.", score: 0, pathway: "greedy", room: null },
    { action: "cook block of cheese with stove", feedback: "You can't see any such thing.", score: 0, pathway: "greedy", room: null },
    { action: "open fridge", feedback: "You open the fridge, revealing a block of cheese.", score: 0, pathway: "explore", room: null },
    { action: "take block of cheese", feedback: "You take the block of cheese from the fridge.\\n+1 point!", score: 1, pathway: "greedy", room: null },
    { action: "prepare meal", feedback: "Adding the meal to your inventory.\\n+1 point!", score: 2, pathway: "greedy", room: null },
    { action: "inventory", feedback: "You are carrying:\n  a meal\n  a salt", score: 2, pathway: "greedy", room: null },
    { action: "eat meal", feedback: "You eat the meal. Not bad.\\n+1 point!", score: 3, pathway: "greedy", room: null },
  ];

  const zsSteps = [
    { action: "open wall", feedback: "You can't see any such thing.", score: 0, room: "Shed" },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "examine wall", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "examine toolbox", feedback: "The toolbox looks manageable. You can't see inside it because the lid's in your way.", score: 0, room: null },
    { action: "open toolbox", feedback: "You open the toolbox.", score: 0, room: null },
    { action: "look inside", feedback: "You see nothing unexpected in that direction.", score: 0, room: null },
    { action: "search toolbox", feedback: "The toolbox is empty.", score: 0, room: null },
    { action: "search shed", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "search workbench", feedback: "There is nothing on the workbench.", score: 0, room: null },
    { action: "check workbench drawers", feedback: "I only understood you as far as wanting to check the workbench.", score: 0, room: null },
    { action: "check workbench", feedback: "The workbench is undependable.", score: 0, room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: null },
    { action: "look south", feedback: "You see nothing unexpected in that direction.", score: 0, room: null },
    { action: "examine barn door", feedback: "It is what it is, a barn door. You can't see inside it because the lid's in your way.", score: 0, room: null },
    { action: "open barn door", feedback: "You open barn door.", score: 0, room: null },
    { action: "look inside", feedback: "You see nothing unexpected in that direction.", score: 0, room: null },
    { action: "search barn", feedback: "You find nothing of interest.", score: 0, room: null },
    { action: "go inside", feedback: "You can't go that way.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "examine BBQ", feedback: "Useful for grilling things.", score: 0, room: "Backyard" },
    { action: "check cookbook", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go inside house", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "look for cookbook", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "search patio", feedback: "Which do you mean, patio door, the patio chair or the patio table?", score: 0, room: null },
    { action: "search patio table", feedback: "There is nothing on the patio table.", score: 0, room: null },
    { action: "search patio chair", feedback: "There is nothing on the patio chair.", score: 0, room: null },
    { action: "search BBQ", feedback: "You can't see inside, since the BBQ is closed.", score: 0, room: null },
    { action: "open BBQ", feedback: "You open the BBQ.", score: 0, room: null },
    { action: "search BBQ", feedback: "The BBQ is empty.", score: 0, room: null },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, room: null },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: null },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, room: null },
    { action: "prepare meal", feedback: "Can only prepare meal in the -= Kitchen =-.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: "Kitchen" },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: "Shed" },
    { action: "go west", feedback: "-= Garden =-\nYou arrive in a garden. A standard kind of place.\n\n\n\nThere is an exit to the east.", score: 0, room: "Backyard" },
    { action: "go east", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: "Garden" },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: "Backyard" },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
    { action: "examine workbench again", feedback: "I only understood you as far as wanting to examine the workbench.", score: 0, room: null },
    { action: "check workbench", feedback: "The workbench is undependable.", score: 0, room: null },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "examine BBQ", feedback: "Useful for grilling things.", score: 0, room: "Backyard" },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: null },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, room: null },
    { action: "prepare meal", feedback: "Can only prepare meal in the -= Kitchen =-.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: "Kitchen" },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: "Shed" },
    { action: "go west", feedback: "-= Garden =-\nYou arrive in a garden. A standard kind of place.\n\n\n\nThere is an exit to the east.", score: 0, room: "Backyard" },
    { action: "go east", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: "Garden" },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: "Backyard" },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
    { action: "examine workbench again", feedback: "I only understood you as far as wanting to examine the workbench.", score: 0, room: null },
    { action: "check workbench", feedback: "The workbench is undependable.", score: 0, room: null },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: "Backyard" },
    { action: "look for cookbook", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "examine BBQ", feedback: "Useful for grilling things.", score: 0, room: "Backyard" },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: null },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, room: null },
    { action: "cook meal", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "go west", feedback: "-= Garden =-\nYou arrive in a garden. A standard kind of place.\n\n\n\nThere is an exit to the east.", score: 0, room: "Backyard" },
    { action: "go east", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: "Garden" },
    { action: "examine BBQ", feedback: "Useful for grilling things.", score: 0, room: "Backyard" },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: null },
    { action: "look for cookbook", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, room: null },
    { action: "cook meal", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go north", feedback: "You can't go that way.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "examine BBQ", feedback: "Useful for grilling things.", score: 0, room: "Backyard" },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: null },
    { action: "look for cookbook", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go west", feedback: "-= Garden =-\nYou arrive in a garden. A standard kind of place.\n\n\n\nThere is an exit to the east.", score: 0, room: null },
    { action: "go east", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: "Garden" },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: "Backyard" },
    { action: "help", feedback: "Available commands:\n  look:                describe the current room\n  goal:                print the goal of this game\n  inventory:           print player's inventory\n  go <dir>: ...", score: 0, room: null },
    { action: "cook meal", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
    { action: "look around", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go south", feedback: "[Backyard] You are in a backyard. An usual kind of place.\n\nYou can make out a patio chair", score: 0, room: null },
    { action: "cook", feedback: "What do you want to cook?", score: 0, room: "Backyard" },
    { action: "look for cookbook", feedback: "You can't see any such thing.", score: 0, room: null },
    { action: "go north", feedback: "[Shed] Ah, the shed. This is some kind of shed, really great standard vibes in this place, a wonderful standard atmosphere", score: 0, room: null },
    { action: "examine workbench", feedback: "The workbench is undependable.", score: 0, room: "Shed" },
  ];

  const doraMessages = [{ type: "task" }].concat(
    doraSteps.map(s => ({ type: "step", ...s })),
    [{ type: "end", score: MAX_SCORE }]
  );

  const zsMessages = [{ type: "task" }].concat(
    zsSteps.map(s => ({ type: "step", ...s })),
    [{ type: "end", score: 0 }]
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
    panels.dora.roomEl.textContent = "Shed";
    panels.zeroshot.roomEl.textContent = "Shed";
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
