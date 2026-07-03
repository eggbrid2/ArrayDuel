const ELEMENTS = ["wood", "fire", "earth", "water", "core", "metal"];
const FIVE = ["wood", "fire", "earth", "metal", "water"];
const LABEL = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水", core: "中" };
const COLOR = { wood: "#3f8a57", fire: "#c94c31", earth: "#9a7a3f", metal: "#7d8790", water: "#327aa1", core: "#5a4a84" };
const TYPE = { attack: "攻击", defense: "防守", heal: "恢复", counter: "反击", destroy: "销毁", ongoing: "永续", eye: "阵眼" };
const TYPE_MARK = { attack: "攻", defense: "防", heal: "回", counter: "反", destroy: "毁", ongoing: "续", eye: "阵" };
const CONTROLS = {
  wood: ["wood", "earth", "water"],
  fire: ["fire", "metal", "wood"],
  earth: ["earth", "water", "fire"],
  metal: ["metal", "wood", "earth"],
  water: ["water", "fire", "metal"],
};
const OVERCOME = { wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire" };
const GENERATES = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const AI_CONFIG_KEY = "arrayDuelAiConfig";
const DEFAULT_AI_CONFIG = {
  enabled: true,
  baseUrl: "./ai-proxy.php",
  apiKey: "",
  model: "gpt-5.5",
};

const cardPool = {
  wood: [
    { name: "青藤剑诀", type: "attack", value: 2, text: "攻击木、土、水目标。克制灵力 x2。" },
    { name: "万木穿岩", type: "attack", value: 1, text: "攻击永续时灵力相减。" },
    { name: "灵藤护身", type: "defense", value: 2, text: "抵消 2 点伤害。" },
    { name: "春生术", type: "heal", value: 2, text: "触发时回复 2 生命。" },
    { name: "青藤反缚", type: "counter", value: 1, text: "抵消 1，并反击 1。" },
    { name: "斩根符", type: "destroy", value: 2, text: "破坏永续、压阵或阵眼。" },
    { name: "青木灵泉", type: "ongoing", value: 4, text: "准备阶段回复 1。" },
  ],
  fire: [
    { name: "赤霄火剑", type: "attack", value: 2, text: "攻击火、金、木目标。克制灵力 x2。" },
    { name: "流火飞星", type: "attack", value: 1, text: "中台发动可攻击任意五行槽。" },
    { name: "烈焰护体", type: "defense", value: 1, text: "抵消 1，并可反击。" },
    { name: "丹火续脉", type: "heal", value: 2, text: "触发时回复 2。" },
    { name: "火鸦返击", type: "counter", value: 2, text: "反击 2。" },
    { name: "离火破金符", type: "destroy", value: 3, text: "破坏金系永续更强。" },
    { name: "离火炼炉", type: "ongoing", value: 4, text: "发动火卡时灼伤 1。" },
  ],
  earth: [
    { name: "镇岳印", type: "attack", value: 2, text: "攻击土、水、火目标。克制灵力 x2。" },
    { name: "昆仑坠", type: "attack", value: 3, text: "高灵力攻击。" },
    { name: "玄岩盾", type: "defense", value: 2, text: "抵消 2 点伤害。" },
    { name: "地脉回息", type: "heal", value: 1, text: "回复 1，补灵 1。" },
    { name: "崩山反震", type: "counter", value: 1, text: "抵消 1，反击 1。" },
    { name: "崩山符", type: "destroy", value: 2, text: "破坏永续或压阵。" },
    { name: "厚土归元阵", type: "ongoing", value: 5, text: "中台受伤 -1。" },
  ],
  metal: [
    { name: "庚金飞刃", type: "attack", value: 2, text: "攻击金、木、土目标。克制灵力 x2。" },
    { name: "破甲剑光", type: "attack", value: 1, text: "无视 1 点防御。" },
    { name: "金钟罩", type: "defense", value: 2, text: "抵消 2。" },
    { name: "玉液金丹", type: "heal", value: 2, text: "回复 2 生命。" },
    { name: "镜刃反照", type: "counter", value: 1, text: "抵消 1，复制反击。" },
    { name: "裂器符", type: "destroy", value: 2, text: "破坏永续或压阵。" },
    { name: "庚金剑阵", type: "ongoing", value: 4, text: "金攻击首次 +1。" },
  ],
  water: [
    { name: "寒泉剑气", type: "attack", value: 2, text: "攻击水、火、金目标。克制灵力 x2。" },
    { name: "冰魄飞针", type: "attack", value: 1, text: "对火克制更强。" },
    { name: "水镜术", type: "defense", value: 1, text: "抵消 1，并回复 1。" },
    { name: "甘霖诀", type: "heal", value: 2, text: "回复 2 生命。" },
    { name: "寒潭倒影", type: "counter", value: 1, text: "抵消 1，反击 1。" },
    { name: "玄水灭火符", type: "destroy", value: 3, text: "破坏火系永续更强。" },
    { name: "寒潭灵脉", type: "ongoing", value: 4, text: "准备阶段为永续补灵 1。" },
  ],
};

const eyePool = [
  { name: "太极玄门", element: "fire", type: "eye", value: 0, text: "中台攻击非五行目标 +1。" },
  { name: "五气朝元", element: "wood", type: "eye", value: 0, text: "五槽齐备回复 1。" },
  { name: "太白剑台", element: "metal", type: "eye", value: 0, text: "压制时销毁阵眼更强。" },
  { name: "后土灵坛", element: "earth", type: "eye", value: 0, text: "中台可替五行承伤。" },
  { name: "玄冥水府", element: "water", type: "eye", value: 0, text: "补灵时回复 1。" },
];

const state = {
  round: 1,
  active: "player",
  phase: "prepare",
  selected: null,
  selectedHand: null,
  hasActed: false,
  hasImbued: false,
  winner: null,
  player: createSide("玩家"),
  enemy: createSide("对手"),
};

const logState = {
  queue: [],
  busy: false,
  waiters: [],
};

const aiState = {
  failedThisTurn: false,
};

function createSide(name) {
  return {
    name,
    hp: 24,
    stones: 0,
    hand: [],
    board: Object.fromEntries(ELEMENTS.map((slot) => [slot, null])),
  };
}

function cloneCard(card, element) {
  return { ...card, element: card.element || element, id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}` };
}

function createSlot(card, slot, owner, faceDown = false) {
  const isCoreEye = slot === "core" && card.type === "eye";
  const mode = isCoreEye ? "eye" : card.type === "attack" ? "attack" : card.type === "ongoing" ? "ongoing" : "defense";
  return {
    card,
    mode,
    faceDown: slot !== "core" && mode !== "eye" && (faceDown || (owner === "enemy" && mode === "defense")),
    stones: 0,
    hp: card.value,
    maxHp: card.value,
  };
}

function drawCard(element) {
  const pool = cardPool[element];
  return cloneCard(pool[Math.floor(Math.random() * pool.length)], element);
}

function drawEye() {
  return cloneCard(eyePool[Math.floor(Math.random() * eyePool.length)], "core");
}

function setup() {
  for (const sideKey of ["player", "enemy"]) {
    const side = state[sideKey];
    for (const element of FIVE) drawIntoSlot(side, sideKey, element);
    side.board.core = createSlot(Math.random() < 0.35 ? drawEye() : drawCard(randomFive()), "core", sideKey);
    for (let i = 0; i < 5; i += 1) drawToHand(side);
  }
  log("战局展开。双方填满六槽，并各自获得 5 张手卡。");
  startTurn("player");
}

function randomFive() {
  return FIVE[Math.floor(Math.random() * FIVE.length)];
}

function countAttack(side) {
  return Object.values(side.board).filter((slot) => slot?.mode === "attack").length;
}

function countDefense(side) {
  return Object.values(side.board).filter((slot) => slot?.mode === "defense" || slot?.mode === "ongoing").length;
}

function placementLane(card) {
  if (card.type === "eye") return "eye";
  return card.type === "attack" ? "attack" : "defense";
}

function laneLimitMessage(card) {
  const lane = placementLane(card);
  if (lane === "attack") return `攻击位已有 3 张，无法放置${card.name}。`;
  if (lane === "defense") return `防守位已有 3 张，无法放置${card.name}。`;
  return `无法放置${card.name}。`;
}

function laneLabel(lane) {
  if (lane === "attack") return "攻击";
  if (lane === "defense") return "防守";
  if (lane === "eye") return "阵眼";
  return "卡";
}

function slotLane(slotState) {
  if (!slotState) return null;
  if (slotState.mode === "attack") return "attack";
  if (slotState.mode === "defense" || slotState.mode === "ongoing") return "defense";
  return slotState.mode;
}

function placeTargets(side, card) {
  const lane = placementLane(card);
  if (lane === "eye") return ["core"];
  const candidates = new Set([card.element, "core"]);
  const laneIsFull = lane === "attack" ? countAttack(side) >= 3 : countDefense(side) >= 3;
  if (laneIsFull) {
    candidates.add(card.element);
    candidates.add("core");
  }
  return [...candidates].filter((slot) => {
    const oldSlot = side.board[slot];
    if (slotLane(oldSlot) === lane) return true;
    if (lane === "attack") {
      const attackCountAfterReplace = countAttack(side) - (oldSlot?.mode === "attack" ? 1 : 0);
      return attackCountAfterReplace < 3;
    }
    const replacesDefense = oldSlot?.mode === "defense" || oldSlot?.mode === "ongoing";
    const defenseCountAfterReplace = countDefense(side) - (replacesDefense ? 1 : 0);
    return defenseCountAfterReplace < 3;
  });
}

function canPlaceIntoLane(side, card, slot) {
  const oldSlot = side.board[slot];
  const lane = placementLane(card);
  if (lane === "eye") return true;
  if (slotLane(oldSlot) === lane) return true;
  if (lane === "attack") return countAttack(side) - (oldSlot?.mode === "attack" ? 1 : 0) < 3;
  const replacesDefense = oldSlot?.mode === "defense" || oldSlot?.mode === "ongoing";
  return countDefense(side) - (replacesDefense ? 1 : 0) < 3;
}

function placeSlotReason(side, card, slot) {
  const oldSlot = side.board[slot];
  const lane = placementLane(card);
  if (card.type === "eye" && slot !== "core") return "阵眼只能放入中台";
  if (card.type !== "eye" && ![card.element, "core"].includes(slot)) return `只能放入${LABEL[card.element]}槽或中台`;
  if (slotLane(oldSlot) === lane) return `替换已有${laneLabel(lane)}位`;
  if (canPlaceIntoLane(side, card, slot)) return oldSlot ? `替换后不超过三${laneLabel(lane)}` : `放置后不超过三${laneLabel(lane)}`;
  return `${laneLabel(lane)}位已有 3 张，不能新增`;
}

function placeChoices(side, card) {
  const slots = card.type === "eye" ? ["core"] : [card.element, "core"];
  return slots.map((slot) => {
    const oldSlot = side.board[slot];
    const legal = canPlaceIntoLane(side, card, slot);
    const action = oldSlot ? `替换${oldSlot.card.name}` : "空槽";
    const reason = placeSlotReason(side, card, slot);
    return {
      label: `${LABEL[slot]}槽：${action}（${reason}）`,
      value: slot,
      disabled: !legal,
    };
  });
}

function placePrompt(card, targets) {
  const lane = placementLane(card);
  const replacementOnly = lane === "attack"
    ? countAttack(state.player) >= 3
    : lane === "defense" && countDefense(state.player) >= 3;
  if (replacementOnly) {
    return `${lane === "attack" ? "攻击位" : "防守位"}已有 3 张，${card.name}只能替换已有${lane === "attack" ? "攻击" : "防守"}位。`;
  }
  return `${card.name}只能放入${LABEL[card.element]}槽或中台；中台只能表侧。`;
}

function drawFillCard(side, slot) {
  if (slot === "core" && Math.random() < 0.25) return drawEye();
  const element = slot === "core" ? randomFive() : slot;
  for (let i = 0; i < 24; i += 1) {
    const card = drawCard(element);
    if (canPlaceIntoLane(side, card, slot)) return card;
  }
  const fallback = cardPool[element].find((card) => canPlaceIntoLane(side, card, slot));
  return fallback ? cloneCard(fallback, element) : drawCard(element);
}

function drawIntoSlot(side, sideKey, slot) {
  const card = drawFillCard(side, slot);
  side.board[slot] = createSlot(card, slot, sideKey);
}

function drawToHand(side) {
  side.hand.push(drawCard(randomFive()));
}

function startTurn(sideKey) {
  state.active = sideKey;
  state.phase = "prepare";
  state.hasActed = false;
  state.hasImbued = false;
  state.selected = null;
  state.selectedHand = null;
  const side = state[sideKey];
  side.stones += 1;
  triggerOngoing(side);
  drawToHand(side);
  log(`${side.name}获得 1 枚灵石，并随机抽 1 张手卡。`);
  state.phase = "main1";
  render();
  if (sideKey === "enemy" && !state.winner) setTimeout(runEnemyTurn, 650);
}

function triggerOngoing(side) {
  for (const slot of Object.values(side.board)) {
    if (!slot || slot.mode !== "ongoing") continue;
    if (slot.card.name.includes("灵泉")) {
      side.hp = Math.min(30, side.hp + 1);
      log(`${side.name}的${slot.card.name}回复 1 生命。`);
    }
    if (slot.card.name.includes("寒潭")) {
      const target = Object.values(side.board).find((s) => s?.mode === "ongoing" && s.hp < s.maxHp);
      if (target) target.hp += 1;
    }
  }
}

function canTarget(card, sourceSlot, targetSlot) {
  if (sourceSlot === "hand") return false;
  if (sourceSlot === "core") return targetSlot !== "core";
  return CONTROLS[card.element]?.includes(targetSlot);
}

function isOvercome(attackerElement, targetElement) {
  return OVERCOME[attackerElement] === targetElement;
}

function hasEyePressure(side, opponent) {
  const a = side.board.core?.card;
  const b = opponent.board.core?.card;
  if (a?.type !== "eye" || b?.type !== "eye") return false;
  if (a.element === b.element) return false;
  return OVERCOME[a.element] === b.element || GENERATES[b.element] === a.element;
}

async function activate(slot, targetSlot = null) {
  if (state.winner || state.active !== "player" || state.phase !== "activation" || state.hasActed) return;
  const source = getSelectedSource();
  if (!source) return;
  if (["attack", "destroy"].includes(source.card.type) && !targetSlot) {
    openTargetDialog();
    return;
  }
  await resolveCard(state.player, state.enemy, source, targetSlot);
  await waitForLogIdle();
  state.hasActed = true;
  checkWinner();
  render();
}

function getSelectedSource() {
  if (!state.selected) return null;
  const slotState = state.player.board[state.selected];
  if (!slotState) return null;
  return { card: slotState.card, slot: state.selected, slotState };
}

function getSelectedHandCard() {
  if (state.selectedHand == null) return null;
  const card = state.player.hand[state.selectedHand];
  return card ? { card, slot: "hand", handIndex: state.selectedHand } : null;
}

async function resolveCard(side, opponent, source, targetSlot) {
  const { card, slot, slotState, handIndex } = source;
  const pressure = hasEyePressure(side, opponent);
  const multiplier = pressure ? 2 : 1;

  if (card.type === "attack") {
    if (!canTarget(card, slot, targetSlot)) {
      log(`${card.name}无法攻击${LABEL[targetSlot]}槽。`);
      return;
    }
    const target = opponent.board[targetSlot];
    const attackSpirit = card.value * multiplier + (slotState?.stones || 0);
    const finalSpirit = target && target.mode !== "attack" ? attackSpirit * attackScale(card.element, target.card.element) : attackSpirit;
    await applyDamage(opponent, targetSlot, finalSpirit, card, side);
    log(`${side.name}发动${card.name}攻击${opponent.name}${LABEL[targetSlot]}槽，灵力 ${finalSpirit}。`);
    consumeSource(side, source);
  } else if (card.type === "heal") {
    const amount = card.value * multiplier + (slotState?.stones || 0);
    side.hp = Math.min(30, side.hp + amount);
    log(`${side.name}发动${card.name}回复 ${amount} 生命。`);
    consumeSource(side, source);
  } else if (card.type === "counter" || card.type === "defense") {
    side.hp = Math.min(30, side.hp + 1 + (slotState?.stones || 0));
    log(`${side.name}主动运转${card.name}，回复 ${1 + (slotState?.stones || 0)} 生命。`);
    consumeSource(side, source);
  } else if (card.type === "destroy") {
    const target = opponent.board[targetSlot];
    if (target?.mode === "eye") {
      opponent.board[targetSlot] = null;
      log(`${side.name}以${card.name}破坏阵眼${target.card.name}。`);
    } else if (target) {
      opponent.board[targetSlot] = null;
      log(`${side.name}发动${card.name}毁灭${opponent.name}${LABEL[targetSlot]}槽的${target.card.name}。`);
    } else {
      log(`${card.name}没有找到可毁灭目标。`);
    }
    consumeSource(side, source);
  } else if (card.type === "ongoing") {
    if (slotState.hp < slotState.maxHp) slotState.hp += 1;
    log(`${side.name}催动${card.name}，补充 1 点灵力。`);
  } else if (card.type === "eye") {
    side.stones += 1;
    log(`${side.name}催动阵眼${card.name}，获得 1 枚灵石。`);
  }
}

async function applyDamage(side, slot, amount, sourceCard, attackerSide) {
  let target = side.board[slot];
  if (!target) {
    side.hp -= amount;
    log(`${side.name}${LABEL[slot]}槽为空，不能触发防守或联协，直接承受 ${amount} 点灵力冲击。`);
    return;
  }
  if (target.mode === "attack" && sourceCard.type === "attack") {
    resolveAttackClash(side, slot, amount, sourceCard, target);
    return;
  }
  if (side === state.player && sourceCard.type === "attack") {
    amount = await resolvePlayerDefense(slot, amount, sourceCard);
    if (amount <= 0) return;
    target = side.board[slot];
    if (!target) {
      side.hp -= amount;
      log(`${side.name}${LABEL[slot]}槽防守后为空，剩余 ${amount} 点灵力冲击生命。`);
      return;
    }
  }
  if (target.mode === "ongoing" || sourceCard.type === "attack") {
    const incoming = amount;
    const before = target.hp + target.stones;
    while (target.stones > 0 && amount > 0) {
      target.stones -= 1;
      amount -= 1;
    }
    target.hp -= amount;
    if (target.hp <= 0) {
      log(`${target.card.name}灵力相减：${before}-${incoming}<=0，被破坏。`);
      side.board[slot] = null;
    } else {
      log(`${target.card.name}灵力相减：${before}-${incoming}=${target.hp + target.stones}。`);
    }
    return;
  }
  if (target.mode === "eye") {
    side.hp -= Math.max(1, Math.floor(amount / 2));
    return;
  }
  side.hp -= amount;
  if (target.mode === "attack") side.board[slot] = null;
}

function resolveAttackClash(side, slot, attackerAmount, sourceCard, target) {
  target.faceDown = false;
  const attackerScale = attackScale(sourceCard.element, target.card.element);
  const defenderScale = attackScale(target.card.element, sourceCard.element);
  const attackerPower = attackerAmount * attackerScale;
  const defenderPower = (target.card.value + target.stones) * defenderScale;
  const diff = attackerPower - defenderPower;
  if (attackerPower > defenderPower) {
    side.board[slot] = null;
    log(`${sourceCard.name}与${target.card.name}灵力相减：${attackerPower}-${defenderPower}=${diff}，${target.card.name}被破坏。`);
  } else {
    log(`${sourceCard.name}与${target.card.name}灵力相减：${attackerPower}-${defenderPower}=${diff}，${target.card.name}未被破坏。`);
  }
}

function attackScale(attackerElement, defenderElement) {
  if (attackerElement === defenderElement) return 1;
  if (OVERCOME[attackerElement] === defenderElement) return 2;
  if (GENERATES[defenderElement] === attackerElement) return 2;
  return 1;
}

async function resolvePlayerDefense(slot, amount, sourceCard) {
  const usedSlots = new Set();
  const core = state.player.board.core;
  if (core?.mode === "defense" && (core.card.element === slot || core.card.element === sourceCard.element)) {
    const useCore = await askTrigger({
      title: "中台防守触发",
      text: `对手以${sourceCard.name}攻击${LABEL[slot]}槽。是否发动中台${core.faceDown ? "里侧" : "表侧"}防守卡？`,
      options: [
        { label: `发动 ${core.card.name}`, value: true },
        { label: "不发动", value: false },
      ],
    });
    if (useCore) {
      core.faceDown = false;
      amount = resolveDefenseEffect("中台", core, amount, sourceCard);
      usedSlots.add("core");
      state.player.board.core = null;
      render();
      amount = await resolveLianxie(slot, amount, sourceCard, usedSlots);
      if (amount <= 0) return 0;
    }
  }

  const target = state.player.board[slot];
  if (target?.mode === "defense") {
    const useDefense = await askTrigger({
      title: "防守卡触发",
      text: `${LABEL[slot]}槽有${target.faceDown ? "里侧" : "表侧"}防守卡。是否发动防守效果？`,
      options: [
        { label: `发动 ${target.card.name}`, value: true },
        { label: "不发动，进行灵力相减", value: false },
      ],
    });
    if (useDefense) {
      target.faceDown = false;
      amount = resolveDefenseEffect(`${LABEL[slot]}槽`, target, amount, sourceCard);
      usedSlots.add(slot);
      state.player.board[slot] = null;
      render();
      amount = await resolveLianxie(slot, amount, sourceCard, usedSlots);
    }
  }
  return amount;
}

function resolveDefenseEffect(label, slotState, amount, sourceCard) {
  const card = slotState.card;
  const boost = slotState.stones || 0;
  if (card.type === "heal") {
    const heal = card.value + boost;
    state.player.hp = Math.min(30, state.player.hp + heal);
    log(`玩家翻开${label}${card.name}，回复 ${heal} 生命。`);
    return amount;
  }
  if (card.type === "counter") {
    const block = Math.min(amount, 1 + boost);
    state.enemy.hp -= card.value + boost;
    log(`玩家翻开${label}${card.name}，抵消 ${block} 并反击 ${card.value + boost}。`);
    return amount - block;
  }
  const block = card.value + boost;
  log(`玩家翻开${label}${card.name}，抵消 ${block} 点伤害。`);
  return Math.max(0, amount - block);
}

async function resolveLianxie(startSlot, amount, sourceCard, usedSlots) {
  let current = startSlot;
  while (FIVE.includes(current)) {
    const next = GENERATES[current];
    if (!next || usedSlots.has(next)) break;
    const slotState = state.player.board[next];
    if (!slotState) break;
    if (slotState.card.type === "attack") {
      log(`${LABEL[next]}槽是攻击卡，不能参与联协。`);
      break;
    }
    const useLink = await askTrigger({
      title: "相生联协",
      text: `${LABEL[current]}生${LABEL[next]}。是否发动${LABEL[next]}槽的${slotState.faceDown ? "里侧卡" : slotState.card.name}继续联协？`,
      options: [
        { label: `发动 ${slotState.faceDown ? "里侧卡" : slotState.card.name}`, value: true },
        { label: "停止联协", value: false },
      ],
    });
    if (!useLink) break;
    slotState.faceDown = false;
    amount = resolveLianxieEffect(next, slotState, amount, sourceCard);
    usedSlots.add(next);
    if (slotState.mode === "attack" || slotState.mode === "defense") {
      state.player.board[next] = null;
    }
    render();
    current = next;
  }
  return amount;
}

function resolveLianxieEffect(slot, slotState, amount, sourceCard) {
  const card = slotState.card;
  const boost = slotState.stones || 0;
  if (card.type === "counter") {
    const damage = card.value + boost;
    state.enemy.hp -= damage;
    log(`联协发动${LABEL[slot]}槽${card.name}，反击 ${damage} 点。`);
    return amount;
  }
  if (card.type === "heal") {
    const heal = card.value + boost;
    state.player.hp = Math.min(30, state.player.hp + heal);
    log(`联协发动${LABEL[slot]}槽${card.name}，回复 ${heal} 生命。`);
    return amount;
  }
  if (card.type === "destroy") {
    const weaken = Math.min(amount, card.value + boost);
    log(`联协发动${LABEL[slot]}槽${card.name}，削弱本次攻击 ${weaken} 点。`);
    return amount - weaken;
  }
  if (card.type === "ongoing") {
    const block = Math.min(amount, 1 + boost);
    log(`联协催动${LABEL[slot]}槽${card.name}，抵消 ${block} 点伤害。`);
    return amount - block;
  }
  const block = Math.min(amount, card.value + boost);
  log(`联协发动${LABEL[slot]}槽${card.name}，抵消 ${block} 点伤害。`);
  return amount - block;
}

function consumeSource(side, source) {
  if (source.handIndex != null) {
    side.hand.splice(source.handIndex, 1);
    state.selectedHand = null;
    return;
  }
  if (source.slotState?.mode === "attack" || source.slotState?.mode === "defense") {
    side.board[source.slot] = null;
  }
}

function imbue(slot) {
  if (state.winner || state.active !== "player" || state.hasImbued || state.selectedHand != null) return;
  const slotState = state.player.board[slot];
  if (!slotState || slotState.mode === "eye" || state.player.stones <= 0 || slotState.stones >= 2) return;
  slotState.stones += 1;
  state.player.stones -= 1;
  state.hasImbued = true;
  log(`玩家消耗 1 枚灵石，为${LABEL[slot]}槽补充 1 点灵力。`);
  render();
}

function commitHandPlacement(handIndex, targetSlot, faceDown) {
  const card = state.player.hand[handIndex];
  if (!card) return false;
  const oldSlot = state.player.board[targetSlot];
  state.player.board[targetSlot] = createSlot(card, targetSlot, "player", faceDown);
  state.player.hand.splice(handIndex, 1);
  state.selectedHand = null;
  state.selected = targetSlot;
  const posture = faceDown ? "里侧" : "表侧";
  log(oldSlot ? `玩家以${posture}${card.name}替换${LABEL[targetSlot]}槽的${oldSlot.card.name}。` : `玩家将${card.name}${posture}放入${LABEL[targetSlot]}槽。`);
  render();
  return true;
}

async function placeSelectedHand() {
  if (state.winner || state.active !== "player" || !["main1", "main2"].includes(state.phase) || state.selectedHand == null) return;
  const handIndex = state.selectedHand;
  const card = state.player.hand[handIndex];
  if (!card) return;
  const choices = placeChoices(state.player, card);
  const targetSlot = await askTrigger({
    title: "选择放置位置",
    text: `${card.name}只能放入${card.type === "eye" ? "中台" : LABEL[card.element] + "槽或中台"}；同类型可替换，不同类型需满足三攻三防上限，阵眼不计入攻防位。`,
    options: choices,
    cancelLabel: "返回",
    cancelValue: null,
  });
  if (targetSlot == null) return;
  const faceDown = targetSlot !== "core" && card.type !== "eye" && await askTrigger({
    title: "放置姿态",
    text: `将${card.name}放入${LABEL[targetSlot]}槽。请选择表侧或里侧。`,
    options: [
      { label: "表侧放置", value: false },
      { label: "里侧放置", value: true },
    ],
    cancelLabel: "返回",
    cancelValue: null,
  });
  if (faceDown == null) return;
  commitHandPlacement(handIndex, targetSlot, faceDown);
}

async function endTurn() {
  if (state.winner) return;
  await enforceHandLimit(state[state.active], state.active);
  if (state.winner) return;
  if (state.active === "player") startTurn("enemy");
  else {
    state.round += 1;
    startTurn("player");
  }
}

async function nextPhase() {
  if (state.winner || state.active !== "player") return;
  if (state.phase === "main1") state.phase = "activation";
  else if (state.phase === "activation") state.phase = "main2";
  else if (state.phase === "main2") state.phase = "end";
  else if (state.phase === "end") {
    await endTurn();
    return;
  }
  log(`进入${phaseLabel(state.phase)}。`);
  render();
}

async function runEnemyTurn() {
  if (state.winner) return;
  const enemy = state.enemy;
  aiState.failedThisTurn = false;
  log("对手进入准备阶段。");
  await waitForLogIdle();
  const imbueAction = await chooseEnemyAction("imbue", buildEnemyImbueActions(enemy));
  if (imbueAction?.kind === "imbue") {
    enemy.board[imbueAction.slot].stones += 1;
    enemy.stones -= 1;
    log(`对手为${LABEL[imbueAction.slot]}槽补充 1 点灵力。`);
    await waitForLogIdle();
  }

  log("对手进入主1。");
  await waitForLogIdle();
  await executeEnemyPlacement(await chooseEnemyAction("main1", buildEnemyPlacementActions(enemy)), "主1");
  await waitForLogIdle();

  log("对手进入发动阶段。");
  await waitForLogIdle();
  const activationAction = await chooseEnemyAction("activation", buildEnemyActivationActions(enemy, state.player));
  await executeEnemyActivation(activationAction);
  await waitForLogIdle();

  log("对手进入主2。");
  await waitForLogIdle();
  await executeEnemyPlacement(await chooseEnemyAction("main2", buildEnemyPlacementActions(enemy)), "主2");
  await waitForLogIdle();
  checkWinner();
  render();
  log("对手进入结束阶段。");
  await waitForLogIdle();
  setTimeout(() => {
    endTurn();
  }, 800);
}

function buildEnemyImbueActions(enemy) {
  const actions = [{ id: "pass", kind: "pass", label: "不补灵" }];
  if (enemy.stones <= 0) return actions;
  for (const slot of ELEMENTS) {
    const slotState = enemy.board[slot];
    if (!slotState || slotState.mode === "eye" || slotState.stones >= 2) continue;
    actions.push({
      id: `imbue:${slot}`,
      kind: "imbue",
      slot,
      label: `为${LABEL[slot]}槽${slotState.card.name}补充 1 点灵力`,
    });
  }
  return actions;
}

function buildEnemyPlacementActions(enemy) {
  const actions = [{ id: "pass", kind: "pass", label: "不放置手卡" }];
  enemy.hand.forEach((card, handIndex) => {
    const choices = placeChoices(enemy, card).filter((choice) => !choice.disabled);
    for (const choice of choices) {
      const slot = choice.value;
      const oldSlot = enemy.board[slot];
      const faceOptions = slot === "core" || card.type === "eye" ? [false] : [false, true];
      for (const faceDown of faceOptions) {
        actions.push({
          id: `place:${handIndex}:${slot}:${faceDown ? "down" : "up"}`,
          kind: "place",
          handIndex,
          slot,
          faceDown,
          label: `将手卡${handIndex + 1} ${card.name}${faceDown ? "里侧" : "表侧"}放入${LABEL[slot]}槽${oldSlot ? `，替换${oldSlot.card.name}` : ""}`,
        });
      }
    }
  });
  return actions;
}

function buildEnemyActivationActions(enemy, opponent) {
  const actions = [{ id: "pass", kind: "pass", label: "不发动效果" }];
  const sources = [];
  for (const slot of ELEMENTS) {
    const slotState = enemy.board[slot];
    if (slotState) sources.push({ card: slotState.card, slot, slotState });
  }

  for (const source of sources) {
    if (source.card.type === "attack") {
      for (const target of ELEMENTS) {
        if (target === "core") continue;
        if (!canTarget(source.card, source.slot, target)) continue;
        actions.push({
          id: source.handIndex == null ? `act:${source.slot}:${target}` : `act:hand:${source.handIndex}:${target}`,
          kind: "activate",
          source,
          target,
          label: `${sourceLabel(source)}发动${source.card.name}攻击玩家${LABEL[target]}槽`,
        });
      }
    } else if (source.card.type === "destroy") {
      for (const target of ELEMENTS) {
        if (!opponent.board[target]) continue;
        actions.push({
          id: source.handIndex == null ? `act:${source.slot}:${target}` : `act:hand:${source.handIndex}:${target}`,
          kind: "activate",
          source,
          target,
          label: `${sourceLabel(source)}发动${source.card.name}破坏玩家${LABEL[target]}槽`,
        });
      }
    } else if (["heal", "counter", "defense", "ongoing", "eye"].includes(source.card.type)) {
      actions.push({
        id: source.handIndex == null ? `act:${source.slot}` : `act:hand:${source.handIndex}`,
        kind: "activate",
        source,
        target: null,
        label: `${sourceLabel(source)}发动${source.card.name}`,
      });
    }
  }
  return actions;
}

function sourceLabel(source) {
  return source.handIndex == null ? `${LABEL[source.slot]}槽` : `手卡${source.handIndex + 1}`;
}

async function chooseEnemyAction(decision, actions) {
  if (actions.length <= 1) return actions[0];
  const llmAction = await chooseEnemyActionByModel(decision, actions);
  if (llmAction) return llmAction;
  return chooseEnemyActionLocal(decision, actions);
}

function chooseEnemyActionLocal(decision, actions) {
  if (decision === "imbue") return actions.find((action) => action.kind === "imbue") || actions[0];
  if (decision === "activation") {
    return actions.find((action) => action.kind === "activate" && action.source.card.type === "attack")
      || actions.find((action) => action.kind === "activate" && action.source.card.type === "destroy")
      || actions.find((action) => action.kind === "activate" && action.source.card.type === "heal")
      || actions[0];
  }
  return actions.find((action) => action.kind === "place" && action.handIndex === enemyPlayableHandIndex(state.enemy))
    || actions.find((action) => action.kind === "place")
    || actions[0];
}

async function executeEnemyPlacement(action, phaseName) {
  if (!action || action.kind !== "place") {
    log(`对手${phaseName}没有放置手卡。`);
    return false;
  }
  const card = state.enemy.hand[action.handIndex];
  if (!card || !canPlaceIntoLane(state.enemy, card, action.slot)) {
    log(`对手${phaseName}放置失败，改为观望。`);
    return false;
  }
  const oldSlot = state.enemy.board[action.slot];
  state.enemy.board[action.slot] = createSlot(card, action.slot, "enemy", action.faceDown);
  state.enemy.hand.splice(action.handIndex, 1);
  log(oldSlot ? `对手将一张手卡替换${LABEL[action.slot]}槽。` : `对手将一张手卡放入${LABEL[action.slot]}槽。`);
  render();
  return true;
}

async function executeEnemyActivation(action) {
  if (!action || action.kind !== "activate") {
    log("对手按兵不动。");
    return;
  }
  await resolveCard(state.enemy, state.player, action.source, action.target);
}

async function chooseEnemyActionByModel(decision, actions) {
  const config = getAiConfig();
  if (!config.enabled || aiState.failedThisTurn) return null;
  if (!config.baseUrl || !config.model) return null;
  showAiThinking(true, decision);
  try {
    const publicActions = actions.map((action) => ({
      id: action.id,
      label: action.label,
      kind: action.kind,
    }));
    const response = await fetch(normalizeChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.25,
        max_tokens: 160,
        messages: [
          { role: "system", content: buildAiSystemPrompt() },
          { role: "user", content: buildAiDecisionPrompt(decision, publicActions) },
        ],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.output_text || "";
    const parsed = parseAiChoice(content);
    const selected = actions.find((action) => action.id === parsed.actionId);
    if (!selected) throw new Error("模型没有选择合法动作");
    if (parsed.reason) log(`对手思索：${parsed.reason.slice(0, 42)}`);
    return selected;
  } catch (error) {
    aiState.failedThisTurn = true;
    log(`大模型对手暂不可用，改用本地AI。${error.message || ""}`);
    return null;
  } finally {
    await showAiThinking(false);
  }
}

function parseAiChoice(content) {
  const jsonText = content.match(/\{[\s\S]*\}/)?.[0] || content;
  return JSON.parse(jsonText);
}

function normalizeChatEndpoint(baseUrl) {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  if (/^\.?\//.test(trimmed) || trimmed.endsWith(".php")) return trimmed;
  if (trimmed.endsWith("/chat/completions")) return trimmed;
  if (trimmed.endsWith("/v1")) return `${trimmed}/chat/completions`;
  return `${trimmed}/v1/chat/completions`;
}

function getAiConfig() {
  try {
    return { ...DEFAULT_AI_CONFIG, ...JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || "{}") };
  } catch {
    return { ...DEFAULT_AI_CONFIG };
  }
}

function saveAiConfig(config) {
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
}

function buildAiSystemPrompt() {
  return [
    "你是网页卡牌游戏《斗阵 Array Duel》的对手AI，修仙阵法风格，目标是击败玩家。",
    "你只能从用户给出的 actions 数组里选择一个 actionId，不能发明动作。",
    "请只输出 JSON，例如：{\"actionId\":\"pass\",\"reason\":\"保留资源\"}。",
    "核心规则：五行槽为木、火、土、金、水，加中台。普通五行卡只能放到自身属性槽或中台；阵眼只能放中台，且不计入攻防位。",
    "场上最多 3 个攻击位、3 个防守位。替换同类型永远合法；替换不同类型或空槽不能打破三攻三防限制。",
    "发动阶段只能发动场上卡槽，中台攻击可攻击任意五行槽但不能攻击中台；手卡不能直接发动，只能在主阶段放置或替换。",
    "攻击攻击槽时双方按灵力和五行倍率相减，溢出不反伤；攻击防守/永续时按灵力扣除，空槽直接伤害生命。",
    "五行相克：木克土，土克水，水克火，火克金，金克木。五行相生：木生火，火生土，土生金，金生水，水生木。",
    "防守、恢复、反击、销毁为一次性；销毁可以选择任意有卡的阵位；永续持续占槽；阵眼持续在中台生效直到被销毁或替换。",
    "优先策略：能造成有效伤害就进攻；能破坏关键永续/阵眼就销毁；血量低时恢复；手卡多时优先上场或替换弱牌；不要选择 pass 除非其他动作价值低。",
  ].join("\n");
}

function buildAiDecisionPrompt(decision, actions) {
  return JSON.stringify({
    decision,
    round: state.round,
    phase: phaseLabel(state.phase),
    enemy: serializeSideForAi(state.enemy, "enemy"),
    player: serializeSideForAi(state.player, "player"),
    cardPool,
    eyePool,
    actions,
  });
}

function serializeSideForAi(side, owner) {
  return {
    name: side.name,
    hp: side.hp,
    stones: side.stones,
    attackCount: countAttack(side),
    defenseCount: countDefense(side),
    hand: owner === "enemy" ? side.hand.map(serializeCardForAi) : `${side.hand.length}张`,
    board: Object.fromEntries(ELEMENTS.map((slot) => [slot, serializeSlotForAi(side.board[slot], owner, slot)])),
  };
}

function serializeSlotForAi(slotState, owner, slot) {
  if (!slotState) return null;
  const hidden = owner === "player" && slotState.faceDown;
  if (hidden) {
    return {
      slot,
      element: LABEL[slot],
      hidden: true,
      mode: modeLabel(slotState),
      spirit: slotState.hp + slotState.stones,
    };
  }
  return {
    slot,
    element: LABEL[slot],
    hidden: false,
    mode: modeLabel(slotState),
    stones: slotState.stones,
    hp: slotState.hp,
    spirit: slotState.hp + slotState.stones,
    card: serializeCardForAi(slotState.card),
  };
}

function serializeCardForAi(card) {
  return {
    name: card.name,
    element: LABEL[card.element],
    type: TYPE[card.type],
    value: card.value,
    text: card.text,
  };
}

function showAiThinking(visible, decision = "") {
  const overlay = document.querySelector("#aiThinking");
  const text = document.querySelector("#aiThinkingText");
  if (!overlay) return Promise.resolve();
  if (visible) {
    const label = {
      imbue: "对手正在选择补灵目标...",
      main1: "对手正在布局主1...",
      activation: "对手正在推演发动目标...",
      main2: "对手正在调整主2...",
    }[decision] || "对手正在推演阵法...";
    if (text) text.textContent = label;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("show"));
    return Promise.resolve();
  } else {
    overlay.classList.remove("show");
    return new Promise((resolve) => setTimeout(() => {
      if (!overlay.classList.contains("show")) overlay.hidden = true;
      resolve();
    }, 180));
  }
}

function placeEnemyHandCard() {
  const index = enemyPlayableHandIndex(state.enemy);
  if (index < 0) return false;
  const card = state.enemy.hand[index];
  const targets = placeTargets(state.enemy, card);
  if (targets.length === 0) return false;
  const targetSlot = targets.includes("core") && Math.random() < 0.35 ? "core" : targets[0];
  const faceDown = targetSlot !== "core" && card.type !== "eye" && Math.random() < (card.type === "attack" ? 0.35 : 0.75);
  state.enemy.board[targetSlot] = createSlot(card, targetSlot, "enemy", faceDown);
  state.enemy.hand.splice(index, 1);
  log(`对手将一张手卡放入${LABEL[targetSlot]}槽。`);
  return true;
}

function enemyPlayableHandIndex(side) {
  const priorities = [
    (card) => card.type === "attack",
    (card) => card.type === "destroy",
    (card) => card.type === "ongoing" || card.type === "eye",
    () => true,
  ];
  for (const matches of priorities) {
    const index = side.hand.findIndex((card) => matches(card) && placeTargets(side, card).length > 0);
    if (index >= 0) return index;
  }
  return -1;
}

async function enforceHandLimit(side, sideKey) {
  if (side.hand.length <= 6) return;
  log(`${side.name}结束阶段手卡超过 6 张，需要弃牌到 6 张。`);
  if (sideKey === "enemy") {
    while (side.hand.length > 6) {
      const discardIndex = chooseEnemyDiscardIndex(side);
      const [discarded] = side.hand.splice(discardIndex, 1);
      log(`对手弃置一张${LABEL[discarded.element]}系手卡。`);
    }
    render();
    return;
  }

  while (side.hand.length > 6) {
    const discardIndex = await askDiscard(side);
    if (discardIndex == null || !side.hand[discardIndex]) continue;
    const [discarded] = side.hand.splice(discardIndex, 1);
    if (state.selectedHand === discardIndex) state.selectedHand = null;
    else if (state.selectedHand > discardIndex) state.selectedHand -= 1;
    log(`玩家弃置${discarded.name}。`);
    render();
  }
}

function chooseEnemyDiscardIndex(side) {
  const firstUnplaceable = side.hand.findIndex((card) => placeTargets(side, card).length === 0);
  if (firstUnplaceable >= 0) return firstUnplaceable;
  const firstDefense = side.hand.findIndex((card) => card.type !== "attack" && card.type !== "destroy");
  if (firstDefense >= 0) return firstDefense;
  return side.hand.length - 1;
}

function askDiscard(side) {
  return askTrigger({
    title: "结束阶段弃牌",
    text: `手卡 ${side.hand.length} 张，必须弃到 6 张。请选择 1 张弃置。`,
    options: side.hand.map((card, index) => ({
      label: `${card.name} · ${LABEL[card.element]} · ${TYPE[card.type]}`,
      value: index,
    })),
    required: true,
  });
}

function findSource(side, type) {
  for (const slot of ELEMENTS) {
    const slotState = side.board[slot];
    if (slotState?.card.type === type) return { card: slotState.card, slot, slotState };
  }
  const handIndex = side.hand.findIndex((card) => card.type === type);
  if (handIndex >= 0) return { card: side.hand[handIndex], slot: "hand", handIndex };
  return null;
}

function findBestMove(side, opponent) {
  return findMove(side, opponent, "attack") || findMove(side, opponent, "destroy");
}

function findMove(side, opponent, type) {
  const sources = [];
  for (const slot of ELEMENTS) {
    const slotState = side.board[slot];
    if (slotState?.card.type === type) sources.push({ card: slotState.card, slot, slotState });
  }
  side.hand.forEach((card, handIndex) => {
    if (card.type === type) sources.push({ card, slot: "hand", handIndex });
  });
  for (const source of sources) {
    for (const target of ELEMENTS) {
      if (target === "core" && type === "attack") continue;
      const legalAttack = type === "attack" && canTarget(source.card, source.slot, target);
      const legalDestroy = type === "destroy" && Boolean(opponent.board[target]);
      if (legalAttack || legalDestroy) {
        return { source, target };
      }
    }
  }
  return null;
}

function checkWinner() {
  if (state.player.hp <= 0) state.winner = "对手";
  if (state.enemy.hp <= 0) state.winner = "玩家";
  if (state.winner) log(`${state.winner}获胜。`);
}

function openTargetDialog() {
  const source = getSelectedSource();
  if (!source) return;
  const list = document.querySelector("#targetList");
  list.innerHTML = "";
  for (const targetSlot of ELEMENTS) {
    if (targetSlot === "core" && source.card.type === "attack") continue;
    const target = state.enemy.board[targetSlot];
      const legal = source.card.type === "destroy" ? Boolean(target) : canTarget(source.card, source.slot, targetSlot);
    if (!legal) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${LABEL[targetSlot]}槽：${target ? visibleName(target, true) : "空槽"}`;
    button.addEventListener("click", () => {
      document.querySelector("#targetDialog").close();
      activate(source.slot, targetSlot);
    });
    list.append(button);
  }
  document.querySelector("#targetDialog").showModal();
}

function askTrigger({ title, text, options, cancelLabel = "关闭", cancelValue = false, required = false }) {
  return new Promise((resolve) => {
    const dialog = document.querySelector("#triggerDialog");
    const form = dialog.querySelector("form");
    form?.addEventListener("submit", (event) => event.preventDefault(), { once: true });
    document.querySelector("#triggerTitle").textContent = title;
    document.querySelector("#triggerText").textContent = text;
    const list = document.querySelector("#triggerList");
    list.innerHTML = "";
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      dialog.close();
      setTimeout(() => resolve(value), 0);
    };
    for (const option of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.disabled = Boolean(option.disabled);
      if (option.disabled) button.classList.add("option-disabled");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (!option.disabled) settle(option.value);
      });
      list.append(button);
    }
    if (!required) {
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "secondary";
      cancel.textContent = cancelLabel;
      cancel.addEventListener("click", (event) => {
        event.preventDefault();
        settle(cancelValue);
      });
      list.append(cancel);
      dialog.addEventListener("cancel", () => settle(cancelValue), { once: true });
      dialog.addEventListener("close", () => settle(cancelValue), { once: true });
    } else {
      dialog.addEventListener("cancel", (event) => event.preventDefault(), { once: true });
    }
    dialog.showModal();
  });
}

function log(text) {
  logState.queue.push(text);
  if (!logState.busy) playNextLog();
}

function playNextLog() {
  const text = logState.queue.shift();
  if (!text) {
    logState.busy = false;
    const waiters = logState.waiters.splice(0);
    waiters.forEach((resolve) => resolve());
    return;
  }
  logState.busy = true;
  const logNode = document.querySelector("#log");
  const item = document.createElement("li");
  item.textContent = text;
  item.className = "log-item-enter";
  logNode.prepend(item);
  while (logNode.children.length > 18) logNode.lastChild.remove();
  showToast(text);
  setTimeout(playNextLog, 760);
}

function waitForLogIdle() {
  if (!logState.busy && logState.queue.length === 0) return Promise.resolve();
  return new Promise((resolve) => logState.waiters.push(resolve));
}

function showToast(text) {
  const host = document.querySelector("#toastHost");
  if (!host) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  host.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 240);
  }, 2200);
  while (host.children.length > 4) host.firstChild.remove();
}

function showCardDetail(slotState, owner, slot) {
  if (!slotState) return;
  const hidden = owner === "enemy" && slotState.faceDown;
  const title = hidden ? visibleName(slotState, true) : slotState.card.name;
  const meta = [
    `${LABEL[slot]}槽`,
    hidden ? LABEL[slotState.card.element] : LABEL[slotState.card.element],
    hidden ? modeLabel(slotState) : TYPE[slotState.card.type],
    slotState.mode === "eye" ? "持续生效" : `灵力 ${slotState.hp + slotState.stones}`,
  ].join(" · ");
  document.querySelector("#cardTitle").textContent = title;
  document.querySelector("#cardMeta").textContent = meta;
  document.querySelector("#cardText").textContent = hidden ? "里侧卡效果隐藏。" : slotState.card.text;
  document.querySelector("#cardDialog").showModal();
}

function render() {
  renderBoard("playerBoard", state.player, "player");
  renderBoard("enemyBoard", state.enemy, "enemy");
  renderHand();
  document.querySelector("#playerHp").textContent = Math.max(0, state.player.hp);
  document.querySelector("#enemyHp").textContent = Math.max(0, state.enemy.hp);
  document.querySelector("#playerStones").textContent = state.player.stones;
  document.querySelector("#enemyStones").textContent = state.enemy.stones;
  document.querySelector("#turnLabel").textContent = state.active === "player" ? `玩家回合 · ${phaseLabel(state.phase)}` : "对手回合";
  document.querySelector("#roundLabel").textContent = `第 ${state.round} 回合`;
  const source = getSelectedSource();
  const handSource = getSelectedHandCard();
  document.querySelector("#selectedInfo").textContent = source
    ? `${source.slot === "hand" ? "手卡" : LABEL[source.slot] + "槽"} ${source.card.name}：${TYPE[source.card.type]}`
    : handSource
      ? `手卡 ${handSource.card.name}：${TYPE[handSource.card.type]}`
    : state.winner
      ? `${state.winner}获胜`
      : "选择己方卡槽或手卡";
  const canUse = state.active === "player" && !state.winner;
  const inMain = ["main1", "main2"].includes(state.phase);
  document.querySelector("#imbueBtn").disabled = !canUse || !inMain || !state.selected || state.hasImbued || state.selectedHand != null;
  document.querySelector("#activateBtn").disabled = !canUse || state.phase !== "activation" || !source || state.hasActed || state.selectedHand != null;
  document.querySelector("#replaceBtn").disabled = !canUse || !inMain || state.selectedHand == null;
  document.querySelector("#endBtn").disabled = !canUse;
  document.querySelector("#endBtn").textContent = state.phase === "end" ? "结束回合" : "下一阶段";
}

function phaseLabel(phase) {
  return {
    prepare: "准备阶段",
    main1: "主1",
    activation: "发动阶段",
    main2: "主2",
    end: "结束阶段",
  }[phase] || phase;
}

function renderBoard(id, side, owner) {
  const root = document.querySelector(`#${id}`);
  root.innerHTML = "";
  for (const slot of ELEMENTS) {
    const slotState = side.board[slot];
    const node = document.createElement("button");
    node.type = "button";
    node.className = [
      "slot",
      `slot-${slot}`,
      slotState?.mode === "attack" ? "attack-mode" : "",
      slotState?.mode === "defense" ? "defense-mode" : "",
      slotState?.faceDown ? "face-down" : "",
      state.selected === slot && owner === "player" ? "selected" : "",
    ].join(" ");
    node.style.setProperty("--slot-color", COLOR[slot]);
    node.disabled = false;
    node.innerHTML = `
      <div class="slot-header">
        <span>${LABEL[slot]}</span>
        ${slotState ? `<span class="slot-type">${slotTypeMark(slotState)}</span>` : ""}
      </div>
      ${renderSlotCard(slotState, owner)}
      ${slotState ? `<span class="detail-button" role="button" aria-label="查看${LABEL[slot]}槽效果">查看卡片</span>` : ""}
    `;
    node.addEventListener("click", () => {
      if (owner === "player" && state.active === "player" && !state.winner) {
        state.selected = slot;
        state.selectedHand = null;
      }
      render();
    });
    const detailButton = node.querySelector(".detail-button");
    if (detailButton) {
      detailButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showCardDetail(slotState, owner, slot);
      });
    }
    root.append(node);
  }
}

function renderSlotCard(slotState, owner) {
  if (!slotState) return `<div class="card empty"><span>空</span></div>`;
  const hidden = owner === "enemy" && slotState.faceDown;
  const valueText = slotState.mode === "eye" ? "阵眼" : `灵力:${slotState.hp + slotState.stones}`;
  if (hidden) {
    const hiddenMode = slotState.mode === "attack" ? "攻击" : slotState.mode === "ongoing" ? "永续" : "防守";
    return `
      <div class="card">
        <div class="card-name">里侧${hiddenMode}</div>
        <div class="card-value">${valueText}</div>
      </div>
    `;
  }
  return `
    <div class="card">
      <div class="card-name">${slotState.card.name}</div>
      <div class="card-value">${valueText}</div>
    </div>
  `;
}

function slotTypeMark(slotState) {
  if (slotState.faceDown) {
    if (slotState.mode === "attack") return "攻";
    if (slotState.mode === "ongoing") return "续";
    return "防";
  }
  return TYPE_MARK[slotState.card.type] || "术";
}

function modeLabel(slotState) {
  if (slotState.mode === "attack") return slotState.faceDown ? "里侧攻击" : "表侧攻击";
  if (slotState.mode === "defense") return slotState.faceDown ? "里侧防守" : "表侧防守";
  if (slotState.mode === "ongoing") return slotState.faceDown ? "里侧永续" : "表侧永续";
  if (slotState.mode === "eye") return "阵眼";
  return "";
}

function visibleName(slotState, enemyView) {
  if (enemyView && slotState.faceDown) {
    if (slotState.mode === "attack") return "里侧攻击";
    if (slotState.mode === "ongoing") return "里侧永续";
    return "里侧防守";
  }
  return slotState.card.name;
}

function renderHand() {
  const root = document.querySelector("#playerHand");
  root.innerHTML = "";
  if (state.player.hand.length === 0) {
    root.innerHTML = `<div class="card empty">无手卡</div>`;
    return;
  }
  state.player.hand.forEach((card, index) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = `hand-card ${state.selectedHand === index ? "selected" : ""}`;
    node.style.setProperty("--slot-color", COLOR[card.element]);
    node.innerHTML = `
      <span class="hand-element">${LABEL[card.element]}</span>
      <span class="hand-type">${TYPE_MARK[card.type] || "术"}</span>
      <strong>${card.name}</strong>
      <span class="hand-value">${card.type === "eye" ? "阵眼" : `灵力:${card.value}`}</span>
      <span class="hand-text">${TYPE[card.type]} · ${card.text}</span>
    `;
    node.disabled = state.active !== "player" || Boolean(state.winner);
    node.addEventListener("click", () => {
      state.selectedHand = index;
      state.selected = null;
      render();
    });
    root.append(node);
  });
}

function renderStones(count) {
  return Array.from({ length: count }, () => `<i class="stone-dot"></i>`).join("");
}

document.querySelector("#imbueBtn").addEventListener("click", () => imbue(state.selected));
document.querySelector("#activateBtn").addEventListener("click", () => activate(state.selected));
document.querySelector("#replaceBtn").addEventListener("click", () => placeSelectedHand());
document.querySelector("#endBtn").addEventListener("click", () => nextPhase());

function initAiSettings() {
  const openButton = document.querySelector("#aiSettingsBtn");
  const dialog = document.querySelector("#aiDialog");
  const form = document.querySelector("#aiForm");
  const closeButton = document.querySelector("#closeAiSettings");
  if (!openButton || !dialog || !form) return;

  const fields = {
    enabled: document.querySelector("#aiEnabled"),
    baseUrl: document.querySelector("#aiBaseUrl"),
    model: document.querySelector("#aiModel"),
    modelPreset: document.querySelector("#aiModelPreset"),
    apiKey: document.querySelector("#aiApiKey"),
  };

  const updateButton = () => {
    const config = getAiConfig();
    openButton.textContent = config.enabled ? "AI On" : "AI设置";
    openButton.setAttribute("aria-pressed", String(config.enabled));
  };

  openButton.addEventListener("click", () => {
    const config = getAiConfig();
    fields.enabled.checked = Boolean(config.enabled);
    fields.baseUrl.value = config.baseUrl || "";
    fields.model.value = config.model || "";
    fields.modelPreset.value = [...fields.modelPreset.options].some((option) => option.value === config.model) ? config.model : "";
    fields.apiKey.value = config.apiKey || "";
    dialog.showModal();
  });

  fields.modelPreset?.addEventListener("change", () => {
    if (fields.modelPreset.value) fields.model.value = fields.modelPreset.value;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAiConfig({
      enabled: fields.enabled.checked,
      baseUrl: fields.baseUrl.value.trim(),
      model: fields.model.value.trim(),
      apiKey: fields.apiKey.value.trim(),
    });
    updateButton();
    dialog.close();
    log(fields.enabled.checked ? "大模型对手已启用。" : "大模型对手已关闭。");
  });

  closeButton?.addEventListener("click", () => dialog.close());
  updateButton();
}

function initMusic() {
  const audio = document.querySelector("#bgm");
  const button = document.querySelector("#musicToggle");
  if (!audio || !button) return;
  audio.volume = 0.34;
  const update = (enabled) => {
    button.textContent = enabled ? "乐 On" : "乐 Off";
    button.setAttribute("aria-pressed", String(enabled));
  };
  const saved = localStorage.getItem("arrayDuelMusic") === "on";
  update(saved);
  if (saved) {
    audio.play().catch(() => {
      localStorage.setItem("arrayDuelMusic", "off");
      update(false);
    });
  }
  button.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
        localStorage.setItem("arrayDuelMusic", "on");
        update(true);
      } catch {
        localStorage.setItem("arrayDuelMusic", "off");
        update(false);
        log("浏览器阻止了自动播放，请再点一次背景音乐。");
      }
    } else {
      audio.pause();
      localStorage.setItem("arrayDuelMusic", "off");
      update(false);
    }
  });
}

initAiSettings();
initMusic();
setup();
