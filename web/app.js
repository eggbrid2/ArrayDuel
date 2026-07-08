const ELEMENTS = ["wood", "fire", "earth", "water", "core", "metal"];
const FIVE = ["wood", "fire", "earth", "metal", "water"];
const LABEL = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水", core: "中" };
const COLOR = { wood: "#3f8a57", fire: "#c94c31", earth: "#9a7a3f", metal: "#7d8790", water: "#327aa1", core: "#5a4a84" };
const TYPE = { attack: "攻击", defense: "防守", heal: "恢复", counter: "反击", destroy: "销毁", ongoing: "永续", eye: "阵眼" };
const TYPE_MARK = { attack: "攻", defense: "防", heal: "回", counter: "反", destroy: "毁", ongoing: "续", eye: "阵" };
const SPELL_TEXT = {
  wood: {
    name: "木法诀·生",
    short: "检索火卡、炼片检索、缠根破阵。",
    full: "从手牌直接打出。选择一种：木生火定向抽火；炼化灵宝碎片抽其相生属性；或缠根削弱敌阵。",
    tip: "偏检索和软去除，用来启动火系爆发或拆低灵力防线。",
  },
  fire: {
    name: "火法诀·燃",
    short: "蓄势爆发、焚手换牌、灼阵毁卡。",
    full: "从手牌直接打出。选择一种：强化下一次攻击；焚化手牌换抽；或焚化手牌灼烧敌方卡槽。",
    tip: "偏爆发和烧牌，把多余手牌变成伤害或更深的牌库挖掘。",
  },
  earth: {
    name: "土法诀·固",
    short: "补灵、埋手补卡、炼片镇封。",
    full: "从手牌直接打出。选择一种：为己方卡槽补灵；焚化手牌抽土卡并护阵；或炼化灵宝碎片镇封敌阵。",
    tip: "偏资源沉淀，把手牌或碎片转成场面厚度。",
  },
  metal: {
    name: "金法诀·斩",
    short: "削灵、拆器、炼片检索金卡。",
    full: "从手牌直接打出。选择一种：削弱敌方卡槽；焚化手牌拆除低灵力卡；或炼化灵宝碎片定向抽金。",
    tip: "偏单体去除和精炼检索，用来处理关键永续或防反。",
  },
  water: {
    name: "水法诀·化",
    short: "重铸水卡、焚手滤抽、净化回血。",
    full: "从手牌直接打出。选择一种：从灵宝碎片重铸水卡；焚化手牌定向抽水；或炼化碎片回血抽卡。",
    tip: "偏循环和续航，把灵宝碎片转成防守手牌。",
  },
};
const CONTROLS = {
  wood: ["wood", "earth", "water"],
  fire: ["fire", "metal", "wood"],
  earth: ["earth", "water", "fire"],
  metal: ["metal", "wood", "earth"],
  water: ["water", "fire", "metal"],
};
const OVERCOME = { wood: "earth", fire: "metal", earth: "water", metal: "wood", water: "fire" };
const GENERATES = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
const START_HP = 24;
const MAX_HP = 32;
const DRAW_WEIGHT = { attack: 1, defense: 2, heal: 2, counter: 2, destroy: 1, ongoing: 2 };
const CYCLE_POWER = {
  fire: "离火焚阵",
  wood: "万木生息",
  water: "沧浪回天",
  earth: "厚土镇岳",
  metal: "五行归刃",
};
const VFX_ASSETS = {
  fire: { file: "fireball.png", frames: 6, width: 16, height: 16, scale: 4 },
  fireSpell: { file: "fire-spell.png", frames: 8, width: 96, height: 96, scale: 1.05, duration: 620 },
  fireWrath: { file: "fire-wrath.png", frames: 8, width: 96, height: 96, scale: 1.18, duration: 720 },
  wood: { file: "plant-missile.png", frames: 6, width: 16, height: 16, scale: 4 },
  woodSpell: { file: "wood-spell.png", frames: 8, width: 96, height: 96, scale: 1.05, duration: 650 },
  natureHeal: { file: "nature-heal.png", frames: 8, width: 96, height: 96, scale: 1.08, duration: 720 },
  water: { file: "water-blast.png", frames: 6, width: 16, height: 16, scale: 4 },
  waterMagic: { file: "water-magic.png", frames: 8, width: 96, height: 96, scale: 1.06, duration: 660 },
  iceLance: { file: "ice-lance.png", frames: 8, width: 96, height: 96, scale: 1.05, duration: 560 },
  earth: { file: "rock-sling.png", frames: 1, width: 16, height: 16, scale: 4 },
  earthImpact: { file: "earth-impact.png", frames: 8, width: 96, height: 96, scale: 1.14, duration: 680 },
  earthSpell: { file: "earth-spell.png", frames: 8, width: 96, height: 96, scale: 1.08, duration: 660 },
  metal: { file: "slash-gold.png", frames: 6, width: 126, height: 150, scale: 0.82, duration: 460 },
  metalLightning: { file: "metal-lightning.png", frames: 8, width: 96, height: 96, scale: 1.1, duration: 560 },
  lightBolt: { file: "light-bolt.png", frames: 6, width: 16, height: 16, scale: 4 },
  slashBlue: { file: "slash-blue.png", frames: 6, width: 126, height: 150, scale: 0.82, duration: 460 },
  slashFire: { file: "slash-fire.png", frames: 6, width: 126, height: 150, scale: 0.82, duration: 460 },
  shockwave: { file: "shockwave.png", frames: 7, width: 184, height: 366, scale: 0.46, duration: 620 },
  fireHit: { file: "firebomb.png", frames: 6, width: 16, height: 16, scale: 5 },
  shield: { file: "shield.png", frames: 6, width: 48, height: 48, scale: 2 },
  lightPillar: { file: "light-pillar.png", frames: 8, width: 96, height: 96, scale: 1.14, duration: 760 },
  portal: { file: "portal.png", frames: 8, width: 96, height: 96, scale: 1.1, duration: 760 },
  magicCircle: { file: "magic-circle.png", frames: 8, width: 96, height: 96, scale: 1.14, duration: 820 },
  splash: { file: "splash.png", frames: 6, width: 32, height: 32, scale: 2 },
  heal: { file: "splash.png", frames: 6, width: 32, height: 32, scale: 2 },
  destroy: { file: "darkness-orb.png", frames: 6, width: 16, height: 16, scale: 5 },
  sparks: { file: "magic-sparks.png", frames: 6, width: 16, height: 16, scale: 4 },
  explosion: { file: "explosion.png", frames: 50, columns: 10, width: 100, height: 100, scale: 1.25, duration: 900 },
};
const VFX_REGISTRY = {
  attack: {
    fire: "fire",
    water: "slashBlue",
    metal: "metal",
    wood: "wood",
    earth: "earth",
    default: "sparks",
  },
  overcome: {
    fire: ["fire", "fireWrath"],
    water: ["water", "iceLance"],
    metal: ["metal", "metalLightning"],
    wood: ["wood", "woodSpell"],
    earth: ["earth", "earthImpact"],
    default: ["shockwave", "explosion"],
  },
  hit: {
    fire: "fireHit",
    water: "splash",
    metal: "sparks",
    wood: "wood",
    earth: "shockwave",
    default: "sparks",
  },
  heal: {
    fire: "lightPillar",
    water: "waterMagic",
    metal: "lightPillar",
    wood: "natureHeal",
    earth: "earthSpell",
    default: "lightPillar",
  },
  defense: {
    fire: "shield",
    water: "shield",
    metal: "shield",
    wood: "shield",
    earth: "shield",
    default: "shield",
  },
  counter: {
    fire: ["shield", "slashFire"],
    water: ["shield", "slashBlue"],
    metal: ["shield", "metalLightning"],
    wood: ["shield", "woodSpell"],
    earth: ["shield", "earthImpact"],
    default: ["shield", "sparks"],
  },
  destroy: {
    fire: "explosion",
    water: "destroy",
    metal: "metal",
    wood: "destroy",
    earth: "shockwave",
    default: "explosion",
  },
  synergy: {
    fire: ["portal", "fireSpell"],
    water: ["portal", "waterMagic"],
    metal: ["portal", "lightBolt"],
    wood: ["portal", "woodSpell"],
    earth: ["portal", "earthSpell"],
    default: ["portal", "sparks"],
  },
  array: {
    fire: ["magicCircle", "fireWrath"],
    water: ["magicCircle", "waterMagic"],
    metal: ["magicCircle", "metalLightning"],
    wood: ["magicCircle", "natureHeal"],
    earth: ["magicCircle", "earthImpact"],
    default: ["magicCircle", "portal"],
  },
};
const AI_CONFIG_KEY = "arrayDuelAiConfig";
const DEFAULT_AI_CONFIG = {
  enabled: true,
  baseUrl: "./ai-proxy.php",
  model: "gpt-5.5",
};
const AUTH_ENDPOINT = "./auth.php";
const VICTORY_MESSAGES_ENDPOINT = "./victory-messages.php";
const PLAYER_DATA_ENDPOINT = "./auth.php";
const DECK_RULES = {
  min: 30,
  max: 50,
  maxCopies: 3,
  minEye: 1,
  minPerElement: 3,
};
const DEFEAT_TAUNTS = [
  "你这阵法松得像没结印，连我的起手式都没逼出来。",
  "六个槽位摆成这样，五行看了都想改名。",
  "我本来还在推演，结果你先把自己推没了。",
  "这不是斗阵，是把胜利双手奉上还附赠灵石。",
  "下次记得先看克制关系，再来挑战我的耐心。",
];
const CARD_ART = {};

const cardPool = {
  wood: [
    { name: "青藤剑诀", type: "attack", value: 2, text: "木克土。水生木时加灵，克制击破后为手牌最低灵力卡补 1。" },
    { name: "万木穿岩", type: "attack", value: 2, text: "攻击永续时灵力相减。若场上有水卡，额外压低目标 1 灵力。" },
    { name: "扶桑破阵", type: "attack", value: 3, text: "高灵力木系攻击。周天木阵时，击破后己方一张卡补 1 灵力。" },
    { name: "藤影连刺", type: "attack", value: 2, text: "稳定攻击。可消耗水系手卡联协，获得 +1 灵力。" },
    { name: "灵藤护身", type: "defense", value: 2, text: "抵消 2 点伤害。被水生木联协时额外回复 1。" },
    { name: "春生术", type: "heal", value: 2, text: "触发时回复 2 生命。金生水、水生木链完整时额外抽 1。" },
    { name: "青藤反缚", type: "counter", value: 1, text: "反击陷阱。按木与被攻槽、攻击来源的生克关系连锁：补阵、抽牌、削攻或蓄势。" },
    { name: "斩根符", type: "destroy", value: 2, text: "破坏永续、压阵或阵眼。木克土目标时返还 1 灵石。" },
    { name: "青木灵泉", type: "ongoing", value: 4, text: "准备阶段回复 1。火卡发动时，木生火提供阵势。" },
    { name: "引火灵芽", type: "heal", value: 1, text: "回复 1 并定向抽 1 张火卡；作为木法诀时木生火可补 2 火。" },
    { name: "空庭生枝", type: "counter", value: 1, text: "反击陷阱。对方攻击木所生之槽或木槽空位时，更容易补阵和抽木系手牌。" },
    { name: "藤门借道", type: "defense", value: 1, text: "护阵拦截。联协后若仍有伤害，抽 1 张木系卡。" },
    { name: "枯荣返青", type: "heal", value: 2, text: "回复 2；若灵宝碎片有木卡，重铸 1 张木卡。" },
    { name: "灵根搜火", type: "ongoing", value: 3, text: "准备阶段若有灵宝碎片，炼化 1 个碎片并定向抽其相生属性卡。" },
    { name: "缠山破土", type: "attack", value: 2, text: "攻击土槽时压低目标 1 灵力；打空土槽会担心土槽陷阱补阵。" },
    { name: "枝影换位", type: "destroy", value: 1, text: "削弱或拆除低灵力卡；若破坏土系目标，抽 1 张火卡。" },
    { name: "木火引线", type: "attack", value: 1, text: "低灵力启动牌。若本次有木生火阵势，攻击后抽 1 张火系卡。" },
    { name: "翠幕反卷", type: "counter", value: 2, text: "反击陷阱。相生时补阵，相克时削攻；同源时抽木并使下一次攻击 +1。" },
    { name: "万象萌动", type: "ongoing", value: 4, text: "每次以灵石重铸灵宝碎片后，己方最低灵力槽 +1。" },
  ],
  fire: [
    { name: "赤霄火剑", type: "attack", value: 2, text: "火克金。木生火时加灵，克制击破会追加灼伤生命。" },
    { name: "流火飞星", type: "attack", value: 2, text: "中台发动可攻击任意五行槽。火阵周天时溢出更狠。" },
    { name: "朱雀焚阵", type: "attack", value: 3, text: "高灵力火系攻击。消耗木系手卡联协时，直接进入爆发。" },
    { name: "炎龙吐息", type: "attack", value: 2, text: "稳定攻击，克金破木。目标为金时额外 +1 灵力。" },
    { name: "烈焰护体", type: "defense", value: 1, text: "抵消 1，并可反击。木生火联协时反击 +1。" },
    { name: "丹火续脉", type: "heal", value: 2, text: "触发时回复 2。若本回合火克金成功，额外回复 1。" },
    { name: "火鸦返击", type: "counter", value: 2, text: "反击陷阱。火生土可在土空槽补土攻击，木生火可在木空槽补木系手牌。" },
    { name: "离火破金符", type: "destroy", value: 3, text: "破坏金系永续更强。克制目标时无视阵眼守护。" },
    { name: "离火炼炉", type: "ongoing", value: 4, text: "发动火卡时灼伤 1。木槽存在时火卡更容易爆发。" },
    { name: "焚手赤令", type: "attack", value: 1, text: "可用手牌联协爆发；作为火法诀时焚化手牌换抽火卡。" },
    { name: "土烬新生", type: "counter", value: 1, text: "反击陷阱。对方攻击土空槽时，火生土补入土攻击卡并 +2 灵力。" },
    { name: "薪尽爆燃", type: "destroy", value: 2, text: "焚化手牌拆阵。若目标被破坏，抽 1 张土系卡。" },
    { name: "朱焰献祭", type: "heal", value: 1, text: "回复 1；可焚化 1 张手牌改为抽 2 张火卡。" },
    { name: "燎原空袭", type: "attack", value: 2, text: "打空槽时伤害 +1，但更容易吃护阵反击陷阱。" },
    { name: "焚卷成灰", type: "destroy", value: 1, text: "破坏后令对手弃 1 张手牌；若焚化木系联协，改为弃 2 选 1。" },
    { name: "火土连环", type: "ongoing", value: 3, text: "准备阶段若土槽为空，补 1 张土系手牌；若土槽有卡，则土槽 +1 灵力。" },
    { name: "逆焰返魂", type: "counter", value: 2, text: "反击陷阱。若火被水克，削攻后从灵宝碎片重铸火卡或回复。" },
    { name: "离火借木", type: "attack", value: 2, text: "若有木槽或焚化木手牌，本次攻击 +1，并在结算后抽 1 张火卡。" },
    { name: "赤炉续焰", type: "ongoing", value: 4, text: "每回合首次焚化手牌后，获得 1 灵石。" },
  ],
  earth: [
    { name: "镇岳印", type: "attack", value: 2, text: "土克水。火生土时加灵，克制击破后获得 1 护阵。" },
    { name: "昆仑坠", type: "attack", value: 3, text: "高灵力攻击。土阵周天时，出手后己方关键卡保 1 灵力。" },
    { name: "山河镇杀", type: "attack", value: 3, text: "高灵力土系攻击。消耗火系手卡联协时攻击 +1。" },
    { name: "裂地灵锥", type: "attack", value: 2, text: "稳定攻击，压制水火。目标为水时额外削 1 灵力。" },
    { name: "玄岩盾", type: "defense", value: 2, text: "抵消 2 点伤害。火生土联协时本槽不被消耗。" },
    { name: "地脉回息", type: "heal", value: 1, text: "回复 1，补灵 1。土阵周天时改为补两处。" },
    { name: "崩山反震", type: "counter", value: 1, text: "反击陷阱。土生金可补金势；火生土可回流抽火，土克水则强削攻击。" },
    { name: "崩山符", type: "destroy", value: 2, text: "破坏永续或压阵。土克水目标时额外伤害生命 1。" },
    { name: "厚土归元阵", type: "ongoing", value: 5, text: "中台受伤 -1。五行俱全时保护最低灵力卡。" },
    { name: "炼片成璧", type: "heal", value: 1, text: "炼化灵宝碎片回血；主动发动时若有碎片，获得 1 灵石。" },
    { name: "金胎伏藏", type: "counter", value: 1, text: "反击陷阱。对方攻击金空槽时，土生金补入金攻击卡并 +2 灵力。" },
    { name: "埋玉补山", type: "defense", value: 2, text: "抵消伤害；触发后若有灵宝碎片，己方最低灵力槽 +1。" },
    { name: "地炉开脉", type: "ongoing", value: 4, text: "准备阶段若有灵宝碎片，消耗 1 个碎片获得 1 灵石。" },
    { name: "坤岳回填", type: "heal", value: 2, text: "回复 2，并从灵宝碎片重铸 1 张防守或反击卡。" },
    { name: "镇水断流", type: "attack", value: 2, text: "土克水。击破水系目标后获得 1 灵石并抽 1 张金卡。" },
    { name: "厚土炼阵", type: "destroy", value: 1, text: "炼化碎片镇封敌槽；若目标灵力降为 0，改为破坏。" },
    { name: "山门空壁", type: "counter", value: 2, text: "反击陷阱。空槽护阵时额外抵消 1，并补己方最低灵力槽。" },
    { name: "火种入土", type: "attack", value: 1, text: "若焚化火系手牌联协，本次 +2；攻击后抽 1 张土卡。" },
    { name: "息壤不竭", type: "ongoing", value: 5, text: "灵石补灵时，若灵宝碎片有卡，可额外为相生槽 +1。" },
  ],
  metal: [
    { name: "庚金飞刃", type: "attack", value: 2, text: "金克木。土生金时加灵，击破后可再削敌方一槽 1 灵力。" },
    { name: "破甲剑光", type: "attack", value: 2, text: "无视 1 点防御。消耗土系手卡联协时额外破甲。" },
    { name: "太白斩灵", type: "attack", value: 3, text: "高灵力金系攻击。金阵周天时击破后追加一次斩击。" },
    { name: "百炼剑雨", type: "attack", value: 2, text: "稳定攻击，破木镇土。目标为木时额外 +1 灵力。" },
    { name: "金钟罩", type: "defense", value: 2, text: "抵消 2。土生金联协时获得 1 灵力。" },
    { name: "玉液金丹", type: "heal", value: 2, text: "回复 2 生命。金生水链存在时额外抽 1。" },
    { name: "镜刃反照", type: "counter", value: 1, text: "反击陷阱。金克木强反噬；土生金可补金阵，金生水可引水回流。" },
    { name: "裂器符", type: "destroy", value: 2, text: "破坏永续或压阵。金克木目标时改为破坏后抽 1。" },
    { name: "庚金剑阵", type: "ongoing", value: 4, text: "金攻击首次 +1。水槽存在时金生水，水卡也获势。" },
    { name: "焚契斩灵", type: "destroy", value: 2, text: "焚化手牌削灵；焚化土卡时额外 -1，并令对方失去 1 灵石。" },
    { name: "水刃伏流", type: "counter", value: 1, text: "反击陷阱。对方攻击水空槽时，金生水补入水攻击卡并 +2 灵力。" },
    { name: "白虎夺气", type: "attack", value: 2, text: "金克木。击破木系目标后，对手失去 1 灵石，你抽 1 张水卡。" },
    { name: "碎玉搜水", type: "heal", value: 1, text: "回复 1，并定向抽 1 张水卡；若有土槽，额外获得 1 灵石。" },
    { name: "斩念弃牌", type: "destroy", value: 1, text: "破坏低灵力目标；若破坏成功，对手弃 1 张手牌。" },
    { name: "金水桥", type: "ongoing", value: 3, text: "准备阶段若水槽为空，补 1 张水系手牌；若水槽有卡，则水槽 +1 灵力。" },
    { name: "断木回响", type: "counter", value: 2, text: "反击陷阱。金克木时反噬更强；同源时抽金并蓄势。" },
    { name: "销灵冷锋", type: "attack", value: 1, text: "攻击前削目标 1 灵力；若目标被削破，改为抽 1 张金卡。" },
    { name: "百炼藏锋", type: "defense", value: 2, text: "抵消 2；触发后下一次攻击 +1。" },
    { name: "太白炼片炉", type: "ongoing", value: 4, text: "每次从灵宝碎片重铸后，定向抽 1 张金或水卡。" },
  ],
  water: [
    { name: "寒泉剑气", type: "attack", value: 2, text: "水克火。金生水时加灵，克制击破后回复 1 生命。" },
    { name: "冰魄飞针", type: "attack", value: 2, text: "对火克制更强。消耗金系手卡联协时攻击 +1。" },
    { name: "玄浪吞火", type: "attack", value: 3, text: "高灵力水系攻击。水阵周天时可把伤害转成回复。" },
    { name: "沧海灵刃", type: "attack", value: 2, text: "稳定攻击，克火生木。目标为火时额外回复 1。" },
    { name: "水镜术", type: "defense", value: 1, text: "抵消 1，并回复 1。金生水联协时再抽 1。" },
    { name: "甘霖诀", type: "heal", value: 2, text: "回复 2 生命。若本回合触发相生，额外补灵 1。" },
    { name: "寒潭倒影", type: "counter", value: 1, text: "反击陷阱。水克火强削攻；金生水可回流抽金，水生木可补木阵。" },
    { name: "玄水灭火符", type: "destroy", value: 3, text: "破坏火系永续更强。水克火目标时回复 1。" },
    { name: "寒潭灵脉", type: "ongoing", value: 4, text: "准备阶段为永续补灵 1。木卡发动时，水生木提供阵势。" },
    { name: "沧海重铸", type: "heal", value: 1, text: "回复 1，并从灵宝碎片重铸 1 张水卡；没有水碎片则抽 1 水。" },
    { name: "木舟暗渡", type: "counter", value: 1, text: "反击陷阱。对方攻击木空槽时，水生木补入木攻击卡并 +2 灵力。" },
    { name: "潮汐回手", type: "defense", value: 1, text: "抵消 1；触发后从灵宝碎片重铸 1 张同属性卡。" },
    { name: "冰河滤卷", type: "heal", value: 2, text: "回复 2。可焚化 1 手牌，定向抽 2 张水卡。" },
    { name: "水木生门", type: "ongoing", value: 3, text: "准备阶段若木槽为空，补 1 张木系手牌；若木槽有卡，则木槽 +1 灵力。" },
    { name: "沉珠归海", type: "destroy", value: 1, text: "将敌方低灵力卡化为灵宝碎片；若目标为火，回复 1 并抽水。" },
    { name: "逆浪吞焰", type: "attack", value: 2, text: "水克火。击破火系目标后，从灵宝碎片重铸 1 张水卡。" },
    { name: "镜湖藏牌", type: "counter", value: 2, text: "反击陷阱。相生时补阵或抽牌；同源时抽水并下一击 +1。" },
    { name: "归墟拾遗", type: "heal", value: 1, text: "从灵宝碎片选择 1 张卡回手，并回复 1。" },
    { name: "玄冥续潮", type: "ongoing", value: 4, text: "每回合第一次抽定向水卡时，额外抽 1 张随机卡。" },
  ],
};

const eyePool = [
  { name: "太极玄门", element: "fire", type: "eye", value: 0, text: "五行俱全触发离火焚阵：克制攻击溢出额外 +1。" },
  { name: "五气朝元", element: "wood", type: "eye", value: 0, text: "五行俱全触发万木生息：相生发动后己方最低灵力卡 +1。" },
  { name: "太白剑台", element: "metal", type: "eye", value: 0, text: "五行俱全触发五行归刃：攻击击破后追加 1 点生命伤害。" },
  { name: "后土灵坛", element: "earth", type: "eye", value: 0, text: "五行俱全触发厚土镇岳：本次发动后己方最低灵力卡 +1。" },
  { name: "玄冥水府", element: "water", type: "eye", value: 0, text: "五行俱全触发沧浪回天：首次爆发后回复 2 生命。" },
];

function plainCard(card, element = card.element || "core") {
  return {
    name: card.name,
    element,
    type: card.type,
    value: card.value,
    text: card.text,
  };
}

function allCollectibleCards() {
  return [
    ...FIVE.flatMap((element) => cardPool[element].map((card) => plainCard(card, element))),
    ...eyePool.map((card) => plainCard(card, card.element || "core")),
  ];
}

function initialCollectionCards() {
  return [
    ...FIVE.flatMap((element) => cardPool[element].slice(0, 9).map((card) => plainCard(card, element))),
    ...eyePool.map((card) => plainCard(card, card.element || "core")),
  ];
}

function collectibleKey(card) {
  return `${card.element || "core"}:${card.name}`;
}

function initialDeckMap() {
  return cardsToCountMap(initialCollectionCards());
}

function cardsToCountMap(cards) {
  return cards.reduce((map, card) => {
    const key = collectibleKey(card);
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
}

function cardByKey(key) {
  const catalog = allCollectibleCards();
  return catalog.find((card) => collectibleKey(card) === key) || null;
}

function drawBoosterCards(count = 5) {
  const catalog = allCollectibleCards();
  return Array.from({ length: count }, () => catalog[Math.floor(Math.random() * catalog.length)]);
}

function countMapTotal(map = {}) {
  return Object.values(map).reduce((sum, count) => sum + Number(count || 0), 0);
}

function expandCardMap(map = {}) {
  const cards = [];
  Object.entries(map).forEach(([key, count]) => {
    const card = cardByKey(key);
    if (!card) return;
    for (let i = 0; i < Number(count || 0); i += 1) cards.push(plainCard(card, card.element));
  });
  return cards;
}

function shuffled(cards) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function deckIssues(deck = {}) {
  const total = countMapTotal(deck);
  const issues = [];
  if (total < DECK_RULES.min) issues.push(`至少 ${DECK_RULES.min} 张`);
  if (total > DECK_RULES.max) issues.push(`最多 ${DECK_RULES.max} 张`);
  const eyeCount = Object.entries(deck).reduce((sum, [key, count]) => {
    const card = cardByKey(key);
    return sum + (card?.type === "eye" ? Number(count || 0) : 0);
  }, 0);
  if (eyeCount < DECK_RULES.minEye) issues.push(`阵眼至少 ${DECK_RULES.minEye} 张`);
  FIVE.forEach((element) => {
    const amount = Object.entries(deck).reduce((sum, [key, count]) => {
      const card = cardByKey(key);
      return sum + (card?.element === element ? Number(count || 0) : 0);
    }, 0);
    if (amount < DECK_RULES.minPerElement) issues.push(`${LABEL[element]}系至少 ${DECK_RULES.minPerElement} 张`);
  });
  return issues;
}

function isDeckValid(deck = {}) {
  return deckIssues(deck).length === 0;
}

const state = {
  round: 1,
  active: "player",
  phase: "prepare",
  selected: null,
  selectedHand: null,
  hasActed: false,
  hasImbued: false,
  hasSpellCast: false,
  turnDamage: { player: 0, enemy: 0 },
  pendingSpell: null,
  currentAttackSlot: null,
  pendingTutorialTarget: null,
  tutorial: null,
  winner: null,
  resultShown: false,
  player: createSide("玩家"),
  enemy: createSide("对手"),
};

let gameStarted = false;
let lastCardTap = { key: "", time: 0 };

const logState = {
  queue: [],
  busy: false,
  waiters: [],
};

const aiState = {
  failedThisTurn: false,
  lastTauntAt: 0,
  tauntInFlight: false,
};

const authState = {
  user: null,
  mode: "login",
};

const playerDataState = {
  profile: null,
  loading: false,
  deckDraft: {},
  deckSource: "owned",
  deckFilters: {
    element: "all",
    type: "all",
  },
};

function createSide(name) {
  return {
    name,
    hp: START_HP,
    stones: 0,
    hand: [],
    discard: [],
    drawPile: [],
    tempAttackBoost: 0,
    tideSurged: false,
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
  const weightedPool = pool.flatMap((card) => Array.from({ length: DRAW_WEIGHT[card.type] || 1 }, () => card));
  return cloneCard(weightedPool[Math.floor(Math.random() * weightedPool.length)], element);
}

function drawEye() {
  return cloneCard(eyePool[Math.floor(Math.random() * eyePool.length)], "core");
}

function preparePlayerDeck() {
  const deck = playerDataState.profile?.deck && isDeckValid(playerDataState.profile.deck)
    ? playerDataState.profile.deck
    : null;
  state.player.drawPile = deck ? shuffled(expandCardMap(deck)) : [];
}

function drawFromPlayerDeck(predicate = () => true) {
  if (!state.player.drawPile.length) return null;
  const index = state.player.drawPile.findIndex(predicate);
  if (index < 0) return null;
  const [card] = state.player.drawPile.splice(index, 1);
  return cloneCard(card, card.element || "core");
}

function drawSideCard(side, element = randomFive()) {
  if (side === state.player && state.player.drawPile.length) {
    const deckCard = drawFromPlayerDeck((card) => {
      if (element === "core") return true;
      return card.element === element && card.type !== "eye";
    });
    if (deckCard) return deckCard;
  }
  return drawCard(element === "core" ? randomFive() : element);
}

function cardArtKey(card) {
  return `${card.element || "core"}:${card.name}`;
}

function cardArtUrl(card) {
  const file = CARD_ART[cardArtKey(card)];
  return file ? `./assets/cards/${file}` : "";
}

async function loadCardArtManifest() {
  try {
    const response = await fetch("./assets/cards/manifest.json", { cache: "no-cache" });
    if (!response.ok) return;
    const cards = await response.json();
    cards.forEach((card) => {
      CARD_ART[`${card.element}:${card.name}`] = card.filename;
    });
    if (gameStarted) render();
  } catch {
    // Card art is optional; the game keeps the text-card layout if assets are not generated yet.
  }
}

function setup() {
  resetState();
  state.tutorial = null;
  preparePlayerDeck();
  for (const sideKey of ["player", "enemy"]) {
    const side = state[sideKey];
    for (const element of FIVE) drawIntoSlot(side, sideKey, element);
    drawIntoSlot(side, sideKey, "core");
    for (let i = 0; i < 5; i += 1) drawToHand(side);
  }
  log("战局展开。双方填满六槽，并各自获得 5 张手卡。");
  startTurn("player");
}

function setupTutorial() {
  resetState();
  state.tutorial = {
    step: 0,
    complete: false,
  };
  state.player.hp = START_HP;
  state.enemy.hp = 28;
  state.player.stones = 1;
  state.enemy.stones = 0;
  state.phase = "main1";
  state.active = "player";
  state.player.board.wood = createSlot(cloneCard({ name: "青木灵泉", type: "ongoing", value: 4, text: "准备阶段回复 1。火槽攻击时，木生火提供阵势 +1。" }, "wood"), "wood", "player");
  state.player.board.fire = createSlot(cloneCard({ name: "赤霄火剑", type: "attack", value: 2, text: "火克金。木生火会为火槽攻击提供阵势。" }, "fire"), "fire", "player");
  state.player.board.earth = createSlot(cloneCard({ name: "玄岩盾", type: "defense", value: 2, text: "抵消 2 点伤害。" }, "earth"), "earth", "player", true);
  state.player.board.metal = createSlot(cloneCard({ name: "玉液金丹", type: "heal", value: 2, text: "回复 2 生命。" }, "metal"), "metal", "player", true);
  state.player.board.water = createSlot(cloneCard({ name: "水镜术", type: "defense", value: 1, text: "抵消 1，并回复 1。" }, "water"), "water", "player", true);
  state.player.board.core = createSlot(cloneCard({ name: "五气朝元", element: "wood", type: "eye", value: 0, text: "五行俱全触发万木生息：相生发动后己方最低灵力卡 +1。" }, "core"), "core", "player");
  state.enemy.board.metal = createSlot(cloneCard({ name: "庚金试剑台", type: "attack", value: 4, text: "训练用金系攻击位。火克金会造成明显伤害，但不会立刻结束教程。" }, "metal"), "metal", "enemy");
  state.enemy.board.wood = createSlot(cloneCard({ name: "青藤剑诀", type: "attack", value: 2, text: "木克土。攻击位会与来袭攻击灵力相减。" }, "wood"), "wood", "enemy");
  state.enemy.board.fire = createSlot(cloneCard({ name: "烈焰护体", type: "defense", value: 1, text: "抵消 1，并可反击。" }, "fire"), "fire", "enemy", true);
  state.enemy.board.water = createSlot(cloneCard({ name: "寒潭灵脉", type: "ongoing", value: 3, text: "准备阶段为永续补灵 1。" }, "water"), "water", "enemy");
  state.enemy.board.core = createSlot(cloneCard({ name: "太白剑台", element: "metal", type: "eye", value: 0, text: "压制时销毁阵眼更强。" }, "core"), "core", "enemy");
  state.player.hand = [
    cloneCard({ name: "朱雀焚阵", type: "attack", value: 3, text: "高灵力火系攻击。可替换火槽攻击位，也可放中台。" }, "fire"),
    cloneCard({ name: "斩根符", type: "destroy", value: 2, text: "破坏永续、压阵或阵眼。" }, "wood"),
    cloneCard({ name: "寒潭倒影", type: "counter", value: 1, text: "抵消 1，反击 1。" }, "water"),
    cloneCard({ name: "丹火续脉", type: "heal", value: 2, text: "触发时回复 2。可作为同源法诀辅助火攻击。" }, "fire"),
    cloneCard({ name: "玄水灭火符", type: "destroy", value: 3, text: "破坏火系永续更强。销毁卡可选择任意有卡阵位。" }, "water"),
    cloneCard({ name: "庚金剑阵", type: "ongoing", value: 4, text: "金攻击首次 +1。永续会一直占槽。" }, "metal"),
  ];
  state.enemy.hand = [drawCard("metal"), drawCard("water"), drawCard("earth")];
  state.selected = null;
  log("新手关卡开始：跟随目标完成一次火克金爆发，再在主2打出手牌法诀。");
  render();
}

function resetState() {
  state.round = 1;
  state.active = "player";
  state.phase = "prepare";
  state.selected = null;
  state.selectedHand = null;
  state.hasActed = false;
  state.hasImbued = false;
  state.hasSpellCast = false;
  state.turnDamage = { player: 0, enemy: 0 };
  state.pendingSpell = null;
  state.currentAttackSlot = null;
  state.pendingTutorialTarget = null;
  state.tutorial = null;
  state.winner = null;
  state.resultShown = false;
  state.player = createSide("玩家");
  state.enemy = createSide("对手");
  hideResultScreen();
  aiState.failedThisTurn = false;
  logState.queue = [];
  logState.busy = false;
  logState.waiters.splice(0).forEach((resolve) => resolve());
  const logNode = document.querySelector("#log");
  if (logNode) logNode.innerHTML = "";
}

function randomFive() {
  return FIVE[Math.floor(Math.random() * FIVE.length)];
}

const TUTORIAL_STEPS = [
  {
    title: "认识阵盘",
    goal: "点己方火槽卡片上的“查看卡片”",
    hint: "下方是你的阵盘，卡片正向；上方是对手阵盘，卡片会倒向对手视角。先看懂一张己方卡。",
    focus: { owner: "player", slot: "fire", detail: true },
  },
  {
    title: "选择手牌",
    goal: "点手牌“朱雀焚阵”，再点己方火槽",
    hint: "点手牌只是选中，点卡槽只是选目标；真正放置要等下一步点底部“放置”。",
    focus: { handName: "朱雀焚阵", owner: "player", slot: "fire", buttons: ["replaceBtn"] },
  },
  {
    title: "补灵蓄势",
    goal: "选中火槽，然后点“补灵”",
    hint: "灵石会补进卡槽成为灵力。训练关先给你 1 枚灵石，把朱雀焚阵养到刚好能打出克制感。",
    focus: { owner: "player", slot: "fire", buttons: ["imbueBtn"] },
  },
  {
    title: "进入发动",
    goal: "点“下一阶段”进入发动阶段",
    hint: "一回合只有发动阶段能主动发动一个卡槽效果。",
    focus: { buttons: ["endBtn"] },
  },
  {
    title: "发动火槽",
    goal: "选中火槽，点“发动”",
    hint: "你的火槽在下方正向阵盘。发动火攻击后，下一步去上方倒置阵盘里选对手金槽。",
    focus: { owner: "player", slot: "fire", buttons: ["activateBtn"] },
  },
  {
    title: "火克金爆发",
    goal: "选择对手金槽作为目标",
    hint: "对手阵盘是倒向对手视角的布局，金槽在上方阵盘里。攻击克制目标会翻倍，但训练靶会保留生命让教程继续。",
    focus: { owner: "enemy", slot: "metal" },
  },
  {
    title: "进入主2",
    goal: "点“下一阶段”进入主2",
    hint: "发动后不会立刻结束，主2还能继续调整阵位或消耗手牌。",
    focus: { buttons: ["endBtn"] },
  },
  {
    title: "主2打法诀",
    goal: "选一张手牌，点“法诀”",
    hint: "手牌不只用来放置，也能直接打出五行法诀。点手牌效果文字可看详情，双击手牌也能看详情。",
    focus: { handAny: true, buttons: ["spellBtn"] },
  },
  {
    title: "完成训练",
    goal: "点“下一阶段/结束回合”，开始自由对战",
    hint: "你已经完成核心节奏：布阵、补灵、克制攻击、主2调整和直接打法诀。",
    focus: { buttons: ["endBtn"] },
  },
];

function tutorialData() {
  return state.tutorial;
}

function tutorialStep(index = tutorialData()?.step || 0) {
  return TUTORIAL_STEPS[Math.min(index, TUTORIAL_STEPS.length - 1)];
}

function tutorialHintText() {
  if (!tutorialData()) return "";
  const step = tutorialStep();
  return `${step.title}：${tutorialGoalText(step)}`;
}

function tutorialGoalText(step = tutorialStep()) {
  if (tutorialData()?.step === 1) {
    const selected = getSelectedHandCard();
    if (!selected || selected.card.name !== "朱雀焚阵") return "先点手牌“朱雀焚阵”";
    if (state.selected !== "fire") return "再点己方火槽作为目标";
    return "最后点底部“放置”确认";
  }
  return step.goal;
}

function showTutorialStep(index = tutorialData()?.step || 0, force = false) {
  const tutorial = tutorialData();
  if (!tutorial) return;
  const bounded = Math.max(0, Math.min(index, TUTORIAL_STEPS.length - 1));
  tutorial.step = Math.max(tutorial.step, bounded);
  if (force) showToast(`${tutorialGoalText(tutorialStep(tutorial.step))}｜${tutorialStep(tutorial.step).hint}`, "log-system", "minor");
}

function completeTutorialStep(expectedStep, nextStep) {
  const tutorial = tutorialData();
  if (!tutorial || tutorial.step !== expectedStep) return;
  tutorial.step = Math.min(nextStep, TUTORIAL_STEPS.length - 1);
  showToast(`目标完成：${tutorialStep(expectedStep).title}`, "log-system", "minor");
  render();
}

function finishTutorial() {
  if (!state.tutorial) return;
  state.tutorial.complete = true;
  state.tutorial = null;
  state.pendingTutorialTarget = null;
  hideTutorialGuide();
  showToast("新手训练完成，进入自由对战。", "log-system", "minor");
}

function tutorialFocusMatches({ owner, slot, buttonId, handName, handAny, detail = false }) {
  const step = tutorialData() ? tutorialStep() : null;
  const focus = step?.focus || {};
  if (!focus) return false;
  if (owner && focus.owner !== owner) return false;
  if (slot && focus.slot !== slot) return false;
  if (detail && !focus.detail) return false;
  if (buttonId && !(focus.buttons || []).includes(buttonId)) return false;
  if (handName && focus.handName !== handName) return false;
  if (handAny && !focus.handAny) return false;
  return true;
}

function countAttack(side) {
  return Object.values(side.board).filter((slot) => slot?.mode === "attack").length;
}

function countDefense(side) {
  return Object.values(side.board).filter((slot) => slot?.mode === "defense" && !["heal", "ongoing"].includes(slot.card.type)).length;
}

function placementLane(card) {
  if (card.type === "eye") return "eye";
  if (card.type === "attack") return "attack";
  if (card.type === "heal" || card.type === "ongoing") return "support";
  return "defense";
}

function laneLimitMessage(card) {
  const lane = placementLane(card);
  if (lane === "attack") return `攻击位已有 3 张，无法放置${card.name}。`;
  if (lane === "defense") return `伏阵位已有 3 张，无法放置${card.name}。`;
  return `无法放置${card.name}。`;
}

function laneLabel(lane) {
  if (lane === "attack") return "攻击";
  if (lane === "defense") return "伏阵";
  if (lane === "support") return "支援";
  if (lane === "eye") return "阵眼";
  return "卡";
}

function slotLane(slotState) {
  if (!slotState) return null;
  if (slotState.mode === "attack") return "attack";
  if (slotState.card.type === "heal" || slotState.mode === "ongoing") return "support";
  if (slotState.mode === "defense") return "defense";
  return slotState.mode;
}

function placeTargets(side, card) {
  const lane = placementLane(card);
  if (lane === "eye") return canPlaceCardAt(side, card, "core") ? ["core"] : [];
  const candidates = new Set([card.element, "core"]);
  return [...candidates].filter((slot) => {
    return canPlaceCardAt(side, card, slot);
  });
}

function canPlaceIntoLane(side, card, slot) {
  const oldSlot = side.board[slot];
  const lane = placementLane(card);
  if (lane === "eye") return true;
  if (slotLane(oldSlot) === lane) return true;
  if (lane === "attack") return countAttack(side) - (oldSlot?.mode === "attack" ? 1 : 0) < 3;
  if (lane === "support") return true;
  const replacesDefense = slotLane(oldSlot) === "defense";
  return countDefense(side) - (replacesDefense ? 1 : 0) < 3;
}

function isSlotAllowedForCard(card, slot) {
  if (card.type === "eye") return slot === "core";
  return slot === card.element || slot === "core";
}

function canPlaceCardAt(side, card, slot) {
  return Boolean(card && ELEMENTS.includes(slot) && isSlotAllowedForCard(card, slot) && canPlaceIntoLane(side, card, slot));
}

function placeSlotReason(side, card, slot) {
  const oldSlot = side.board[slot];
  const lane = placementLane(card);
  if (card.type === "eye" && slot !== "core") return "阵眼只能放入中台";
  if (card.type !== "eye" && ![card.element, "core"].includes(slot)) return `只能放入${LABEL[card.element]}槽或中台`;
  if (slotLane(oldSlot) === lane) return `替换已有${laneLabel(lane)}位`;
  if (lane === "support" && canPlaceCardAt(side, card, slot)) return oldSlot ? "替换为支援位，不占攻防名额" : "支援位不占攻防名额";
  if (canPlaceCardAt(side, card, slot)) return oldSlot ? `替换后不超过三${laneLabel(lane)}` : `放置后不超过三${laneLabel(lane)}`;
  return `${laneLabel(lane)}位已有 3 张，不能新增`;
}

function placeChoices(side, card) {
  const slots = card.type === "eye" ? ["core"] : [card.element, "core"];
  return slots.map((slot) => {
    const oldSlot = side.board[slot];
    const legal = canPlaceCardAt(side, card, slot);
    const action = oldSlot ? `替换${oldSlot.card.name}` : "空槽";
    const reason = placeSlotReason(side, card, slot);
    return {
      label: `${LABEL[slot]}槽：${action}（${reason}）`,
      value: slot,
      disabled: !legal,
    };
  });
}

function placeFailureText(side, card) {
  const choices = placeChoices(side, card);
  const enabled = choices.filter((choice) => !choice.disabled);
  if (enabled.length > 0) return "";
  const lane = placementLane(card);
  if (lane === "eye") return `${card.name}只能放入中台；当前中台不可替换。`;
  const laneFull = lane === "attack" ? countAttack(side) >= 3 : lane === "defense" && countDefense(side) >= 3;
  if (laneFull) return `${laneLabel(lane)}位已有 3 张，${card.name}只能替换已有${laneLabel(lane)}位，不能放入空槽或不同类型槽。`;
  return `${card.name}只能放入${LABEL[card.element]}槽或中台。`;
}

function placeDialogText(side, card, choices) {
  const base = `${card.name}只能放入${card.type === "eye" ? "中台" : LABEL[card.element] + "槽或中台"}；攻击卡最多 3 张，防守/反击/销毁最多 3 张，恢复和永续不占攻防名额。`;
  const counts = `当前攻击位 ${countAttack(side)}/3，伏阵位 ${countDefense(side)}/3。`;
  if (choices.some((choice) => !choice.disabled)) return `${base} ${counts}`;
  return `${base} ${counts} 当前没有合法位置，请看灰色选项里的原因。`;
}

function placePrompt(card, targets) {
  const lane = placementLane(card);
  const replacementOnly = lane === "attack"
    ? countAttack(state.player) >= 3
    : lane === "defense" && countDefense(state.player) >= 3;
  if (replacementOnly) {
    return `${lane === "attack" ? "攻击位" : "伏阵位"}已有 3 张，${card.name}只能替换已有${lane === "attack" ? "攻击" : "伏阵"}位。`;
  }
  return `${card.name}只能放入${LABEL[card.element]}槽或中台；中台只能表侧。`;
}

function drawFillCard(side, slot) {
  if (side === state.player && state.player.drawPile.length) {
    const deckCard = drawFromPlayerDeck((card) => canPlaceCardAt(side, card, slot));
    if (deckCard) return deckCard;
  }
  if (slot === "core" && Math.random() < 0.25) return drawEye();
  const element = slot === "core" ? randomFive() : slot;
  for (let i = 0; i < 24; i += 1) {
    const card = drawCard(element);
    if (canPlaceCardAt(side, card, slot)) return card;
  }
  const fallback = cardPool[element].find((card) => canPlaceCardAt(side, { ...card, element }, slot));
  return fallback ? cloneCard(fallback, element) : drawCard(element);
}

function drawIntoSlot(side, sideKey, slot) {
  const card = drawFillCard(side, slot);
  side.board[slot] = createSlot(card, slot, sideKey);
}

function drawToHand(side) {
  side.hand.push(drawSideCard(side, randomFive()));
}

function hasOngoing(side, namePart) {
  return Object.values(side.board).some((slot) => slot?.mode === "ongoing" && slot.card.name.includes(namePart));
}

function takeFragment(side, predicate = () => true) {
  const index = side.discard.findIndex(predicate);
  if (index < 0) return null;
  const [card] = side.discard.splice(index, 1);
  return card || null;
}

function recoverFragmentToHand(side, predicate = () => true) {
  const card = takeFragment(side, predicate);
  if (!card) return null;
  side.hand.push(card);
  afterRecoverFragment(side, card);
  return card;
}

function afterRecoverFragment(side, card) {
  if (hasOngoing(side, "万象萌动")) {
    const boosted = boostLowestSpirit(side, 1);
    if (boosted) log(`${side.name}的万象萌动回应重铸，${LABEL[boosted.slot]}槽 +1 灵力。`);
  }
  if (hasOngoing(side, "太白炼片炉")) {
    drawElementToHand(side, Math.random() < 0.5 ? "metal" : "water", "太白炼片炉");
    log(`${side.name}的太白炼片炉回应${card.name}重铸，定向补 1 张金/水卡。`);
  }
}

function loseStones(side, amount = 1) {
  const loss = Math.min(side.stones, amount);
  side.stones -= loss;
  return loss;
}

function boostSlotIfPresent(side, slot, amount = 1) {
  const target = side.board[slot];
  if (!target || target.mode === "eye") return false;
  target.stones += amount;
  floatSlot(sideKeyOf(side), slot, amount);
  return true;
}

function drawElementToHand(side, element, reason = "") {
  side.hand.push(drawSideCard(side, element));
  if (element === "water" && hasOngoing(side, "玄冥续潮") && !side.tideSurged) {
    side.tideSurged = true;
    drawToHand(side);
    log(`${side.name}的玄冥续潮回应定向水抽，额外抽 1 张随机手卡${reason ? `（${reason}）` : ""}。`);
  }
}

function discardCard(side, card) {
  if (!card) return;
  side.discard.push(card);
}

function removeSlot(side, slot) {
  const slotState = side.board[slot];
  if (!slotState) return null;
  side.board[slot] = null;
  discardCard(side, slotState.card);
  return slotState;
}

function discardHandCard(side, index) {
  const [card] = side.hand.splice(index, 1);
  discardCard(side, card);
  return card || null;
}

function sideKeyOf(side) {
  return side === state.player ? "player" : "enemy";
}

function changeHp(side, amount) {
  if (!amount) return;
  const sideKey = sideKeyOf(side);
  if (amount < 0) {
    side.hp += amount;
    state.turnDamage[sideKey] = (state.turnDamage[sideKey] || 0) + Math.abs(amount);
  } else {
    side.hp = Math.min(MAX_HP, side.hp + amount);
  }
  floatHp(sideKey, amount);
}

function startTurn(sideKey) {
  state.active = sideKey;
  state.phase = "prepare";
  state.hasActed = false;
  state.hasImbued = false;
  state.hasSpellCast = false;
  state.pendingSpell = null;
  state.turnDamage[sideKey] = 0;
  state.selected = null;
  state.selectedHand = null;
  const side = state[sideKey];
  side.tideSurged = false;
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
      changeHp(side, 1);
      log(`${side.name}的${slot.card.name}回复 1 生命。`);
    }
    if (slot.card.name.includes("寒潭")) {
      const target = Object.values(side.board).find((s) => s?.mode === "ongoing" && s.hp < s.maxHp);
      if (target) target.hp += 1;
    }
    if (slot.card.name.includes("灵根搜火")) {
      const fragment = takeFragment(side);
      if (fragment) {
        const element = generatedElementOfCard(fragment);
        drawElementToHand(side, element, "灵根搜火");
        log(`${side.name}的${slot.card.name}炼化${fragment.name}，定向抽 1 张${LABEL[element]}系卡。`);
      }
    }
    if (slot.card.name.includes("地炉开脉")) {
      const fragment = takeFragment(side);
      if (fragment) {
        side.stones += 1;
        log(`${side.name}的${slot.card.name}炼化${fragment.name}，获得 1 枚灵石。`);
      }
    }
    if (slot.card.name.includes("火土连环")) {
      if (side.board.earth) {
        boostSlotIfPresent(side, "earth", 1);
        log(`${side.name}的${slot.card.name}为土槽补充 1 灵力。`);
      } else {
        drawElementToHand(side, "earth");
        log(`${side.name}的${slot.card.name}补入 1 张土系手牌。`);
      }
    }
    if (slot.card.name.includes("金水桥")) {
      if (side.board.water) {
        boostSlotIfPresent(side, "water", 1);
        log(`${side.name}的${slot.card.name}为水槽补充 1 灵力。`);
      } else {
        drawElementToHand(side, "water", "金水桥");
        log(`${side.name}的${slot.card.name}补入 1 张水系手牌。`);
      }
    }
    if (slot.card.name.includes("水木生门")) {
      if (side.board.wood) {
        boostSlotIfPresent(side, "wood", 1);
        log(`${side.name}的${slot.card.name}为木槽补充 1 灵力。`);
      } else {
        drawElementToHand(side, "wood");
        log(`${side.name}的${slot.card.name}补入 1 张木系手牌。`);
      }
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

function generatorOf(element) {
  return FIVE.find((candidate) => GENERATES[candidate] === element);
}

function hasFaceCard(side, element) {
  const slot = side.board[element];
  return Boolean(slot && !slot.faceDown);
}

function hasFullFive(side) {
  return FIVE.every((element) => Boolean(side.board[element]));
}

function lowestSpiritSlot(side) {
  return FIVE
    .map((slot) => ({ slot, slotState: side.board[slot] }))
    .filter(({ slotState }) => slotState && slotState.mode !== "eye")
    .sort((a, b) => (a.slotState.hp + a.slotState.stones) - (b.slotState.hp + b.slotState.stones))[0] || null;
}

function boostLowestSpirit(side, amount = 1) {
  const target = lowestSpiritSlot(side);
  if (!target) return null;
  target.slotState.stones += amount;
  return target;
}

function hasEyePressure(side, opponent) {
  const a = side.board.core?.card;
  const b = opponent.board.core?.card;
  if (a?.type !== "eye" || b?.type !== "eye") return false;
  if (a.element === b.element) return false;
  return OVERCOME[a.element] === b.element || GENERATES[b.element] === a.element;
}

function formationBonus(side, element, sourceSlot) {
  let bonus = 0;
  const reasons = [];
  const generator = generatorOf(element);
  const generated = GENERATES[element];
  if (generator && side.board[generator]) {
    bonus += 1;
    reasons.push(`${LABEL[generator]}生${LABEL[element]}`);
  }
  if (generated && side.board[generated]?.mode !== "attack") {
    bonus += 1;
    reasons.push(`${LABEL[element]}生${LABEL[generated]}`);
  }
  const core = side.board.core;
  if (sourceSlot !== "core" && core?.mode === "eye" && (core.card.element === element || GENERATES[core.card.element] === element)) {
    bonus += 1;
    reasons.push("阵眼共鸣");
  }
  return { bonus, reasons };
}

function buildActionContext(side, opponent, card, sourceSlot, targetSlot, handAssist = null) {
  const target = opponent.board[targetSlot];
  const formation = formationBonus(side, card.element, sourceSlot);
  const generator = generatorOf(card.element);
  const generated = GENERATES[card.element];
  const hasCycle = hasFullFive(side);
  const eye = side.board.core?.mode === "eye" ? side.board.core.card : null;
  const overcome = Boolean(target && isOvercome(card.element, target.card.element));
  const sameElement = Boolean(target && card.element === target.card.element);
  const handBonus = handAssist ? handAssist.bonus : 0;
  const handReason = handAssist ? handAssist.reason : "";
  let spellBonus = 0;
  let spellReason = "";
  if (side === state.player && state.pendingSpell?.type === "fire" && card.type === "attack") {
    spellBonus = (state.pendingSpell.bonus || 1) + (target && isOvercome(card.element, target.card.element) ? (state.pendingSpell.overcomeBonus || 0) : 0);
    spellReason = `火法诀·燃 +${spellBonus}`;
  }
  const reasons = [...formation.reasons];
  if (handReason) reasons.push(handReason);
  if (spellReason) reasons.push(spellReason);
  if (side.tempAttackBoost && card.type === "attack") {
    spellBonus += side.tempAttackBoost;
    reasons.push(`陷阱蓄势 +${side.tempAttackBoost}`);
  }
  if (hasCycle && eye) reasons.push(`${CYCLE_POWER[eye.element] || "五行周天"}`);
  return {
    target,
    formation,
    generator,
    generated,
    hasCycle,
    eye,
    overcome,
    sameElement,
    handAssist,
    handBonus,
    spellBonus,
    spellReason,
    bonus: formation.bonus + handBonus + spellBonus,
    reasons,
  };
}

function handAssistOptions(side, opponent, card, targetSlot) {
  if (card.type !== "attack" && card.type !== "destroy") return [];
  return side.hand
    .map((handCard, index) => {
      if (handCard.id === card.id) return null;
      const sourceElement = generatorOf(card.element);
      const targetElement = opponent.board[targetSlot]?.card.element;
      let bonus = 0;
      let reason = "";
      if (handCard.element === sourceElement) {
        bonus = 1;
        reason = `${LABEL[handCard.element]}生${LABEL[card.element]}手牌联协`;
      } else if (handCard.element === card.element) {
        bonus = card.type === "attack" ? 1 : 0;
        reason = `${LABEL[handCard.element]}同源共鸣`;
      } else if (targetElement && isOvercome(handCard.element, targetElement)) {
        bonus = 1;
        reason = `${LABEL[handCard.element]}压制${LABEL[targetElement]}手牌联协`;
      }
      if (bonus <= 0) return null;
      return {
        index,
        card: handCard,
        bonus,
        reason,
        label: `消耗${handCard.name}：${reason}，本次 +${bonus} 灵力`,
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

async function askHandAssist(side, opponent, card, targetSlot, sourceSlot = card.element) {
  if (side !== state.player) return chooseEnemyHandAssist(side, opponent, card, targetSlot, sourceSlot);
  if (shouldSkipHandAssistForTutorial(card, targetSlot)) return null;
  const options = handAssistOptions(side, opponent, card, targetSlot);
  if (options.length === 0) return null;
  const picked = await askTrigger({
    title: "手牌法诀联协",
    text: `发动${card.name}前，可消耗一张手卡借五行生克增幅。本次不会额外发动攻击卡，只提供联协加成。`,
    options: [
      ...options.map((option) => ({ label: option.label, value: option.index })),
      { label: "不使用手牌联协", value: null },
    ],
    cancelLabel: "不使用",
    cancelValue: null,
  });
  if (picked == null) return null;
  const option = options.find((item) => item.index === picked);
  if (!option) return null;
  const used = discardHandCard(side, option.index);
  log(`玩家消耗手卡${used.name}，触发${option.reason}。`);
  return option;
}

function shouldSkipHandAssistForTutorial(card, targetSlot) {
  return state.tutorial?.step === 5 && card.name === "朱雀焚阵" && targetSlot === "metal";
}

function chooseEnemyHandAssist(side, opponent, card, targetSlot, sourceSlot = card.element) {
  const options = handAssistOptions(side, opponent, card, targetSlot);
  if (options.length === 0) return null;
  const target = opponent.board[targetSlot];
  const best = [...options].sort((a, b) => b.bonus - a.bonus)[0];
  const current = buildActionContext(side, opponent, card, sourceSlot, targetSlot, null);
  const base = card.value + current.bonus;
  const spirit = base + best.bonus;
  const useful = !target
    || target.mode !== "attack"
    || spirit * attackScale(card.element, target.card.element) > slotSpirit(target) * attackScale(target.card.element, card.element);
  if (!useful && side.hand.length <= 3) return null;
  const used = discardHandCard(side, best.index);
  log(`对手消耗手卡${LABEL[used.element]}系法诀，触发${best.reason}。`);
  return best;
}

function applyCyclePower(side, opponent, card, targetSlot, context, destroyed, overflow) {
  if (!context.hasCycle || !context.eye) return 0;
  let extraDamage = 0;
  const eyeElement = context.eye.element;
  const powerName = CYCLE_POWER[eyeElement] || "五行周天";
  if (eyeElement === "fire" && context.overcome && overflow > 0) {
    extraDamage = 1;
    changeHp(opponent, -extraDamage);
    playElementVfx(opponent === state.enemy ? "enemy" : "player", targetSlot, "array", "fire");
    playFullScreenVfx("fire", powerName, "array");
    log(`周天阵眼·${powerName}：克制溢出再灼伤 ${extraDamage} 生命。`);
  } else if (eyeElement === "metal" && card.type === "attack" && destroyed) {
    extraDamage = 1;
    changeHp(opponent, -extraDamage);
    playElementVfx(opponent === state.enemy ? "enemy" : "player", targetSlot, "array", "metal");
    playFullScreenVfx("metal", powerName, "array");
    log(`周天阵眼·${powerName}：破阵后追加斩击 ${extraDamage} 生命。`);
  } else if (eyeElement === "wood" && context.formation.bonus > 0) {
    const boosted = boostLowestSpirit(side, 1);
    if (boosted) {
      playElementVfx(side === state.player ? "player" : "enemy", boosted.slot, "array", "wood");
      playFullScreenVfx("wood", powerName, "array");
      log(`周天阵眼·${powerName}：${LABEL[boosted.slot]}槽补充 1 灵力。`);
    }
  } else if (eyeElement === "water" && (context.overcome || context.formation.bonus > 0)) {
    changeHp(side, 2);
    playElementVfx(side === state.player ? "player" : "enemy", "core", "array", "water");
    playFullScreenVfx("water", powerName, "array");
    log(`周天阵眼·${powerName}：阵势回流，回复 2 生命。`);
  } else if (eyeElement === "earth") {
    const boosted = boostLowestSpirit(side, 1);
    if (boosted) {
      playElementVfx(side === state.player ? "player" : "enemy", boosted.slot, "array", "earth");
      playFullScreenVfx("earth", powerName, "array");
      log(`周天阵眼·${powerName}：厚土护阵，${LABEL[boosted.slot]}槽补充 1 灵力。`);
    }
  }
  if (extraDamage > 0) pulsePower();
  return extraDamage;
}

function applyAttackAftermath(side, opponent, card, targetCard, result, context) {
  if (!result.destroyed || !targetCard) {
    if (card.name.includes("木火引线") && context.formation.bonus > 0) {
      drawElementToHand(side, "fire");
      log(`${card.name}借木火引线，攻击后抽 1 张火系卡。`);
    }
    return;
  }
  if (card.name.includes("镇水断流") && targetCard.element === "water") {
    side.stones += 1;
    drawElementToHand(side, "metal");
    log(`${card.name}镇断水脉，获得 1 灵石并抽 1 张金系卡。`);
  }
  if (card.name.includes("白虎夺气") && targetCard.element === "wood") {
    const loss = loseStones(opponent, 1);
    drawElementToHand(side, "water", "白虎夺气");
    log(`${card.name}夺走木气${loss ? "，对手失去 1 灵石" : ""}，并抽 1 张水系卡。`);
  }
  if (card.name.includes("逆浪吞焰") && targetCard.element === "fire") {
    const recovered = recoverFragmentToHand(side, (fragment) => fragment.element === "water");
    if (recovered) log(`${card.name}吞焰回潮，从灵宝碎片重铸${recovered.name}。`);
  }
  if (card.name.includes("离火借木") && (context.formation.bonus > 0 || context.handAssist?.card.element === "wood")) {
    drawElementToHand(side, "fire");
    log(`${card.name}借木续焰，攻击后抽 1 张火系卡。`);
  }
}

function applyHealAftermath(side, card) {
  if (card.name.includes("引火灵芽")) {
    drawElementToHand(side, "fire");
    log(`${card.name}引火萌发，定向抽 1 张火系卡。`);
  }
  if (card.name.includes("枯荣返青")) {
    const recovered = recoverFragmentToHand(side, (fragment) => fragment.element === "wood");
    if (recovered) log(`${card.name}枯荣返青，重铸${recovered.name}。`);
  }
  if (card.name.includes("炼片成璧")) {
    const fragment = takeFragment(side);
    if (fragment) {
      side.stones += 1;
      log(`${card.name}炼化${fragment.name}，获得 1 枚灵石。`);
    }
  }
  if (card.name.includes("坤岳回填")) {
    const recovered = recoverFragmentToHand(side, (fragment) => fragment.type === "defense" || fragment.type === "counter");
    if (recovered) log(`${card.name}回填阵基，重铸${recovered.name}。`);
  }
  if (card.name.includes("碎玉搜水")) {
    drawElementToHand(side, "water", "碎玉搜水");
    if (side.board.earth) side.stones += 1;
    log(`${card.name}搜得水脉，抽 1 张水系卡${side.board.earth ? "并获得 1 灵石" : ""}。`);
  }
  if (card.name.includes("沧海重铸")) {
    const recovered = recoverFragmentToHand(side, (fragment) => fragment.element === "water");
    if (recovered) log(`${card.name}重铸${recovered.name}。`);
    else {
      drawElementToHand(side, "water", "沧海重铸");
      log(`${card.name}无水系碎片，改为抽 1 张水系卡。`);
    }
  }
  if (card.name.includes("归墟拾遗")) {
    const recovered = recoverFragmentToHand(side);
    if (recovered) log(`${card.name}拾回${recovered.name}。`);
  }
}

function applyDestroyAftermath(side, opponent, card, targetCard, destroyed, context) {
  if (!destroyed || !targetCard) return;
  if (card.name.includes("枝影换位") && targetCard.element === "earth") {
    drawElementToHand(side, "fire");
    log(`${card.name}破土引火，抽 1 张火系卡。`);
  }
  if (card.name.includes("薪尽爆燃")) {
    drawElementToHand(side, "earth");
    log(`${card.name}灰烬落土，抽 1 张土系卡。`);
  }
  if (card.name.includes("焚卷成灰") || card.name.includes("斩念弃牌")) {
    const discardIndex = chooseEnemyDiscardIndex(opponent);
    if (discardIndex >= 0) {
      const discarded = discardHandCard(opponent, discardIndex);
      log(`${card.name}烧断手牌，对手弃置${discarded.name}。`);
    }
  }
  if (card.name.includes("焚契斩灵")) {
    const loss = loseStones(opponent, context.handAssist?.card.element === "earth" ? 2 : 1);
    if (loss) log(`${card.name}斩去对手 ${loss} 枚灵石。`);
  }
  if (card.name.includes("沉珠归海") && targetCard.element === "fire") {
    changeHp(side, 1);
    drawElementToHand(side, "water", "沉珠归海");
    log(`${card.name}灭火归海，回复 1 并抽 1 张水系卡。`);
  }
}

function logPowerMoment(card, target, base, bonus, finalSpirit, targetOwner, targetSlot) {
  if (!target) return;
  const overcome = isOvercome(card.element, target.card.element);
  if (bonus > 0 && overcome) {
    log(`阵势爆发：${LABEL[card.element]}势 +${bonus}，且${LABEL[card.element]}克${LABEL[target.card.element]}，灵力轰到 ${finalSpirit}！`);
    playFullScreenVfx(card.element, "阵势爆发", "synergy");
    playElementVfx(targetOwner, targetSlot, "overcome", card.element);
    screenShake("heavy");
    pulsePower();
  } else if (bonus > 0) {
    log(`五行阵势：${card.name}获得 +${bonus} 灵力，${base}→${base + bonus}。`);
    playFullScreenVfx(card.element, "相生联协", "synergy");
    playElementVfx(targetOwner, targetSlot, "synergy", card.element);
    pulsePower();
  } else if (overcome) {
    log(`属性克制：${LABEL[card.element]}克${LABEL[target.card.element]}，本次攻击翻倍。`);
    playElementVfx(targetOwner, targetSlot, "overcome", card.element);
    screenShake("heavy");
    pulsePower();
  }
}

function pulsePower() {
  document.body.classList.remove("power-pulse");
  void document.body.offsetWidth;
  document.body.classList.add("power-pulse");
  setTimeout(() => document.body.classList.remove("power-pulse"), 520);
}

function vfxAssetKey(element, action, fallback = "sparks") {
  const actionMap = VFX_REGISTRY[action] || VFX_REGISTRY.hit;
  const value = actionMap?.[element] || actionMap?.default || fallback;
  return Array.isArray(value) ? value[0] : value;
}

function vfxAssetKeys(element, action, fallback = "sparks") {
  const actionMap = VFX_REGISTRY[action] || VFX_REGISTRY.hit;
  const value = actionMap?.[element] || actionMap?.default || fallback;
  return Array.isArray(value) ? value : [value];
}

function playElementVfx(owner, slot, action, element = slot, options = {}) {
  const keys = options.asset
    ? (Array.isArray(options.asset) ? options.asset : [options.asset])
    : vfxAssetKeys(element, action, options.fallback);
  keys.forEach((key, index) => {
    const delay = (options.delay || 0) + index * (options.stagger ?? 110);
    setTimeout(() => playVfx(owner, slot, key, options), delay);
  });
}

function playVfx(owner, slot, key, options = {}) {
  const config = { ...(VFX_ASSETS[key] || VFX_ASSETS.sparks), ...options };
  const boardId = owner === "enemy" ? "enemyBoard" : "playerBoard";
  const target = document.querySelector(`#${boardId} [data-slot="${slot}"]`);
  if (!target) return;
  const node = document.createElement("span");
  node.className = `vfx-sprite ${config.className || ""}`.trim();
  node.style.setProperty("--vfx-url", `url("./assets/vfx/${config.file}")`);
  node.style.setProperty("--vfx-frames", config.frames);
  node.style.setProperty("--vfx-columns", config.columns || config.frames);
  node.style.setProperty("--vfx-width", `${config.width}px`);
  node.style.setProperty("--vfx-height", `${config.height}px`);
  node.style.setProperty("--vfx-display-width", `${config.width * config.scale}px`);
  node.style.setProperty("--vfx-display-height", `${config.height * config.scale}px`);
  node.style.setProperty("--vfx-sheet-width", `${config.width * (config.columns || config.frames) * config.scale}px`);
  node.style.setProperty("--vfx-sheet-height", `${config.height * Math.ceil(config.frames / (config.columns || config.frames)) * config.scale}px`);
  node.style.setProperty("--vfx-duration", `${config.duration || 540}ms`);
  if (config.columns) {
    const frameTime = Math.max(40, Math.floor((config.duration || 540) / config.frames));
    let frame = 0;
    const timer = setInterval(() => {
      frame += 1;
      const column = frame % config.columns;
      const row = Math.floor(frame / config.columns);
      node.style.backgroundPosition = `${-column * config.width * config.scale}px ${-row * config.height * config.scale}px`;
      if (frame >= config.frames - 1) clearInterval(timer);
    }, frameTime);
  } else {
    node.classList.add("vfx-strip");
  }
  target.append(node);
  setTimeout(() => node.remove(), (config.duration || 540) + 220);
}

function slotCenter(owner, slot) {
  const boardId = owner === "enemy" ? "enemyBoard" : "playerBoard";
  const target = document.querySelector(`#${boardId} [data-slot="${slot}"]`);
  if (!target) return null;
  const rect = target.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function playVfxPath(fromOwner, fromSlot, toOwner, toSlot, element, action = "attack") {
  const from = slotCenter(fromOwner, fromSlot);
  const to = slotCenter(toOwner, toSlot);
  const host = document.querySelector("#gameShell") || document.body;
  if (!from || !to || !host) return;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const node = document.createElement("span");
  node.className = `vfx-trail vfx-trail-${action}`;
  node.style.setProperty("--vfx-color", COLOR[element] || COLOR.core);
  node.style.setProperty("--vfx-length", `${distance}px`);
  node.style.left = `${from.x}px`;
  node.style.top = `${from.y}px`;
  node.style.transform = `rotate(${angle}deg)`;
  host.append(node);
  setTimeout(() => node.remove(), 620);
}

function screenShake(strength = "normal") {
  const className = strength === "heavy" ? "screen-shake-heavy" : "screen-shake";
  document.body.classList.remove("screen-shake", "screen-shake-heavy");
  void document.body.offsetWidth;
  document.body.classList.add(className);
  setTimeout(() => document.body.classList.remove(className), strength === "heavy" ? 540 : 360);
}

function playFullScreenVfx(element, label, action = "array") {
  const host = document.querySelector("#gameShell") || document.body;
  const node = document.createElement("div");
  node.className = `screen-vfx screen-vfx-${element} screen-vfx-${action}`;
  node.innerHTML = `
    <div class="screen-vfx-ring">
      <span>${LABEL[element] || "阵"}</span>
      <i></i><i></i><i></i><i></i><i></i>
    </div>
    <strong>${label}</strong>
  `;
  host.append(node);
  setTimeout(() => node.remove(), 1180);
}

async function activate(slot, targetSlot = null, options = {}) {
  if (state.winner || state.active !== "player" || state.phase !== "activation" || state.hasActed) return;
  const source = getSelectedSource();
  if (!source) return;
  if (["attack", "destroy"].includes(source.card.type) && !targetSlot) {
    if (state.tutorial && slot === "fire" && source.card.type === "attack") {
      state.pendingTutorialTarget = { sourceSlot: "fire", targetSlot: "metal" };
      completeTutorialStep(4, 5);
      document.querySelector("#targetDialog")?.close();
      render();
      return;
    }
    openTargetDialog();
    return;
  }
  if (state.tutorial && source.card.type === "attack") {
    const pending = state.pendingTutorialTarget;
    const expected = pending?.sourceSlot === slot && pending?.targetSlot === targetSlot;
    if (!options.fromBoardTarget || !expected) {
      state.pendingTutorialTarget = { sourceSlot: "fire", targetSlot: "metal" };
      completeTutorialStep(4, 5);
      document.querySelector("#targetDialog")?.close();
      render();
      return;
    }
  }
  await resolveCard(state.player, state.enemy, source, targetSlot);
  state.hasActed = true;
  if (state.tutorial && slot === "fire" && targetSlot === "metal") {
    state.pendingTutorialTarget = null;
    completeTutorialStep(5, 6);
  }
  checkWinner();
  render();
  await waitForLogIdle();
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
    const handAssist = await askHandAssist(side, opponent, card, targetSlot, slot);
    const context = buildActionContext(side, opponent, card, slot, targetSlot, handAssist);
    const target = context.target;
    const targetCard = target?.card || null;
    const baseSpirit = card.value * multiplier + (slotState?.stones || 0);
    const attackSpirit = baseSpirit + context.bonus;
    const finalSpirit = target && target.mode !== "attack" ? attackSpirit * attackScale(card.element, target.card.element) : attackSpirit;
    const opponentKey = opponent === state.enemy ? "enemy" : "player";
    const sideKey = side === state.player ? "player" : "enemy";
    logPowerMoment(card, target, baseSpirit, context.bonus, target?.mode !== "attack" ? finalSpirit : attackSpirit * attackScale(card.element, target?.card.element), opponentKey, targetSlot);
    playVfxPath(sideKey, slot, opponentKey, targetSlot, card.element, context.overcome ? "overcome" : "attack");
    playElementVfx(opponentKey, targetSlot, context.overcome ? "overcome" : "attack", card.element);
    const result = await applyDamage(opponent, targetSlot, finalSpirit, card, side);
    applyCyclePower(side, opponent, card, targetSlot, context, result.destroyed, result.overflow);
    applyAttackAftermath(side, opponent, card, targetCard, result, context);
    log(`${side.name}发动${card.name}攻击${opponent.name}${LABEL[targetSlot]}槽，灵力 ${finalSpirit}。`);
    if (side === state.player && state.pendingSpell?.type === "fire") {
      log("火法诀·燃的蓄势已随本次攻击释放。");
      state.pendingSpell = null;
    }
    if (side.tempAttackBoost) {
      log(`${side.name}的陷阱蓄势已随本次攻击释放。`);
      side.tempAttackBoost = 0;
    }
    consumeSource(side, source);
  } else if (card.type === "heal") {
    const amount = card.value * multiplier + (slotState?.stones || 0);
    changeHp(side, amount);
    playElementVfx(side === state.player ? "player" : "enemy", slot, "heal", card.element);
    log(`${side.name}发动${card.name}回复 ${amount} 生命。`);
    applyHealAftermath(side, card);
    consumeSource(side, source);
  } else if (card.type === "counter" || card.type === "defense") {
    const heal = 1 + (slotState?.stones || 0);
    changeHp(side, heal);
    playElementVfx(side === state.player ? "player" : "enemy", slot, card.type === "counter" ? "counter" : "defense", card.element);
    log(`${side.name}主动运转${card.name}，回复 ${heal} 生命。`);
    consumeSource(side, source);
  } else if (card.type === "destroy") {
    const handAssist = await askHandAssist(side, opponent, card, targetSlot, slot);
    const context = buildActionContext(side, opponent, card, slot, targetSlot, handAssist);
    const target = opponent.board[targetSlot];
    const targetCard = target?.card || null;
    let destroyed = false;
    if (target?.mode === "eye") {
      removeSlot(opponent, targetSlot);
      destroyed = true;
      playElementVfx(opponent === state.enemy ? "enemy" : "player", targetSlot, "destroy", card.element);
      log(`${side.name}以${card.name}破坏阵眼${target.card.name}。`);
    } else if (target) {
      removeSlot(opponent, targetSlot);
      destroyed = true;
      playElementVfx(opponent === state.enemy ? "enemy" : "player", targetSlot, "destroy", card.element);
      log(`${side.name}发动${card.name}毁灭${opponent.name}${LABEL[targetSlot]}槽的${target.card.name}。`);
    } else {
      log(`${card.name}没有找到可毁灭目标。`);
    }
    if (context.hasCycle && context.eye && target && context.handBonus > 0) {
      const boosted = boostLowestSpirit(side, 1);
      if (boosted) log(`法诀归阵：${LABEL[boosted.slot]}槽补充 1 灵力。`);
    }
    applyDestroyAftermath(side, opponent, card, targetCard, destroyed, context);
    consumeSource(side, source);
  } else if (card.type === "ongoing") {
    if (slotState.hp < slotState.maxHp) slotState.hp += 1;
    playElementVfx(side === state.player ? "player" : "enemy", slot, "synergy", card.element);
    log(`${side.name}催动${card.name}，补充 1 点灵力。`);
  } else if (card.type === "eye") {
    side.stones += 1;
    playElementVfx(side === state.player ? "player" : "enemy", "core", "array", card.element);
    log(`${side.name}催动阵眼${card.name}，获得 1 枚灵石。`);
  }
}

async function applyDamage(side, slot, amount, sourceCard, attackerSide) {
  if (sourceCard.type === "attack") state.currentAttackSlot = slot;
  let target = side.board[slot];
  const sideKey = side === state.player ? "player" : "enemy";
  if (!target) {
    if (sourceCard.type === "attack") {
      const guarded = side === state.player
        ? await resolvePlayerEmptyGuard(slot, amount, sourceCard)
        : await resolveEnemyEmptyGuard(slot, amount, sourceCard);
      if (guarded.used) {
        if (guarded.amount <= 0) return { destroyed: false, overflow: 0 };
        changeHp(side, -guarded.amount);
        floatSlotLabel(sideKey, slot, "余", "float-hp");
        log(`${side.name}护阵后仍有 ${guarded.amount} 点灵力冲击空槽。`);
        return { destroyed: false, overflow: guarded.amount };
      }
    }
    changeHp(side, -amount);
    floatSlotLabel(sideKey, slot, "破", "float-hp");
    log(`${side.name}${LABEL[slot]}槽为空，不能触发防守或联协，直接承受 ${amount} 点灵力冲击。`);
    return { destroyed: false, overflow: amount };
  }
  if (target.mode === "attack" && sourceCard.type === "attack") {
    return resolveAttackClash(side, slot, amount, sourceCard, target, attackerSide);
  }
  if (sourceCard.type === "attack") {
    amount = side === state.player
      ? await resolvePlayerDefense(slot, amount, sourceCard)
      : await resolveEnemyDefense(slot, amount, sourceCard);
    if (amount <= 0) return { destroyed: false, overflow: 0 };
    target = side.board[slot];
    if (!target) {
      changeHp(side, -amount);
      floatSlotLabel(sideKey, slot, "破", "float-hp");
      log(`${side.name}${LABEL[slot]}槽防守后为空，剩余 ${amount} 点灵力冲击生命。`);
      return { destroyed: false, overflow: amount };
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
      const overflow = Math.abs(target.hp);
      floatSlot(sideKey, slot, -Math.min(before, incoming));
      removeSlot(side, slot);
      if (overflow > 0) {
        changeHp(side, -overflow);
        log(`${target.card.name}灵力相减：${before}-${incoming}<=0，被破坏，剩余 ${overflow} 点灵力冲击生命。`);
      } else {
        log(`${target.card.name}灵力相减：${before}-${incoming}<=0，被破坏。`);
      }
      return { destroyed: true, overflow };
    } else {
      floatSlot(sideKey, slot, -incoming);
      log(`${target.card.name}灵力相减：${before}-${incoming}=${target.hp + target.stones}。`);
    }
    return { destroyed: false, overflow: 0 };
  }
  if (target.mode === "eye") {
    const damage = Math.max(1, Math.floor(amount / 2));
    changeHp(side, -damage);
    floatSlotLabel(sideKey, slot, "阵", "float-minus");
    return { destroyed: false, overflow: damage };
  }
  changeHp(side, -amount);
  floatSlotLabel(sideKey, slot, target.mode === "attack" ? "破" : `-${amount}`, "float-minus");
  if (target.mode === "attack") removeSlot(side, slot);
  return { destroyed: target.mode === "attack", overflow: amount };
}

function reduceSlotSpirit(side, slot, amount) {
  const target = side.board[slot];
  if (!target || amount <= 0) return { destroyed: false, loss: 0 };
  const sideKey = sideKeyOf(side);
  const before = target.hp + target.stones;
  let remaining = amount;
  while (target.stones > 0 && remaining > 0) {
    target.stones -= 1;
    remaining -= 1;
  }
  target.hp -= remaining;
  const loss = Math.min(before, amount);
  floatSlot(sideKey, slot, -loss);
  if (target.mode !== "eye" && target.hp <= 0) {
    const element = target.card.element;
    removeSlot(side, slot);
    playElementVfx(sideKey, slot, "destroy", element);
    return { destroyed: true, loss };
  }
  return { destroyed: false, loss };
}

function resolveAttackClash(side, slot, attackerAmount, sourceCard, target, attackerSide) {
  target.faceDown = false;
  const attackerScale = attackScale(sourceCard.element, target.card.element);
  const defenderScale = attackScale(target.card.element, sourceCard.element);
  const attackerPower = attackerAmount * attackerScale;
  const defenderPower = (target.card.value + target.stones) * defenderScale;
  const diff = attackerPower - defenderPower;
  if (attackerPower > defenderPower) {
    removeSlot(side, slot);
    changeHp(side, -diff);
    floatSlot(side === state.player ? "player" : "enemy", slot, -defenderPower);
    log(`${sourceCard.name}与${target.card.name}灵力相减：${attackerPower}-${defenderPower}=${diff}，${target.card.name}被破坏，剩余 ${diff} 点灵力冲击生命。`);
    return { destroyed: true, overflow: diff };
  } else if (defenderPower > attackerPower) {
    const recoil = defenderPower - attackerPower;
    changeHp(attackerSide, -recoil);
    floatSlot(side === state.player ? "player" : "enemy", slot, -attackerPower);
    log(`${sourceCard.name}撞上${target.card.name}：${attackerPower}-${defenderPower}=${diff}，攻击被压回，反震 ${recoil} 点生命。`);
    return { destroyed: false, overflow: 0 };
  } else {
    floatSlot(side === state.player ? "player" : "enemy", slot, -attackerPower);
    log(`${sourceCard.name}与${target.card.name}灵力相减：${attackerPower}-${defenderPower}=0，双方攻势抵消。`);
  }
  return { destroyed: false, overflow: 0 };
}

function guardCandidates(side) {
  return FIVE
    .map((slot) => ({ slot, slotState: side.board[slot] }))
    .filter(({ slotState }) => slotState?.mode === "defense");
}

function guardChoiceLabel(slot, slotState, hidden = false) {
  const name = hidden && slotState.faceDown ? "里侧防守" : visibleName(slotState, hidden);
  return `${LABEL[slot]}槽：${name}（护阵拦截）`;
}

async function resolvePlayerEmptyGuard(emptySlot, amount, sourceCard) {
  const candidates = guardCandidates(state.player);
  if (candidates.length === 0) return { used: false, amount };
  const picked = await askTrigger({
    title: "空槽护阵",
    text: `对手攻击你的${LABEL[emptySlot]}空槽。可让一个防守位拦截，触发防守、反击或相生联协。`,
    options: [
      ...candidates.map(({ slot, slotState }) => ({ label: guardChoiceLabel(slot, slotState, false), value: slot })),
      { label: "不拦截，空槽承受伤害", value: null },
    ],
    cancelLabel: "不拦截",
    cancelValue: null,
  });
  if (!picked) return { used: false, amount };
  log(`玩家以${LABEL[picked]}槽护住${LABEL[emptySlot]}空槽。`);
  const remaining = await resolvePlayerDefense(picked, amount, sourceCard);
  return { used: true, amount: remaining };
}

async function resolveEnemyEmptyGuard(emptySlot, amount, sourceCard) {
  const candidates = guardCandidates(state.enemy);
  if (candidates.length === 0) return { used: false, amount };
  const picked = candidates
    .map(({ slot, slotState }) => ({
      slot,
      slotState,
      score: (slotState.card.type === "counter" ? 18 : 0)
        + (slotState.card.type === "defense" ? 12 : 0)
        + (slotState.card.type === "heal" ? 8 : 0)
        + slotSpirit(slotState),
    }))
    .sort((a, b) => b.score - a.score)[0];
  if (!picked || picked.score < 8) return { used: false, amount };
  log(`对手以${LABEL[picked.slot]}槽护住${LABEL[emptySlot]}空槽。`);
  const remaining = await resolveEnemyDefense(picked.slot, amount, sourceCard);
  return { used: true, amount: remaining };
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
      amount = resolveDefenseEffectFor(state.player, state.enemy, "中台", core, amount, sourceCard, "core");
      usedSlots.add("core");
      removeSlot(state.player, "core");
      render();
      amount = await resolveLianxieFor(state.player, state.enemy, slot, amount, sourceCard, usedSlots, true);
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
      amount = resolveDefenseEffectFor(state.player, state.enemy, `${LABEL[slot]}槽`, target, amount, sourceCard, slot);
      usedSlots.add(slot);
      removeSlot(state.player, slot);
      render();
      amount = await resolveLianxieFor(state.player, state.enemy, slot, amount, sourceCard, usedSlots, true);
    }
  }
  return amount;
}

async function resolveEnemyDefense(slot, amount, sourceCard) {
  const usedSlots = new Set();
  const core = state.enemy.board.core;
  if (core?.mode === "defense" && (core.card.element === slot || core.card.element === sourceCard.element)) {
    core.faceDown = false;
    amount = resolveDefenseEffectFor(state.enemy, state.player, "中台", core, amount, sourceCard, "core");
    usedSlots.add("core");
    removeSlot(state.enemy, "core");
    render();
    amount = await resolveLianxieFor(state.enemy, state.player, slot, amount, sourceCard, usedSlots, false);
    if (amount <= 0) return 0;
  }

  const target = state.enemy.board[slot];
  if (target?.mode === "defense") {
    target.faceDown = false;
    amount = resolveDefenseEffectFor(state.enemy, state.player, `${LABEL[slot]}槽`, target, amount, sourceCard, slot);
    usedSlots.add(slot);
    removeSlot(state.enemy, slot);
    render();
    amount = await resolveLianxieFor(state.enemy, state.player, slot, amount, sourceCard, usedSlots, false);
  }
  return amount;
}

function firstEmptyFiveSlot(side, preferred = null) {
  if (preferred && FIVE.includes(preferred) && !side.board[preferred]) return preferred;
  return FIVE.find((slot) => !side.board[slot]) || null;
}

function weakestEnemySlot(side) {
  return FIVE
    .map((slot) => ({ slot, slotState: side.board[slot] }))
    .filter(({ slotState }) => slotState && slotState.mode !== "eye")
    .sort((a, b) => slotSpirit(a.slotState) - slotSpirit(b.slotState))[0] || null;
}

function waterFragmentIndex(side) {
  return side.discard.findIndex((card) => card.element === "water");
}

function drawTypedCard(element, type) {
  for (let i = 0; i < 36; i += 1) {
    const card = drawCard(element);
    if (card.type === type) return card;
  }
  const template = cardPool[element].find((card) => card.type === type) || cardPool[element][0];
  return cloneCard(template, element);
}

function createTrapAttackSlot(defender, defenderKey, slot, element, bonus = 0) {
  const card = drawTypedCard(element, "attack");
  if (!canPlaceCardAt(defender, card, slot)) return null;
  const slotState = createSlot(card, slot, defenderKey);
  slotState.stones += bonus;
  defender.board[slot] = slotState;
  return slotState;
}

function sameElementFragmentIndex(side, element) {
  return side.discard.findIndex((card) => card.element === element);
}

function applyCounterTrapEffect(defender, attacker, slot, card, amount, sourceCard, labelPrefix = "") {
  const defenderKey = sideKeyOf(defender);
  const attackerKey = sideKeyOf(attacker);
  const ownerName = defender === state.player ? "玩家" : "对手";
  let currentAmount = amount;
  const attackedSlot = FIVE.includes(state.currentAttackSlot) ? state.currentAttackSlot : slot;
  const attackedElement = FIVE.includes(attackedSlot) ? attackedSlot : sourceCard.element;
  const counterElement = card.element;
  const sourceElement = sourceCard.element;
  const attackedSlotState = FIVE.includes(attackedSlot) ? defender.board[attackedSlot] : null;

  if (GENERATES[counterElement] === attackedElement) {
    if (!attackedSlotState && FIVE.includes(attackedSlot)) {
      const created = createTrapAttackSlot(defender, defenderKey, attackedSlot, attackedElement, 2);
      if (created) {
        currentAmount = Math.max(0, currentAmount - slotSpirit(created));
        playVfxPath(defenderKey, slot, defenderKey, attackedSlot, counterElement, "synergy");
        playElementVfx(defenderKey, attackedSlot, "synergy", counterElement);
        log(`${ownerName}${labelPrefix}${card.name}连锁${LABEL[counterElement]}生${LABEL[attackedElement]}：补入${LABEL[attackedElement]}攻击卡，并获得 2 灵力。`);
      } else {
        drawElementToHand(defender, attackedElement);
        drawElementToHand(defender, attackedElement);
        log(`${ownerName}${labelPrefix}${card.name}连锁${LABEL[counterElement]}生${LABEL[attackedElement]}：阵位受限，改为补 2 张${LABEL[attackedElement]}系手牌。`);
      }
    } else if (attackedSlotState) {
      attackedSlotState.stones += 2;
      currentAmount = Math.max(0, currentAmount - 2);
      playVfxPath(defenderKey, slot, defenderKey, attackedSlot, counterElement, "synergy");
      playElementVfx(defenderKey, attackedSlot, "synergy", counterElement);
      floatSlot(defenderKey, attackedSlot, 2);
      log(`${ownerName}${labelPrefix}${card.name}连锁${LABEL[counterElement]}生${LABEL[attackedElement]}：${LABEL[attackedElement]}槽补充 2 灵力。`);
    }
  } else if (GENERATES[attackedElement] === counterElement) {
    if (!attackedSlotState) {
      drawElementToHand(defender, attackedElement);
      drawElementToHand(defender, attackedElement);
      playElementVfx(defenderKey, slot, "synergy", counterElement);
      log(`${ownerName}${labelPrefix}${card.name}借${LABEL[attackedElement]}生${LABEL[counterElement]}回流：补 2 张${LABEL[attackedElement]}系手牌。`);
    } else {
      drawElementToHand(defender, attackedElement);
      attackedSlotState.stones += 1;
      playVfxPath(defenderKey, slot, defenderKey, attackedSlot, counterElement, "synergy");
      playElementVfx(defenderKey, attackedSlot, "synergy", counterElement);
      floatSlot(defenderKey, attackedSlot, 1);
      log(`${ownerName}${labelPrefix}${card.name}借${LABEL[attackedElement]}生${LABEL[counterElement]}回流：抽 1 张${LABEL[attackedElement]}系卡，${LABEL[attackedElement]}槽 +1。`);
    }
  } else if (OVERCOME[counterElement] === sourceElement) {
    currentAmount = Math.max(0, currentAmount - 2);
    changeHp(attacker, -1);
    playVfxPath(defenderKey, slot, attackerKey, sourceElement, counterElement, "counter");
    playElementVfx(attackerKey, sourceElement, "counter", counterElement);
    log(`${ownerName}${labelPrefix}${card.name}连锁${LABEL[counterElement]}克${LABEL[sourceElement]}：削弱本次攻击 2，并反噬 1 生命。`);
  } else if (OVERCOME[sourceElement] === counterElement) {
    currentAmount = Math.max(0, currentAmount - 1);
    const index = sameElementFragmentIndex(defender, counterElement);
    if (index >= 0) {
      const [fragment] = defender.discard.splice(index, 1);
      defender.hand.push(fragment);
      afterRecoverFragment(defender, fragment);
      log(`${ownerName}${labelPrefix}${card.name}遭${LABEL[sourceElement]}克${LABEL[counterElement]}，借势脱身：削弱 1 并重铸${fragment.name}。`);
    } else {
      changeHp(defender, 1);
      log(`${ownerName}${labelPrefix}${card.name}遭${LABEL[sourceElement]}克${LABEL[counterElement]}，借势脱身：削弱 1 并回复 1。`);
    }
  } else if (sourceElement === counterElement || attackedElement === counterElement) {
    defender.tempAttackBoost = Math.min(3, (defender.tempAttackBoost || 0) + 1);
    drawElementToHand(defender, counterElement);
    playElementVfx(defenderKey, slot, "counter", counterElement);
    log(`${ownerName}${labelPrefix}${card.name}同源连锁：抽 1 张${LABEL[counterElement]}系卡，下一次攻击 +1。`);
  }
  return currentAmount;
}

function resolveDefenseEffectFor(defender, attacker, label, slotState, amount, sourceCard, slot = slotState.card.element) {
  const card = slotState.card;
  const boost = slotState.stones || 0;
  const defenderKey = sideKeyOf(defender);
  const attackerKey = sideKeyOf(attacker);
  const ownerName = defender === state.player ? "玩家" : "对手";
  if (card.type === "heal") {
    const heal = card.value + boost;
    changeHp(defender, heal);
    playElementVfx(defenderKey, slot, "heal", card.element);
    log(`${ownerName}翻开${label}${card.name}，回复 ${heal} 生命。`);
    applyHealAftermath(defender, card);
    return amount;
  }
  if (card.type === "counter") {
    amount = applyCounterTrapEffect(defender, attacker, slot, card, amount, sourceCard);
    const extraBlock = card.name.includes("山门空壁") ? 1 : 0;
    const block = Math.min(amount, 1 + boost + extraBlock);
    const damage = card.value + boost;
    changeHp(attacker, -damage);
    playElementVfx(defenderKey, slot, "counter", card.element);
    playVfxPath(defenderKey, slot, attackerKey, sourceCard.element, card.element, "counter");
    playElementVfx(attackerKey, sourceCard.element, "counter", card.element);
    log(`${ownerName}翻开${label}${card.name}，抵消 ${block} 并反击 ${damage}。`);
    if (card.name.includes("山门空壁")) {
      const boosted = boostLowestSpirit(defender, 1);
      if (boosted) log(`${card.name}护住空壁，${LABEL[boosted.slot]}槽 +1 灵力。`);
    }
    return amount - block;
  }
  const block = card.value + boost;
  playElementVfx(defenderKey, slot, "defense", card.element);
  log(`${ownerName}翻开${label}${card.name}，抵消 ${block} 点伤害。`);
  if (card.name.includes("藤门借道")) {
    drawElementToHand(defender, "wood");
    log(`${card.name}藤门借道，抽 1 张木系卡。`);
  }
  if (card.name.includes("埋玉补山")) {
    const fragment = takeFragment(defender);
    if (fragment) {
      const boosted = boostLowestSpirit(defender, 1);
      if (boosted) log(`${card.name}埋下${fragment.name}，${LABEL[boosted.slot]}槽 +1 灵力。`);
    }
  }
  if (card.name.includes("潮汐回手")) {
    const recovered = recoverFragmentToHand(defender, (fragment) => fragment.element === card.element);
    if (recovered) log(`${card.name}潮汐回手，重铸${recovered.name}。`);
  }
  if (card.name.includes("百炼藏锋")) {
    defender.tempAttackBoost = Math.min(3, (defender.tempAttackBoost || 0) + 1);
    log(`${card.name}藏锋待发，下一次攻击 +1。`);
  }
  return Math.max(0, amount - block);
}

async function resolveLianxieFor(defender, attacker, startSlot, amount, sourceCard, usedSlots, promptPlayer) {
  let current = startSlot;
  while (FIVE.includes(current)) {
    const next = GENERATES[current];
    if (!next || usedSlots.has(next)) break;
    const slotState = defender.board[next];
    if (!slotState) break;
    if (slotState.card.type === "attack") {
      log(`${LABEL[next]}槽是攻击卡，不能参与联协。`);
      break;
    }
    let useLink = shouldAutoUseLianxie(slotState, amount);
    if (promptPlayer) {
      useLink = await askTrigger({
        title: "相生联协",
        text: `${LABEL[current]}生${LABEL[next]}。是否发动${LABEL[next]}槽的${slotState.faceDown ? "里侧卡" : slotState.card.name}继续联协？`,
        options: [
          { label: `发动 ${slotState.faceDown ? "里侧卡" : slotState.card.name}`, value: true },
          { label: "停止联协", value: false },
        ],
      });
    }
    if (!useLink) break;
    slotState.faceDown = false;
    playVfxPath(sideKeyOf(defender), current, sideKeyOf(defender), next, next, "synergy");
    playElementVfx(sideKeyOf(defender), next, "synergy", next);
    amount = resolveLianxieEffectFor(defender, attacker, next, slotState, amount, sourceCard);
    usedSlots.add(next);
    if (slotState.mode === "attack" || slotState.mode === "defense") {
      removeSlot(defender, next);
    }
    render();
    current = next;
  }
  return amount;
}

function shouldAutoUseLianxie(slotState, amount) {
  if (!slotState || slotState.card.type === "attack") return false;
  if (amount > 0) return true;
  return slotState.card.type === "heal" || slotState.card.type === "counter";
}

function resolveLianxieEffectFor(defender, attacker, slot, slotState, amount, sourceCard) {
  const card = slotState.card;
  const boost = slotState.stones || 0;
  const defenderKey = sideKeyOf(defender);
  const attackerKey = sideKeyOf(attacker);
  const ownerName = defender === state.player ? "" : "对手";
  if (card.type === "counter") {
    amount = applyCounterTrapEffect(defender, attacker, slot, card, amount, sourceCard, "联协");
    const damage = card.value + boost;
    changeHp(attacker, -damage);
    playVfxPath(defenderKey, slot, attackerKey, sourceCard.element, card.element, "counter");
    playElementVfx(attackerKey, sourceCard.element, "counter", card.element);
    log(`${ownerName}联协发动${LABEL[slot]}槽${card.name}，反击 ${damage} 点。`);
    return amount;
  }
  if (card.type === "heal") {
    const heal = card.value + boost;
    changeHp(defender, heal);
    playElementVfx(defenderKey, slot, "heal", card.element);
    log(`${ownerName}联协发动${LABEL[slot]}槽${card.name}，回复 ${heal} 生命。`);
    return amount;
  }
  if (card.type === "destroy") {
    const weaken = Math.min(amount, card.value + boost);
    playElementVfx(defenderKey, slot, "destroy", card.element);
    log(`${ownerName}联协发动${LABEL[slot]}槽${card.name}，削弱本次攻击 ${weaken} 点。`);
    return amount - weaken;
  }
  if (card.type === "ongoing") {
    const block = Math.min(amount, 1 + boost);
    playElementVfx(defenderKey, slot, "defense", card.element);
    log(`${ownerName}联协催动${LABEL[slot]}槽${card.name}，抵消 ${block} 点伤害。`);
    return amount - block;
  }
  const block = Math.min(amount, card.value + boost);
  playElementVfx(defenderKey, slot, "defense", card.element);
  log(`${ownerName}联协发动${LABEL[slot]}槽${card.name}，抵消 ${block} 点伤害。`);
  return amount - block;
}

function consumeSource(side, source) {
  if (source.handIndex != null) {
    discardHandCard(side, source.handIndex);
    state.selectedHand = null;
    return;
  }
  if (source.slotState?.mode === "attack" || source.slotState?.mode === "defense") {
    removeSlot(side, source.slot);
  }
}

async function imbue(slot) {
  if (state.winner || state.active !== "player" || state.hasImbued) return;
  const options = [];
  const slotState = slot ? state.player.board[slot] : null;
  if (slotState && slotState.mode !== "eye" && state.player.stones > 0) {
    options.push({ label: `为${LABEL[slot]}槽补灵`, value: "imbue" });
  }
  if (state.player.stones >= 2) {
    options.push({ label: "炼石补卡：消耗 2 灵石抽 1 张", value: "draw" });
  }
  if (state.player.stones >= 2 && state.player.discard.length > 0) {
    options.push({ label: `炼宝重铸：消耗 2 灵石从灵宝碎片取回 1 张（${state.player.discard.length}）`, value: "recover" });
  }
  if (options.length === 0) {
    showToast(slot ? "灵石不足或该槽不能补灵。" : "请选择卡槽补灵，或积攒 2 灵石炼石补卡。");
    return;
  }
  const action = options.length === 1
    ? options[0].value
    : await askTrigger({
      title: "灵石动作",
      text: "每回合可进行一次灵石动作：补灵、炼石抽牌，或从灵宝碎片重铸卡牌。",
      options,
      cancelLabel: "返回",
      cancelValue: null,
    });
  if (!action) return;
  if (action === "draw") {
    state.player.stones -= 2;
    drawToHand(state.player);
    state.hasImbued = true;
    playElementVfx("player", "core", "synergy", "core");
    log("玩家消耗 2 枚灵石炼石补卡，抽 1 张手卡。");
    render();
    return;
  }
  if (action === "recover") {
    await recoverFromDiscard(state.player, "player");
    return;
  }
  const maxAmount = Math.min(3, state.player.stones);
  const amount = maxAmount > 1
    ? await askTrigger({
      title: "补充灵力",
      text: `选择为${LABEL[slot]}槽补充的灵力数量。`,
      options: Array.from({ length: maxAmount }, (_, index) => {
        const value = index + 1;
        return { label: `补 ${value} 点灵力`, value };
      }),
      cancelLabel: "返回",
      cancelValue: null,
    })
    : 1;
  if (!amount) return;
  slotState.stones += amount;
  state.player.stones -= amount;
  state.hasImbued = true;
  state.selectedHand = null;
  floatSlot("player", slot, amount);
  log(`玩家消耗 ${amount} 枚灵石，为${LABEL[slot]}槽补充 ${amount} 点灵力。`);
  if (hasOngoing(state.player, "息壤不竭") && FIVE.includes(slot)) {
    const next = GENERATES[slot];
    const nextSlot = state.player.board[next];
    const fragment = nextSlot && nextSlot.mode !== "eye" ? takeFragment(state.player) : null;
    if (fragment && boostSlotIfPresent(state.player, next, 1)) {
      log(`息壤不竭炼化${fragment.name}，相生的${LABEL[next]}槽 +1 灵力。`);
    }
  }
  if (state.tutorial && slot === "fire") completeTutorialStep(2, 3);
  render();
}

async function recoverFromDiscard(side, sideKey) {
  if (side.stones < 2 || side.discard.length === 0) return false;
  if (sideKey === "enemy") {
    const index = chooseEnemyRecoverIndex(side);
    const [card] = side.discard.splice(index, 1);
    side.hand.push(card);
    afterRecoverFragment(side, card);
    side.stones -= 2;
    log(`对手消耗 2 枚灵石，从灵宝碎片重铸一张${LABEL[card.element]}系卡。`);
    return true;
  }
  const index = await askTrigger({
    title: "炼宝重铸",
    text: "消耗 2 枚灵石，从灵宝碎片选择 1 张卡加入手牌。",
    options: side.discard.map((card, cardIndex) => ({
      label: `${card.name} · ${LABEL[card.element]} · ${TYPE[card.type]}`,
      value: cardIndex,
    })),
    cancelLabel: "返回",
    cancelValue: null,
  });
  if (index == null || !side.discard[index]) return false;
  const [card] = side.discard.splice(index, 1);
  side.hand.push(card);
  afterRecoverFragment(side, card);
  side.stones -= 2;
  state.hasImbued = true;
  playElementVfx("player", "core", "synergy", card.element);
  log(`玩家消耗 2 枚灵石炼宝重铸，将${card.name}加入手牌。`);
  render();
  return true;
}

function chooseEnemyRecoverIndex(side) {
  const priority = ["attack", "destroy", "counter", "ongoing", "heal", "defense"];
  for (const type of priority) {
    const index = side.discard.findIndex((card) => card.type === type);
    if (index >= 0) return index;
  }
  return side.discard.length - 1;
}

function commitHandPlacement(handIndex, targetSlot, faceDown) {
  const card = state.player.hand[handIndex];
  if (!card) return false;
  if (!canPlaceCardAt(state.player, card, targetSlot)) {
    const message = `${card.name}不能放入${LABEL[targetSlot] || "该"}槽：${placeSlotReason(state.player, card, targetSlot)}。`;
    log(message);
    showToast(message);
    render();
    return false;
  }
  const oldSlot = state.player.board[targetSlot];
  discardCard(state.player, oldSlot?.card);
  state.player.board[targetSlot] = createSlot(card, targetSlot, "player", faceDown);
  state.player.hand.splice(handIndex, 1);
  state.selectedHand = null;
  state.selected = targetSlot;
  const posture = faceDown ? "里侧" : "表侧";
  log(oldSlot ? `玩家以${posture}${card.name}替换${LABEL[targetSlot]}槽的${oldSlot.card.name}。` : `玩家将${card.name}${posture}放入${LABEL[targetSlot]}槽。`);
  if (state.tutorial && card.name === "朱雀焚阵" && targetSlot === "fire") completeTutorialStep(1, 2);
  render();
  return true;
}

async function placeSelectedHandAt(targetSlot) {
  if (state.winner || state.active !== "player" || !["main1", "main2"].includes(state.phase) || state.selectedHand == null) return false;
  const handIndex = state.selectedHand;
  const card = state.player.hand[handIndex];
  if (!card) return false;
  if (!canPlaceCardAt(state.player, card, targetSlot)) {
    const message = `${card.name}不能放入${LABEL[targetSlot] || "该"}槽：${placeSlotReason(state.player, card, targetSlot)}。`;
    log(message);
    showToast(message);
    render();
    return false;
  }
  let faceDown = false;
  if (targetSlot !== "core" && card.type !== "eye") {
    const posture = await askTrigger({
      title: "放置姿态",
      text: `将${card.name}放入${LABEL[targetSlot]}槽。请选择表侧或里侧。`,
      options: [
        { label: "表侧放置", value: false },
        { label: "里侧放置", value: true },
      ],
      cancelLabel: "返回",
      cancelValue: null,
    });
    if (posture == null) {
      render();
      return false;
    }
    faceDown = posture;
  }
  return commitHandPlacement(handIndex, targetSlot, faceDown);
}

async function placeSelectedHand() {
  if (state.winner || state.active !== "player" || !["main1", "main2"].includes(state.phase) || state.selectedHand == null) return;
  const handIndex = state.selectedHand;
  const card = state.player.hand[handIndex];
  if (!card) return;
  if (state.selected) {
    await placeSelectedHandAt(state.selected);
    return;
  }
  const choices = placeChoices(state.player, card);
  const targetSlot = await askTrigger({
    title: "选择放置位置",
    text: placeDialogText(state.player, card, choices),
    options: choices,
    cancelLabel: "返回",
    cancelValue: null,
  });
  if (targetSlot == null) return;
  await placeSelectedHandAt(targetSlot);
}

function spellTargetOptions(element) {
  if (element === "earth") {
    return ELEMENTS
      .filter((slot) => slot !== "core" && state.player.board[slot])
      .map((slot) => ({
        label: `${LABEL[slot]}槽：${visibleName(state.player.board[slot], false)}（+1 灵力）`,
        value: slot,
      }));
  }
  if (element === "metal") {
    return ELEMENTS
      .filter((slot) => state.enemy.board[slot])
      .map((slot) => {
        const target = state.enemy.board[slot];
        const amount = target.card.element === "wood" ? 2 : 1;
        return {
          label: `${LABEL[slot]}槽：${visibleName(target, true)}（-${amount} 灵力）`,
          value: slot,
        };
      });
  }
  return [];
}

function removeSelectedSpellCard() {
  const index = state.selectedHand;
  if (index == null) return null;
  const card = discardHandCard(state.player, index);
  state.selectedHand = null;
  return card || null;
}

function burnHandCardForSpell(side, index) {
  const card = discardHandCard(side, index);
  if (side === state.player && state.selectedHand != null && index < state.selectedHand) {
    state.selectedHand -= 1;
  }
  return card;
}

async function askBurnHandCard(excludeIndex, title, text, predicate = () => true) {
  const options = state.player.hand
    .map((card, index) => ({ card, index }))
    .filter(({ card, index }) => index !== excludeIndex && predicate(card))
    .map(({ card, index }) => ({
      label: `焚化${card.name} · ${LABEL[card.element]} · ${TYPE[card.type]}`,
      value: index,
    }));
  if (options.length === 0) return null;
  const picked = await askTrigger({
    title,
    text,
    options: [
      ...options,
      { label: "不焚化手牌", value: null },
    ],
    cancelLabel: "不焚化",
    cancelValue: null,
  });
  if (picked == null || !state.player.hand[picked]) return null;
  return burnHandCardForSpell(state.player, picked);
}

async function askConsumeFragment(title, text, predicate = () => true) {
  const options = state.player.discard
    .map((card, index) => ({ card, index }))
    .filter(({ card }) => predicate(card))
    .map(({ card, index }) => ({
      label: `${card.name} · ${LABEL[card.element]} · ${TYPE[card.type]}`,
      value: index,
    }));
  if (options.length === 0) return null;
  const picked = await askTrigger({
    title,
    text,
    options: [
      ...options,
      { label: "不炼化碎片", value: null },
    ],
    cancelLabel: "不炼化",
    cancelValue: null,
  });
  if (picked == null || !state.player.discard[picked]) return null;
  const [card] = state.player.discard.splice(picked, 1);
  return card || null;
}

function hasBurnableHand(excludeIndex, predicate = () => true) {
  return state.player.hand.some((card, index) => index !== excludeIndex && predicate(card));
}

function hasFragment(predicate = () => true) {
  return state.player.discard.some(predicate);
}

function enemySlotOptions(predicate = () => true, suffix = "") {
  return ELEMENTS
    .filter((slot) => state.enemy.board[slot] && predicate(state.enemy.board[slot], slot))
    .map((slot) => {
      const target = state.enemy.board[slot];
      return {
        label: `${LABEL[slot]}槽：${visibleName(target, true)}${suffix}`,
        value: slot,
      };
    });
}

function playerSlotOptions(predicate = () => true, suffix = "") {
  return ELEMENTS
    .filter((slot) => slot !== "core" && state.player.board[slot] && predicate(state.player.board[slot], slot))
    .map((slot) => {
      const target = state.player.board[slot];
      return {
        label: `${LABEL[slot]}槽：${visibleName(target, false)}${suffix}`,
        value: slot,
      };
    });
}

async function askSlot(title, text, options) {
  if (options.length === 0) return null;
  return askTrigger({
    title,
    text,
    options,
    cancelLabel: "返回",
    cancelValue: null,
  });
}

function generatedElementOfCard(card) {
  return GENERATES[card.element] || randomFive();
}

async function castSelectedSpell() {
  if (state.winner || state.active !== "player" || !["main1", "main2"].includes(state.phase) || state.selectedHand == null) return;
  if (state.hasSpellCast) {
    showToast("本回合已经打出过法诀。");
    return;
  }
  const card = state.player.hand[state.selectedHand];
  if (!card || card.type === "eye") {
    showToast("阵眼不能作为手牌法诀打出。");
    return;
  }
  const spell = SPELL_TEXT[card.element];
  const confirm = await askTrigger({
    title: spell.name,
    text: `${card.name}将作为手牌法诀打出。${spell.full}`,
    options: [
      { label: `打出${spell.name}`, value: true },
    ],
    cancelLabel: "返回",
    cancelValue: false,
  });
  if (!confirm) return;
  const element = card.element;
  const spellIndex = state.selectedHand;
  const burnable = hasBurnableHand(spellIndex);
  const fragments = state.player.discard.length;
  const modes = {
    wood: [
      { label: state.player.board.wood ? "木生火：定向抽 2 张火卡" : "引火芽：定向抽 1 张火卡", value: "wood_fire" },
      { label: "灵根嫁接：炼化 1 碎片，抽其相生属性卡", value: "wood_graft", disabled: fragments === 0 },
      { label: "缠根破阵：敌方一槽 -2 灵力", value: "wood_bind", disabled: enemySlotOptions().length === 0 },
    ],
    fire: [
      { label: "爆燃蓄势：下一次攻击强化，可焚化手牌增幅", value: "fire_charge" },
      { label: "焚手换牌：焚化 1 手牌，抽 2 张火卡", value: "fire_cycle", disabled: !burnable },
      { label: "灼阵毁卡：焚化 1 手牌，敌方一槽受灼烧", value: "fire_burn_slot", disabled: !burnable || enemySlotOptions().length === 0 },
    ],
    earth: [
      { label: "厚土固阵：己方一槽补灵，可炼碎片加量", value: "earth_fortify", disabled: playerSlotOptions().length === 0 },
      { label: "埋玉生山：焚化 1 手牌，抽土卡并护最低灵力槽", value: "earth_bury", disabled: !burnable },
      { label: "镇封灵脉：炼化 1 碎片，敌方一槽 -1 并抽土卡", value: "earth_seal", disabled: fragments === 0 || enemySlotOptions().length === 0 },
    ],
    metal: [
      { label: "庚金斩灵：敌方一槽削灵，可焚手加深", value: "metal_slash", disabled: enemySlotOptions().length === 0 },
      { label: "裂器拆阵：焚化 1 手牌，拆除低灵力卡槽", value: "metal_break", disabled: !burnable || enemySlotOptions().length === 0 },
      { label: "淘金成刃：炼化 1 碎片，定向抽 1 张金卡", value: "metal_refine", disabled: fragments === 0 },
    ],
    water: [
      { label: "沧海重铸：从灵宝碎片重铸 1 张水卡并回血", value: "water_recover", disabled: !hasFragment((fragment) => fragment.element === "water") },
      { label: "潮汐滤抽：焚化 1 手牌，定向抽水卡", value: "water_cycle", disabled: !burnable },
      { label: "净瓶化气：炼化 1 碎片，回血并抽其同属性卡", value: "water_purify", disabled: fragments === 0 },
    ],
  }[element] || [];

  const mode = await askTrigger({
    title: spell.name,
    text: "选择本张法诀的发动模式。灰色选项代表当前缺少目标、手牌代价或灵宝碎片。",
    options: modes,
    cancelLabel: "返回",
    cancelValue: null,
  });
  if (!mode) return;

  const context = { spellIndex, mode };
  const resolved = await resolveSpellMode(card, context);
  if (!resolved) return;
  const used = removeSelectedSpellCard();
  if (!used) return;
  resolved(used);
  state.hasSpellCast = true;
  if (state.tutorial) completeTutorialStep(7, 8);
  checkWinner();
  render();
}

async function resolveSpellMode(card, context) {
  const { spellIndex, mode } = context;
  if (mode === "wood_fire") {
    const amount = state.player.board.wood ? 2 : 1;
    return (used) => {
      for (let i = 0; i < amount; i += 1) drawElementToHand(state.player, "fire");
      playElementVfx("player", "wood", "synergy", "wood");
      log(`玩家打出${used.name}：木生火，定向抽 ${amount} 张火系卡。`);
    };
  }
  if (mode === "wood_graft") {
    const fragment = await askConsumeFragment("灵根嫁接", "炼化 1 个灵宝碎片，定向抽取该碎片相生属性的卡。");
    if (!fragment) return null;
    const drawElement = generatedElementOfCard(fragment);
    return (used) => {
      drawElementToHand(state.player, drawElement);
      playElementVfx("player", "wood", "synergy", "wood");
      log(`玩家打出${used.name}：炼化${fragment.name}，抽 1 张${LABEL[drawElement]}系卡。`);
    };
  }
  if (mode === "wood_bind") {
    const targetSlot = await askSlot("缠根破阵", "选择敌方一个卡槽削去 2 灵力。", enemySlotOptions());
    if (!targetSlot) return null;
    return (used) => {
      reduceSlotSpirit(state.enemy, targetSlot, 2);
      playElementVfx("enemy", targetSlot, "destroy", "wood");
      log(`玩家打出${used.name}：缠根破阵，削去${LABEL[targetSlot]}槽 2 点灵力。`);
    };
  }
  if (mode === "fire_charge") {
    const cost = await askBurnHandCard(spellIndex, "爆燃蓄势", "可焚化 1 张手牌强化下一次攻击；焚化木卡收益最高。");
    const bonus = cost ? (cost.element === "wood" ? 3 : 2) : 1;
    return (used) => {
      state.pendingSpell = { type: "fire", cardName: used.name, bonus, overcomeBonus: 1 };
      playElementVfx("player", "fire", "synergy", "fire");
      log(`玩家打出${used.name}：爆燃蓄势，下一次攻击 +${bonus}，若克制再 +1${cost ? `；焚化${cost.name}` : ""}。`);
    };
  }
  if (mode === "fire_cycle") {
    const cost = await askBurnHandCard(spellIndex, "焚手换牌", "焚化 1 张手牌，定向抽 2 张火系卡。");
    if (!cost) return null;
    return (used) => {
      drawElementToHand(state.player, "fire");
      drawElementToHand(state.player, "fire");
      playElementVfx("player", "fire", "synergy", "fire");
      log(`玩家打出${used.name}：焚化${cost.name}，抽 2 张火系卡。`);
    };
  }
  if (mode === "fire_burn_slot") {
    const targetSlot = await askSlot("灼阵毁卡", "选择敌方一个卡槽。焚化手牌后造成 2 点灼烧，焚化木卡改为 3 点。", enemySlotOptions());
    if (!targetSlot) return null;
    const cost = await askBurnHandCard(spellIndex, "灼阵代价", "焚化 1 张手牌作为灼阵代价。");
    if (!cost) return null;
    const damage = cost.element === "wood" ? 3 : 2;
    return (used) => {
      reduceSlotSpirit(state.enemy, targetSlot, damage);
      playElementVfx("enemy", targetSlot, "destroy", "fire");
      log(`玩家打出${used.name}：焚化${cost.name}灼阵，${LABEL[targetSlot]}槽失去 ${damage} 灵力。`);
    };
  }
  if (mode === "earth_fortify") {
    const targetSlot = await askSlot("厚土固阵", "选择己方一个非中台卡槽补灵。可炼化碎片把补灵从 1 提高到 2。", playerSlotOptions());
    if (!targetSlot) return null;
    const fragment = await askConsumeFragment("厚土炼片", "可炼化 1 个灵宝碎片，使本次补灵从 1 提高到 2。");
    const amount = fragment ? 2 : 1;
    return (used) => {
      state.player.board[targetSlot].stones += amount;
      playElementVfx("player", targetSlot, "defense", "earth");
      floatSlot("player", targetSlot, amount);
      log(`玩家打出${used.name}：${LABEL[targetSlot]}槽补充 ${amount} 灵力${fragment ? `，炼化${fragment.name}` : ""}。`);
    };
  }
  if (mode === "earth_bury") {
    const cost = await askBurnHandCard(spellIndex, "埋玉生山", "焚化 1 张手牌，抽 1 张土系卡，并让己方最低灵力槽 +1。");
    if (!cost) return null;
    return (used) => {
      drawElementToHand(state.player, "earth");
      const boosted = boostLowestSpirit(state.player, 1);
      if (boosted) floatSlot("player", boosted.slot, 1);
      playElementVfx("player", boosted?.slot || "earth", "synergy", "earth");
      log(`玩家打出${used.name}：埋下${cost.name}，抽 1 张土系卡${boosted ? `，${LABEL[boosted.slot]}槽 +1 灵力` : ""}。`);
    };
  }
  if (mode === "earth_seal") {
    const targetSlot = await askSlot("镇封灵脉", "炼化 1 个灵宝碎片，敌方一槽 -1 灵力，并抽 1 张土系卡。", enemySlotOptions());
    if (!targetSlot) return null;
    const fragment = await askConsumeFragment("镇封代价", "选择炼化的灵宝碎片。");
    if (!fragment) return null;
    return (used) => {
      reduceSlotSpirit(state.enemy, targetSlot, 1);
      drawElementToHand(state.player, "earth");
      playElementVfx("enemy", targetSlot, "destroy", "earth");
      log(`玩家打出${used.name}：炼化${fragment.name}镇封${LABEL[targetSlot]}槽，并抽 1 张土系卡。`);
    };
  }
  if (mode === "metal_slash") {
    const targetSlot = await askSlot("庚金斩灵", "选择敌方一个卡槽削灵；木系目标额外 -1，可焚化手牌加深削灵。", enemySlotOptions());
    if (!targetSlot) return null;
    const cost = await askBurnHandCard(spellIndex, "庚金焚器", "可焚化 1 张手牌，使削灵额外 -1；焚化土卡改为额外 -2。");
    return (used) => {
      const target = state.enemy.board[targetSlot];
      const costLoss = cost ? (cost.element === "earth" ? 2 : 1) : 0;
      const loss = (target?.card.element === "wood" ? 2 : 1) + costLoss;
      reduceSlotSpirit(state.enemy, targetSlot, loss);
      playElementVfx("enemy", targetSlot, "destroy", "metal");
      log(`玩家打出${used.name}：庚金斩灵，削去${LABEL[targetSlot]}槽 ${loss} 灵力${cost ? `；焚化${cost.name}` : ""}。`);
    };
  }
  if (mode === "metal_break") {
    const targetSlot = await askSlot("裂器拆阵", "选择敌方卡槽。焚化手牌后，若目标灵力不高于代价灵力+1则直接破坏，否则削等量灵力。", enemySlotOptions());
    if (!targetSlot) return null;
    const cost = await askBurnHandCard(spellIndex, "裂器代价", "焚化 1 张手牌作为拆阵代价。");
    if (!cost) return null;
    const power = Math.max(1, cost.value || 1) + 1;
    return (used) => {
      const target = state.enemy.board[targetSlot];
      if (target && target.mode !== "eye" && slotSpirit(target) <= power) {
        removeSlot(state.enemy, targetSlot);
        playElementVfx("enemy", targetSlot, "destroy", "metal");
        log(`玩家打出${used.name}：焚化${cost.name}裂器，直接破坏${LABEL[targetSlot]}槽。`);
      } else {
        reduceSlotSpirit(state.enemy, targetSlot, power);
        playElementVfx("enemy", targetSlot, "destroy", "metal");
        log(`玩家打出${used.name}：焚化${cost.name}裂器，削去${LABEL[targetSlot]}槽 ${power} 灵力。`);
      }
    };
  }
  if (mode === "metal_refine") {
    const fragment = await askConsumeFragment("淘金成刃", "炼化 1 个灵宝碎片，定向抽 1 张金系卡。");
    if (!fragment) return null;
    return (used) => {
      drawElementToHand(state.player, "metal");
      playElementVfx("player", "metal", "synergy", "metal");
      log(`玩家打出${used.name}：炼化${fragment.name}，抽 1 张金系卡。`);
    };
  }
  if (mode === "water_recover") {
    const fragment = await askConsumeFragment("沧海重铸", "选择 1 张水系灵宝碎片加入手牌，并回复 1。", (item) => item.element === "water");
    if (!fragment) return null;
    return (used) => {
      state.player.hand.push(fragment);
      afterRecoverFragment(state.player, fragment);
      changeHp(state.player, 1);
      playElementVfx("player", "water", "heal", "water");
      log(`玩家打出${used.name}：重铸${fragment.name}并回复 1 生命。`);
    };
  }
  if (mode === "water_cycle") {
    const cost = await askBurnHandCard(spellIndex, "潮汐滤抽", "焚化 1 张手牌。若焚化金卡，抽 2 张水系卡；否则抽 1 张水系卡并回复 1。");
    if (!cost) return null;
    const amount = cost.element === "metal" ? 2 : 1;
    return (used) => {
      for (let i = 0; i < amount; i += 1) drawElementToHand(state.player, "water");
      if (amount === 1) changeHp(state.player, 1);
      playElementVfx("player", "water", "heal", "water");
      log(`玩家打出${used.name}：焚化${cost.name}，抽 ${amount} 张水系卡${amount === 1 ? "并回复 1" : ""}。`);
    };
  }
  if (mode === "water_purify") {
    const fragment = await askConsumeFragment("净瓶化气", "炼化 1 个灵宝碎片，回复生命并抽 1 张该碎片同属性卡。");
    if (!fragment) return null;
    return (used) => {
      drawElementToHand(state.player, fragment.element);
      const heal = state.turnDamage.player > 0 ? 2 : 1;
      changeHp(state.player, heal);
      playElementVfx("player", "water", "heal", "water");
      log(`玩家打出${used.name}：净化${fragment.name}，抽 1 张${LABEL[fragment.element]}系卡并回复 ${heal}。`);
    };
  }
  return null;
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
  if (state.tutorial?.step === TUTORIAL_STEPS.length - 1) {
    finishTutorial();
  }
  if (state.phase === "main1") state.phase = "activation";
  else if (state.phase === "activation") state.phase = "main2";
  else if (state.phase === "main2") state.phase = "end";
  else if (state.phase === "end") {
    await endTurn();
    return;
  }
  log(`进入${phaseLabel(state.phase)}。`);
  if (state.tutorial) {
    if (state.phase === "activation") completeTutorialStep(3, 4);
    else if (state.phase === "main2") completeTutorialStep(6, 7);
    else if (state.phase === "end") completeTutorialStep(7, 8);
  }
  render();
}

async function runEnemyTurn() {
  if (state.winner) return;
  const enemy = state.enemy;
  aiState.failedThisTurn = false;
  log("对手进入准备阶段。");
  forceAiTaunt();
  await waitForLogIdle();
  const imbueAction = await chooseEnemyAction("imbue", buildEnemyImbueActions(enemy));
  if (imbueAction?.kind === "imbue") {
    enemy.board[imbueAction.slot].stones += 1;
    enemy.stones -= 1;
    log(`对手为${LABEL[imbueAction.slot]}槽补充 1 点灵力。`);
    maybeAiTaunt("imbue", imbueAction);
    await waitForLogIdle();
  } else if (imbueAction?.kind === "stoneDraw") {
    enemy.stones -= 2;
    drawToHand(enemy);
    log("对手消耗 2 枚灵石炼石补卡，抽 1 张手卡。");
    maybeAiTaunt("imbue", imbueAction);
    await waitForLogIdle();
  } else if (imbueAction?.kind === "recover") {
    await recoverFromDiscard(enemy, "enemy");
    maybeAiTaunt("imbue", imbueAction);
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
  maybeAiTaunt("end", null);
  await waitForLogIdle();
  setTimeout(() => {
    endTurn();
  }, 800);
}

function buildEnemyImbueActions(enemy) {
  const actions = [{ id: "pass", kind: "pass", label: "不补灵" }];
  if (enemy.stones <= 0) return actions;
  if (enemy.stones >= 2) {
    actions.push({
      id: "stone:draw",
      kind: "stoneDraw",
      label: "消耗 2 灵石炼石补卡，抽 1 张手卡",
    });
    if (enemy.discard.length > 0) {
      actions.push({
        id: "stone:recover",
        kind: "recover",
        label: `消耗 2 灵石从灵宝碎片重铸 1 张卡（碎片 ${enemy.discard.length}）`,
      });
    }
  }
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
  const scoredActions = annotateEnemyActions(decision, actions);
  const llmAction = await chooseEnemyActionByModel(decision, scoredActions);
  if (llmAction) return llmAction;
  return chooseEnemyActionLocal(decision, scoredActions);
}

function chooseEnemyActionLocal(decision, actions) {
  const ranked = [...actions].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  if (decision === "imbue") return ranked[0]?.aiScore > 0 ? ranked[0] : actions[0];
  if (decision === "activation") return ranked[0]?.aiScore > 8 ? ranked[0] : actions[0];
  return ranked[0]?.aiScore > 6 ? ranked[0] : actions[0];
}

function annotateEnemyActions(decision, actions) {
  return actions.map((action) => {
    const insight = scoreEnemyAction(decision, action);
    return { ...action, aiScore: insight.score, aiReason: insight.reason, aiRisk: insight.risk };
  });
}

function scoreEnemyAction(decision, action) {
  if (action.kind === "pass") return { score: decision === "activation" ? 3 : 0, reason: "观望", risk: "让出节奏" };
  if (decision === "imbue") return scoreEnemyImbue(action);
  if (decision === "activation") return scoreEnemyActivation(action);
  return scoreEnemyPlacement(action);
}

function slotSpirit(slotState) {
  return slotState ? (slotState.hp || 0) + (slotState.stones || 0) : 0;
}

function visibleEnemyTarget(slot) {
  const target = state.player.board[slot];
  if (!target) return null;
  if (target.faceDown) {
    return {
      mode: target.mode,
      hidden: true,
      element: target.card.element,
      spirit: slotSpirit(target),
      type: target.card.type,
    };
  }
  return {
    mode: target.mode,
    hidden: false,
    element: target.card.element,
    spirit: slotSpirit(target),
    type: target.card.type,
    name: target.card.name,
  };
}

function estimateEnemyAttack(source, targetSlot) {
  const card = source.card;
  const target = visibleEnemyTarget(targetSlot);
  const context = buildActionContext(state.enemy, state.player, card, source.slot, targetSlot, null);
  const bestAssist = handAssistOptions(state.enemy, state.player, card, targetSlot).sort((a, b) => b.bonus - a.bonus)[0];
  const assistBonus = bestAssist?.bonus || 0;
  const assistReason = bestAssist ? `，可用${bestAssist.reason}` : "";
  const base = card.value + (source.slotState?.stones || 0);
  const spirit = base + context.bonus + assistBonus;
  const pressure = hasEyePressure(state.enemy, state.player) ? 1 : 0;
  const cycleBonus = context.hasCycle && context.eye ? 10 : 0;
  const chainBonus = context.formation.bonus * 7 + assistBonus * 9 + pressure * 12 + cycleBonus;
  if (!target) {
    const guardTax = guardCandidates(state.player).length > 0 ? 18 : 0;
    return {
      damage: spirit,
      breaks: false,
      score: 42 + spirit * 7 + chainBonus + (state.player.hp <= spirit + 2 ? 45 : 0) - guardTax,
      reason: `空槽直击 ${spirit}${assistReason}${context.hasCycle ? "，周天可续压" : ""}`,
      risk: guardTax ? "可能被防守位护阵拦截并触发反击" : "对方无防守位时较安全",
    };
  }
  if (target.mode === "attack") {
    const attackerPower = spirit * attackScale(card.element, target.element);
    const defenderPower = target.spirit * attackScale(target.element, card.element);
    const diff = attackerPower - defenderPower;
    return {
      damage: Math.max(0, diff),
      breaks: diff > 0,
      score: diff > 0 ? 38 + diff * 8 + chainBonus : Math.max(1, 16 + diff * 5 + chainBonus / 2),
      reason: diff > 0 ? `攻槽相减可击破，溢出 ${diff}${assistReason}` : `攻槽相减不占优 ${attackerPower}-${defenderPower}${assistReason}`,
      risk: diff > 0 ? "消耗攻击卡换血" : `会被攻击槽反震 ${Math.abs(diff)} 生命`,
    };
  }
  const scale = attackScale(card.element, target.element);
  const finalSpirit = spirit * scale;
  const expectedDefenseTax = target.mode === "defense" ? (target.hidden ? 7 : target.type === "counter" ? 13 : target.type === "heal" ? 8 : 6) : 0;
  const diff = finalSpirit - target.spirit;
  const priority = target.mode === "eye" ? 22 : target.mode === "ongoing" ? 18 : target.mode === "defense" ? 8 : 0;
  const overcomeBonus = isOvercome(card.element, target.element) ? 14 : 0;
  return {
    damage: Math.max(0, diff),
    breaks: diff > 0,
    score: 24 + priority + overcomeBonus + chainBonus + Math.max(0, diff) * 6 - expectedDefenseTax + (target.hidden ? -4 : 0),
    reason: `${scale > 1 ? "克制/相生放大" : "普通攻击"}，预计${diff > 0 ? `击破溢出 ${diff}` : `削灵 ${finalSpirit}`}${assistReason}${context.hasCycle ? "，可触发周天" : ""}`,
    risk: target.mode === "defense" ? "可能触发防守/反击/联协" : "消耗攻击卡",
  };
}

function scoreEnemyActivation(action) {
  const card = action.source?.card;
  if (!card) return { score: 0, reason: "无来源", risk: "无效" };
  if (card.type === "attack") return estimateEnemyAttack(action.source, action.target);
  if (card.type === "destroy") {
    const target = visibleEnemyTarget(action.target);
    if (!target) return { score: 1, reason: "无目标", risk: "浪费销毁" };
    const priority = target.mode === "eye" ? 58 : target.mode === "ongoing" ? 48 : target.mode === "defense" ? 36 : 28;
    const hiddenBonus = target.hidden ? 8 : 0;
    const spiritBonus = Math.min(18, target.spirit * 3);
    return {
      score: priority + hiddenBonus + spiritBonus,
      reason: `销毁${target.hidden ? "里侧" : target.name || TYPE[target.type] || "目标"}，切断阵法`,
      risk: "销毁卡一次性消耗",
    };
  }
  if (card.type === "heal") {
    const missing = MAX_HP - state.enemy.hp;
    return {
      score: missing >= card.value ? 20 + missing * 3 : 5,
      reason: `回复 ${card.value + (action.source.slotState?.stones || 0)}`,
      risk: missing <= 0 ? "满血收益低" : "少一次进攻",
    };
  }
  if (card.type === "counter" || card.type === "defense") {
    return {
      score: state.enemy.hp <= 6 ? 16 : 4,
      reason: "主动运转防守卡只回复少量生命",
      risk: "会消耗防守资源",
    };
  }
  if (card.type === "ongoing") {
    const damaged = action.source.slotState?.hp < action.source.slotState?.maxHp;
    return { score: damaged ? 24 : 10, reason: "永续补灵保场", risk: "不直接压血" };
  }
  if (card.type === "eye") return { score: 18, reason: "阵眼产灵石", risk: "不直接压血" };
  return { score: 0, reason: "未知动作", risk: "" };
}

function scoreEnemyPlacement(action) {
  const card = state.enemy.hand[action.handIndex];
  if (!card) return { score: 0, reason: "手卡不存在", risk: "无效" };
  const oldSlot = state.enemy.board[action.slot];
  const oldSpirit = slotSpirit(oldSlot);
  let score = 12 + card.value * 2;
  const lane = placementLane(card);
  if (action.slot === "core") score += card.type === "eye" ? 36 : 8;
  if (!oldSlot) score += 12;
  if (oldSlot && slotLane(oldSlot) === lane && card.value > oldSpirit) score += 14 + (card.value - oldSpirit) * 4;
  if (oldSlot?.mode === "eye" && card.type !== "eye") score -= 20;
  if (card.type === "attack") score += 22 + (countAttack(state.enemy) < 3 ? 8 : 0);
  if (card.type === "destroy") score += 18;
  if (card.type === "counter") score += 15;
  if (card.type === "defense" || card.type === "heal") score += 10;
  if (card.type === "ongoing") score += 16;
  if (card.type === "eye") score += state.enemy.board.core?.mode === "eye" ? 8 : 30;
  if (action.faceDown) {
    score += card.type === "attack" ? -5 : 11;
  } else if (card.type === "attack") {
    score += 6;
  }
  return {
    score,
    reason: oldSlot ? `替换${TYPE[oldSlot.card.type]}，建立${TYPE[card.type]}节奏` : `补${LABEL[action.slot]}槽${TYPE[card.type]}`,
    risk: oldSlot ? "会失去原卡" : (["heal", "ongoing", "eye"].includes(card.type) ? "占用卡槽但不占攻防名额" : "占用攻防名额"),
  };
}

function scoreEnemyImbue(action) {
  if (action.kind === "stoneDraw") {
    const lowHand = state.enemy.hand.length <= 3;
    return {
      score: lowHand ? 34 : 14,
      reason: "炼石补卡，缓解手牌不足",
      risk: "消耗 2 灵石，不能补强卡槽",
    };
  }
  if (action.kind === "recover") {
    const hasAttack = state.enemy.discard.some((card) => card.type === "attack" || card.type === "destroy");
    return {
      score: hasAttack || state.enemy.hand.length <= 3 ? 38 : 22,
      reason: "从灵宝碎片重铸关键卡",
      risk: "消耗 2 灵石，重铸后仍需主阶段使用",
    };
  }
  const slotState = state.enemy.board[action.slot];
  if (!slotState) return { score: 0, reason: "无卡可补", risk: "无效" };
  let score = 8;
  if (slotState.mode === "attack") {
    const targets = FIVE.filter((target) => canTarget(slotState.card, action.slot, target));
    const best = Math.max(...targets.map((target) => estimateEnemyAttack({ card: slotState.card, slot: action.slot, slotState }, target).score), 0);
    score += Math.min(38, best / 2);
  } else if (slotState.mode === "ongoing") {
    score += 16;
  } else if (slotState.mode === "defense") {
    score += slotState.card.type === "counter" ? 14 : 10;
  }
  if (slotState.stones <= 0) score += 4;
  return {
    score,
    reason: `强化${LABEL[action.slot]}槽${TYPE[slotState.card.type]}`,
    risk: "消耗灵石",
  };
}

async function executeEnemyPlacement(action, phaseName) {
  if (!action || action.kind !== "place") {
    log(`对手${phaseName}没有放置手卡。`);
    return false;
  }
  const card = state.enemy.hand[action.handIndex];
  if (!card || !canPlaceCardAt(state.enemy, card, action.slot)) {
    log(`对手${phaseName}放置失败，改为观望。`);
    return false;
  }
  const oldSlot = state.enemy.board[action.slot];
  discardCard(state.enemy, oldSlot?.card);
  state.enemy.board[action.slot] = createSlot(card, action.slot, "enemy", action.faceDown);
  state.enemy.hand.splice(action.handIndex, 1);
  log(oldSlot ? `对手将一张手卡替换${LABEL[action.slot]}槽。` : `对手将一张手卡放入${LABEL[action.slot]}槽。`);
  maybeAiTaunt("place", action);
  render();
  return true;
}

async function executeEnemyActivation(action) {
  if (!action || action.kind !== "activate") {
    log("对手按兵不动。");
    return;
  }
  await resolveCard(state.enemy, state.player, action.source, action.target);
  maybeAiTaunt(action.source.card.type === "attack" ? "attack" : "activate", action);
  checkWinner();
  render();
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
      score: Math.round(action.aiScore || 0),
      reason: action.aiReason || "",
      risk: action.aiRisk || "",
      source: action.source ? {
        slot: action.source.slot,
        card: serializeCardForAi(action.source.card),
        spirit: slotSpirit(action.source.slotState),
        mode: action.source.slotState ? modeLabel(action.source.slotState) : "手卡",
      } : null,
      target: action.target ? {
        slot: action.target,
        state: serializeSlotForAi(state.player.board[action.target], "player", action.target),
      } : null,
    }));
    const response = await fetch(normalizeChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    const saved = JSON.parse(localStorage.getItem(AI_CONFIG_KEY) || "{}");
    if ("apiKey" in saved) {
      delete saved.apiKey;
      localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(saved));
    }
    return { ...DEFAULT_AI_CONFIG, ...saved };
  } catch {
    return { ...DEFAULT_AI_CONFIG };
  }
}

function saveAiConfig(config) {
  const { apiKey, ...safeConfig } = config;
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(safeConfig));
}

function buildAiSystemPrompt() {
  return [
    "你是网页卡牌游戏《斗阵 Array Duel》的对手AI，修仙阵法风格，目标是击败玩家。",
    "你只能从用户给出的 actions 数组里选择一个 actionId，不能发明动作。",
    "请只输出 JSON，例如：{\"actionId\":\"pass\"}，不要输出理由或思考过程。",
    "回合流程：准备阶段自动抽牌和给 1 灵石；主1可放置/替换；发动阶段只能发动 1 个场上卡槽；主2可继续放置/替换；结束阶段手牌超过 6 张要弃到 6。",
    "核心规则：五行槽为木、火、土、金、水，加中台。普通五行卡只能放到自身属性槽或中台；阵眼只能放中台，且不计入攻防位，中台只能表侧。",
    "场上最多 3 个攻击位、3 个伏阵位。只有防守、反击、销毁计入伏阵位；恢复、永续、阵眼不占攻防名额。替换同类型永远合法；替换不同类型或空槽不能打破三攻三伏限制。",
    "主阶段可以用手牌替换卡槽。攻击卡通常表侧压节奏；防守、反击、销毁适合里侧埋伏；恢复和永续是支援资源，不占三攻三伏；阵眼和中台用于阵法核心。",
    "发动阶段只能发动场上卡槽。中台攻击可攻击任意五行槽但不能攻击中台；销毁可以选择任意有卡的阵位，包括阵眼和里侧卡。",
    "玩家主阶段可把一张手牌直接打出为多模式法诀，类似魔法卡：木偏检索/缠根，火偏焚手爆发/灼阵，土偏补灵/镇封，金偏削灵/拆器，水偏重铸/滤抽。每种模式可能需要目标、额外焚化手牌或炼化灵宝碎片。AI 选择 actions 时不能自行打出不存在的法诀动作。",
    "每回合一次灵石动作：可为卡槽补灵；若有 2 灵石，可炼石抽 1；若灵宝碎片有卡，也可消耗 2 灵石重铸 1 张。AI 只能选择 actions 数组里列出的灵石动作。",
    "攻击空槽会直接伤害生命，但防守方可用任意防守位护阵拦截，照常触发防守、反击和相生联协。攻击攻击槽时双方按灵力和五行倍率相减，攻击方溢出伤害防守方生命；若防守攻击位更高，差值会反震攻击方生命。",
    "反击卡类似陷阱卡：翻开时不仅抵消和反伤，还会读取反击属性、被攻击槽位和攻击来源的五行生克来连锁。反击属性生被攻击槽时，可补入该槽攻击卡并加灵；被攻击槽生反击属性时，可补该槽属性手牌；反击属性克攻击来源时削弱攻击并反噬；攻击来源克反击属性时削弱并重铸/回血；同源时抽同源并让下一次攻击蓄势。",
    "攻击防守/恢复/反击/销毁/永续/里侧卡时，防守方可翻开触发防守效果，然后沿相生链联协；联协可以发动防守、恢复、反击、销毁、永续，但不能发动攻击卡。",
    "攻击防守位有风险：里侧可能是反击陷阱或恢复，并可能连续联协。攻击攻击位也有风险，撞不过会吃反震。若有更好的目标、可销毁关键阵眼、或能克制击破，应优先避开高风险反击。",
    "五行相克：木克土，土克水，水克火，火克金，金克木。五行相生：木生火，火生土，土生金，金生水，水生木。",
    "防守、恢复、反击、销毁为一次性；攻击、防守位发动后会化为灵宝碎片；被破坏、替换、联协消耗和结束弃牌也会化为灵宝碎片；永续持续占槽；阵眼持续在中台生效直到被销毁或替换。",
    "阵法策略：五行俱全和阵眼会强化周天效果；相生相克能放大攻击。优先制造克制击破、空槽直伤、拆阵眼、保护自己的强攻击/永续。",
    "actions 里包含本地AI给出的 score、reason、risk。通常选择高分动作；只有高分动作风险明显会让你亏牌或撞反击时，才选择次高分。",
    "优先策略：能斩杀就斩杀；打空槽前评估护阵反击风险；能破坏关键永续/阵眼就销毁；能克制击破就进攻；血量低时恢复；手卡少时优先炼石补卡或重铸灵宝碎片；手卡多时优先上场或替换弱牌；不要选择 pass 除非其他动作都很差。",
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

function buildAiTauntPrompt() {
  return JSON.stringify({
    request: "请作为《斗阵 Array Duel》的对手，说一句更直接、更有压迫感的挑衅台词。",
    rules: [
      "只输出一句中文台词，不要解释，不要 JSON。",
      "12 到 26 个汉字左右，短、狠、直白。",
      "可以嘲讽玩家这回合打得差、阵位烂、快输了。",
      "不要文绉绉，不要长句，不要辱骂现实身份、群体或使用脏话。",
      "最好贴合五行、阵法、灵力、破阵、卡槽等游戏主题。",
    ],
    round: state.round,
    phase: phaseLabel(state.phase),
    enemy: {
      hp: state.enemy.hp,
      stones: state.enemy.stones,
      attackCount: countAttack(state.enemy),
      defenseCount: countDefense(state.enemy),
    },
    player: {
      hp: state.player.hp,
      stones: state.player.stones,
      attackCount: countAttack(state.player),
      defenseCount: countDefense(state.player),
    },
  });
}

function localAiTaunt() {
  const taunts = [
    "你这阵摆得太散了，等着被拆吧。",
    "这点灵力也敢挡我？",
    "你的卡槽已经烂了，别硬撑。",
    "下一击，我直接打穿你的命门。",
    "你这回合打得太软了。",
    "别补了，补不回来的。",
    "这个空槽，就是我送你出局的路。",
    "你守不住，中台马上归我。",
    "三招之内，你的阵就得碎。",
    "你这手牌救不了你。",
  ];
  return taunts[Math.floor(Math.random() * taunts.length)];
}

function cleanTauntText(text) {
  const value = String(text || "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^["“”']+|["“”']+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return value.slice(0, 48) || localAiTaunt();
}

async function requestAiTaunt() {
  const config = getAiConfig();
  if (!config.enabled || !config.baseUrl || !config.model) return localAiTaunt();
  try {
    const response = await fetch(normalizeChatEndpoint(config.baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.85,
        max_tokens: 80,
        messages: [
          { role: "system", content: "你是《斗阵 Array Duel》的强势对手，只说短促、直白、有压迫感的游戏挑衅台词。不要解释，不要文绉绉。" },
          { role: "user", content: buildAiTauntPrompt() },
        ],
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || data.output_text || "";
    return cleanTauntText(content);
  } catch {
    return localAiTaunt();
  }
}

function showAiTaunt(text) {
  const bubble = document.querySelector("#aiTauntBubble");
  const content = document.querySelector("#aiTauntText");
  if (!bubble || !content) return;
  content.textContent = cleanTauntText(text);
  clearTimeout(showAiTaunt.timer);
  bubble.hidden = false;
  requestAnimationFrame(() => bubble.classList.add("show"));
  showAiTaunt.timer = setTimeout(() => {
    bubble.classList.remove("show");
    setTimeout(() => {
      if (!bubble.classList.contains("show")) bubble.hidden = true;
    }, 180);
  }, 4200);
}

function forceAiTaunt() {
  aiState.lastTauntAt = Date.now();
  showAiTaunt(localAiTaunt());
  if (aiState.tauntInFlight) return;
  aiState.tauntInFlight = true;
  requestAiTaunt()
    .then(showAiTaunt)
    .finally(() => {
      aiState.tauntInFlight = false;
    });
}

function tauntChance(eventName, action) {
  if (state.winner) return 0;
  if (eventName === "attack") return 0.72;
  if (eventName === "activate" && action?.source?.card?.type === "destroy") return 0.62;
  if (eventName === "place" && action?.slot === "core") return 0.48;
  if (eventName === "place") return 0.34;
  if (eventName === "imbue") return 0.26;
  if (eventName === "end") return 0.22;
  return 0.25;
}

function maybeAiTaunt(eventName, action) {
  const now = Date.now();
  if (now - aiState.lastTauntAt < 3600) return;
  if (aiState.tauntInFlight) return;
  if (Math.random() > tauntChance(eventName, action)) return;
  aiState.lastTauntAt = now;
  aiState.tauntInFlight = true;
  requestAiTaunt()
    .then(showAiTaunt)
    .finally(() => {
      aiState.tauntInFlight = false;
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
    discard: `${side.discard.length}张`,
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
  const chip = document.querySelector("#aiThinking");
  const text = document.querySelector("#aiThinkingText");
  if (!chip) return Promise.resolve();
  if (visible) {
    const label = {
      imbue: "补灵",
      main1: "布局",
      activation: "推演",
      main2: "调阵",
    }[decision] || "推演";
    if (text) text.textContent = label;
    chip.hidden = false;
    requestAnimationFrame(() => chip.classList.add("show"));
    return Promise.resolve();
  } else {
    chip.classList.remove("show");
    return new Promise((resolve) => setTimeout(() => {
      if (!chip.classList.contains("show")) chip.hidden = true;
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
  discardCard(state.enemy, state.enemy.board[targetSlot]?.card);
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
      const discarded = discardHandCard(side, discardIndex);
      log(`对手弃置一张${LABEL[discarded.element]}系手卡。`);
    }
    render();
    return;
  }

  while (side.hand.length > 6) {
    const discardIndex = await askDiscard(side);
    if (discardIndex == null || !side.hand[discardIndex]) continue;
    const discarded = discardHandCard(side, discardIndex);
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
  if (state.winner) return;
  if (state.enemy.hp <= 0) state.winner = "玩家";
  else if (state.player.hp <= 0) state.winner = "对手";
  if (state.winner) {
    log(`${state.winner}获胜。`);
    showResultScreen(state.winner === "玩家" ? "victory" : "defeat");
  }
}

function showResultScreen(result) {
  if (state.resultShown) return;
  state.resultShown = true;
  const screen = document.querySelector("#resultScreen");
  const victory = document.querySelector("#victoryResult");
  const defeat = document.querySelector("#defeatResult");
  if (!screen || !victory || !defeat) return;
  screen.hidden = false;
  victory.hidden = result !== "victory";
  defeat.hidden = result !== "defeat";
  if (result === "defeat") {
    const taunt = document.querySelector("#defeatTaunt");
    if (taunt) taunt.textContent = DEFEAT_TAUNTS[Math.floor(Math.random() * DEFEAT_TAUNTS.length)];
  } else {
    awardVictoryStones();
    const form = document.querySelector("#victoryMessageForm");
    const panel = document.querySelector("#victoryMessagesPanel");
    if (form) form.hidden = false;
    if (panel) panel.hidden = true;
    const name = document.querySelector("#victoryName");
    const message = document.querySelector("#victoryMessage");
    if (name) name.value = authState.user?.nickname || localStorage.getItem("arrayDuelVictoryName") || "";
    if (message) message.value = "";
  }
}

function hideResultScreen() {
  const screen = document.querySelector("#resultScreen");
  if (screen) screen.hidden = true;
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

function canUseEnemySlotAsTarget(slot) {
  if (state.winner || state.active !== "player" || state.phase !== "activation" || state.hasActed) return false;
  const source = getSelectedSource();
  if (!source || !["attack", "destroy"].includes(source.card.type)) return false;
  if (source.card.type === "attack") return slot !== "core" && canTarget(source.card, source.slot, slot);
  return Boolean(state.enemy.board[slot]);
}

async function activateEnemySlotTarget(slot) {
  if (!canUseEnemySlotAsTarget(slot)) return false;
  const source = getSelectedSource();
  const dialog = document.querySelector("#targetDialog");
  if (dialog?.open) dialog.close();
  await activate(source.slot, slot, { fromBoardTarget: true });
  return true;
}

function askTrigger({ title, text, options, cancelLabel = "关闭", cancelValue = false, required = false }) {
  return new Promise((resolve) => {
    const dialog = document.querySelector("#triggerDialog");
    const form = dialog.querySelector("form");
    const preventSubmit = (event) => event.preventDefault();
    form?.addEventListener("submit", preventSubmit);
    document.querySelector("#triggerTitle").textContent = title;
    document.querySelector("#triggerText").textContent = text;
    const list = document.querySelector("#triggerList");
    list.innerHTML = "";
    let settled = false;
    let onCancel = null;
    let onClose = null;
    const cleanup = () => {
      form?.removeEventListener("submit", preventSubmit);
      if (onCancel) dialog.removeEventListener("cancel", onCancel);
      if (onClose) dialog.removeEventListener("close", onClose);
    };
    const settle = (value) => {
      if (settled) return;
      settled = true;
      cleanup();
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
      onCancel = (event) => {
        event.preventDefault();
        settle(cancelValue);
      };
      onClose = () => settle(cancelValue);
      dialog.addEventListener("cancel", onCancel);
      dialog.addEventListener("close", onClose);
    } else {
      onCancel = (event) => event.preventDefault();
      dialog.addEventListener("cancel", onCancel);
    }
    dialog.showModal();
  });
}

function log(text) {
  logState.queue.push(text);
  if (!logState.busy) playNextLog();
}

function classifyLog(text) {
  if (/周天|阵眼|阵势|爆发|获胜|胜利|击破|毁灭|破坏|直接承受/.test(text)) return "log-burst";
  if (/攻击|灵力相减|伤害|克制|相克/.test(text)) return "log-attack";
  if (/防守|抵消|反击|护住|格挡/.test(text)) return "log-defense";
  if (/回复|治疗|回流|恢复/.test(text)) return "log-heal";
  return "log-system";
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[char]);
}

function formatLogText(text) {
  return escapeHtml(text)
    .replace(/(周天|阵眼|阵势|爆发|获胜|胜利|击破|毁灭|破坏|直接承受|克制|相克|相生|联协|反击|回复|治疗|灵力相减)/g, '<span class="log-keyword">$1</span>')
    .replace(/([金木水火土中台])/g, '<span class="log-element">$1</span>')
    .replace(/(\d+)/g, '<span class="log-number">$1</span>');
}

function toastTitle(text) {
  if (/获胜|胜利/.test(text)) return "胜负已分";
  if (/周天阵眼/.test(text)) return "周天阵眼";
  if (/阵势爆发/.test(text)) return "阵势爆发";
  if (/五行阵势/.test(text)) return "五行相生";
  if (/属性克制|克制/.test(text)) return "属性克制";
  if (/灵力相减/.test(text)) return "灵力交锋";
  if (/发动.*攻击|攻击/.test(text)) return "发动攻击";
  if (/毁灭|破坏|破阵/.test(text)) return "破阵";
  if (/防守|抵消/.test(text)) return "防守触发";
  if (/反击/.test(text)) return "防守反击";
  if (/联协|消耗手卡/.test(text)) return "法诀联协";
  if (/回复|治疗|回流/.test(text)) return "灵息回复";
  if (/获得.*灵石|随机抽/.test(text)) return "灵力补给";
  if (/补充.*灵力|补灵/.test(text)) return "补充灵力";
  if (/进入.*准备/.test(text)) return "准备阶段";
  if (/进入.*主1/.test(text)) return "主一阶段";
  if (/进入.*发动/.test(text)) return "发动阶段";
  if (/进入.*主2/.test(text)) return "主二阶段";
  if (/进入.*结束/.test(text)) return "结束阶段";
  if (/放置|放入|布阵/.test(text)) return "布阵";
  if (/弃置|弃牌/.test(text)) return "弃牌";
  if (/失败|无法|不能|没有找到/.test(text)) return "无法发动";
  if (/新手教程/.test(text)) return "新手引导";
  if (/战局展开|新战局/.test(text)) return "战局展开";
  return "行动结算";
}

function toastDetail(text) {
  if (/阵势爆发/.test(text)) return "五行联协";
  if (/周天阵眼/.test(text)) return "阵眼威力";
  if (/属性克制|克制/.test(text)) return "伤害翻倍";
  if (/发动.*攻击|攻击/.test(text)) return "破阵出手";
  if (/灵力相减/.test(text)) return "看卡槽数值";
  if (/直接承受|生命/.test(text)) return "看生命数值";
  if (/补充.*灵力|补灵|消耗.*灵石/.test(text)) return "看卡槽数值";
  if (/回复|治疗|回流/.test(text)) return "看生命数值";
  const normalized = String(text)
    .replace(/^玩家/, "你")
    .replace(/^对手/, "敌方")
    .replace(/，/g, " · ")
    .replace(/。/g, "");
  return normalized.length > 26 ? `${normalized.slice(0, 25)}…` : normalized;
}

function toastVariant(text) {
  if (/周天阵眼|阵势爆发|五行阵势|属性克制|发动.*攻击|直接承受|毁灭|破坏|防守|反击|获胜|胜利/.test(text)) return "major";
  if (/进入.*准备|进入.*主1|进入.*发动|进入.*主2|进入.*结束|战局展开|新战局/.test(text)) return "major";
  if (/灵力相减|获得.*灵石|随机抽|补充.*灵力|消耗.*灵石|回复 1 生命|放置|放入|弃置|无法|不能|没有找到|失败/.test(text)) return "minor";
  return "minor";
}

function toastTone(text, fallback) {
  if (/阵势爆发|周天阵眼|五行阵势|获胜|胜利/.test(text)) return "log-burst";
  if (/属性克制|克制|相克/.test(text)) return "log-overcome";
  if (/发动.*攻击|灵力相减|直接承受|攻击/.test(text)) return "log-attack";
  if (/毁灭|破坏|破阵/.test(text)) return "log-destroy";
  if (/防守|抵消|反击/.test(text)) return "log-defense";
  if (/回复|治疗|回流/.test(text)) return "log-heal";
  if (/进入.*阶段|战局展开|新战局/.test(text)) return "log-phase";
  return fallback;
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
  item.innerHTML = formatLogText(text);
  item.className = `log-item-enter ${classifyLog(text)}`;
  logNode.prepend(item);
  while (logNode.children.length > 18) logNode.lastChild.remove();
  showToast(text, toastTone(text, classifyLog(text)));
  setTimeout(playNextLog, 1650);
}

function waitForLogIdle() {
  if (!logState.busy && logState.queue.length === 0) return Promise.resolve();
  return new Promise((resolve) => logState.waiters.push(resolve));
}

function showToast(text, tone = "log-system", variant = toastVariant(text)) {
  const host = document.querySelector("#toastHost");
  if (!host) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${variant} ${tone}`;
  toast.innerHTML = `
    <strong class="toast-title">${formatLogText(toastTitle(text))}</strong>
    <span class="toast-detail">${formatLogText(toastDetail(text))}</span>
  `;
  host.querySelectorAll(".toast").forEach((node) => node.remove());
  host.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 360);
  }, 4600);
}

function floatLayer() {
  let layer = document.querySelector("#floatLayer");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "floatLayer";
    layer.className = "float-layer";
    document.body.append(layer);
  }
  return layer;
}

function floatTextAt(rect, text, className = "") {
  if (!rect) return;
  const node = document.createElement("div");
  node.className = `float-number ${className}`;
  node.textContent = text;
  node.style.left = `${rect.left + rect.width / 2}px`;
  node.style.top = `${rect.top + rect.height * 0.42}px`;
  floatLayer().append(node);
  setTimeout(() => node.remove(), 980);
}

function floatSlot(owner, slot, value) {
  const boardId = owner === "player" ? "playerBoard" : "enemyBoard";
  const node = document.querySelector(`#${boardId} [data-slot="${slot}"]`);
  if (!node || !value) return;
  const target = node.querySelector(".slot-card") || node;
  const label = value > 0 ? `灵力+${value}` : `灵力${value}`;
  floatTextAt(target.getBoundingClientRect(), label, value > 0 ? "float-plus" : "float-minus");
}

function floatSlotLabel(owner, slot, text, className = "") {
  const boardId = owner === "player" ? "playerBoard" : "enemyBoard";
  const node = document.querySelector(`#${boardId} [data-slot="${slot}"]`);
  if (!node) return;
  floatTextAt(node.getBoundingClientRect(), text, className);
}

function floatHp(owner, value) {
  const hpNode = document.querySelector(owner === "player" ? "#playerHp" : "#enemyHp");
  const node = hpNode?.closest(".stat-chip") || hpNode;
  if (!node || !value) return;
  const label = value > 0 ? `生命+${value}` : `生命${value}`;
  floatTextAt(node.getBoundingClientRect(), label, value > 0 ? "float-heal" : "float-hp");
}

function cardDeployText(card) {
  if (card.type === "eye") return `阵眼：${card.text}`;
  return `布阵：${TYPE[card.type]} ${card.value}。${card.text}`;
}

function cardSpellText(card) {
  if (card.type === "eye") return "法诀：阵眼不能作为手牌法诀打出。";
  return `法诀：${SPELL_TEXT[card.element]?.short || "无"}`;
}

function cardTipText(card) {
  if (card.type === "eye") return "建议：阵眼放在中台作为体系核心，持续影响整局。";
  return `建议：${SPELL_TEXT[card.element]?.tip || "根据局势选择布阵或打出法诀。"}`;
}

function cardDetailHtml(slotState, hidden) {
  if (hidden) return '<section class="card-rule"><strong>里侧卡</strong><p>效果隐藏。对手只能看到属性和放置姿态。</p></section>';
  const card = slotState.card;
  const deploy = card.type === "eye"
    ? `放在中台持续生效。${card.text}`
    : `${TYPE[card.type]} ${card.value}。${card.text}`;
  const spell = card.type === "eye"
    ? "阵眼不能作为手牌法诀打出。"
    : `${SPELL_TEXT[card.element].name}：${SPELL_TEXT[card.element].full}`;
  const tip = cardTipText(card).replace(/^建议：/, "");
  return `
    <section class="card-rule">
      <strong>布阵效果</strong>
      <p>${escapeHtml(deploy)}</p>
    </section>
    <section class="card-rule">
      <strong>法诀效果</strong>
      <p>${escapeHtml(spell)}</p>
    </section>
    <section class="card-rule">
      <strong>使用建议</strong>
      <p>${escapeHtml(tip)}</p>
    </section>
  `;
}

function showCardDetail(slotState, owner, slot) {
  if (!slotState) return;
  const hidden = owner === "enemy" && slotState.faceDown;
  const title = hidden ? visibleName(slotState, true) : slotState.card.name;
  const art = hidden ? "" : cardArtUrl(slotState.card);
  const placeLabel = slot === "hand" ? "手卡" : `${LABEL[slot]}槽`;
  const meta = [
    placeLabel,
    hidden ? LABEL[slotState.card.element] : LABEL[slotState.card.element],
    hidden ? modeLabel(slotState) : TYPE[slotState.card.type],
    slotState.mode === "eye" ? "持续生效" : `灵力 ${slotState.hp + slotState.stones}`,
  ].join(" · ");
  const artwork = document.querySelector("#cardArtwork");
  document.querySelector("#cardTitle").textContent = title;
  artwork.hidden = !art;
  artwork.style.setProperty("--card-art", art ? `url("${art}")` : "none");
  document.querySelector("#cardMeta").textContent = meta;
  document.querySelector("#cardText").innerHTML = cardDetailHtml(slotState, hidden);
  document.querySelector("#cardDialog").showModal();
}

function render() {
  if (!gameStarted) return;
  renderBoard("playerBoard", state.player, "player");
  renderBoard("enemyBoard", state.enemy, "enemy");
  renderEnemyHand();
  renderHand();
  renderTutorialPanel();
  document.querySelector("#playerHp").textContent = Math.max(0, state.player.hp);
  document.querySelector("#enemyHp").textContent = Math.max(0, state.enemy.hp);
  document.querySelector("#playerStones").textContent = state.player.stones;
  document.querySelector("#enemyStones").textContent = state.enemy.stones;
  const discardInfo = document.querySelector("#playerDiscardInfo");
  if (discardInfo) discardInfo.textContent = `碎片 ${state.player.discard.length}`;
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
      : state.tutorial
        ? tutorialHintText()
        : "选择己方卡槽或手卡";
  const canUse = state.active === "player" && !state.winner;
  const inMain = ["main1", "main2"].includes(state.phase);
  const canStoneDraw = state.player.stones >= 2;
  const canStoneRecover = state.player.stones >= 2 && state.player.discard.length > 0;
  const canStoneImbue = state.selected && state.player.board[state.selected] && state.player.board[state.selected].mode !== "eye" && state.player.stones > 0;
  document.querySelector("#imbueBtn").disabled = !canUse || !inMain || state.hasImbued || (!canStoneImbue && !canStoneDraw && !canStoneRecover);
  document.querySelector("#imbueBtn").textContent = canStoneImbue ? "补灵" : canStoneRecover ? "炼宝" : "炼石";
  document.querySelector("#activateBtn").disabled = !canUse || state.phase !== "activation" || !source || state.hasActed || state.selectedHand != null;
  document.querySelector("#replaceBtn").disabled = !canUse || !inMain || state.selectedHand == null;
  document.querySelector("#spellBtn").disabled = !canUse || !inMain || state.selectedHand == null || state.hasSpellCast;
  document.querySelector("#endBtn").disabled = !canUse;
  document.querySelector("#endBtn").textContent = state.tutorial?.step === TUTORIAL_STEPS.length - 1
    ? "完成教程"
    : state.phase === "end" ? "结束回合" : "下一阶段";
  ["imbueBtn", "activateBtn", "replaceBtn", "spellBtn", "endBtn"].forEach((id) => {
    const button = document.querySelector(`#${id}`);
    button?.classList.toggle("tutorial-focus", tutorialFocusMatches({ buttonId: id }));
  });
  renderTutorialGuide();
}

function renderTutorialPanel() {
  const panel = document.querySelector("#tutorialPanel");
  if (!panel) return;
  panel.hidden = true;
  if (state.tutorial) {
    return;
  }
  hideTutorialGuide();
}

function ensureTutorialGuide() {
  let guide = document.querySelector("#tutorialGuide");
  if (guide) return guide;
  guide = document.createElement("div");
  guide.id = "tutorialGuide";
  guide.className = "tutorial-guide";
  guide.innerHTML = `
    <i class="tutorial-mask tutorial-mask-top"></i>
    <i class="tutorial-mask tutorial-mask-left"></i>
    <i class="tutorial-mask tutorial-mask-right"></i>
    <i class="tutorial-mask tutorial-mask-bottom"></i>
    <span class="tutorial-target-ring"></span>
    <span class="tutorial-arrow"></span>
    <div class="tutorial-bubble">
      <strong></strong>
      <span></span>
    </div>
  `;
  document.body.append(guide);
  return guide;
}

function hideTutorialGuide() {
  document.querySelector("#tutorialGuide")?.remove();
}

function tutorialTargetElement() {
  if (!state.tutorial) return null;
  const step = tutorialStep();
  const focus = step.focus || {};
  const handCards = () => [...document.querySelectorAll("#playerHand .hand-card[data-hand-card='true']")];
  if (state.tutorial.step === 1) {
    const selected = getSelectedHandCard();
    if (!selected || selected.card.name !== "朱雀焚阵") {
      return handCards().find((node) => node.dataset.cardName === "朱雀焚阵") || null;
    }
    if (state.selected !== "fire") {
      return document.querySelector('#playerBoard [data-slot="fire"]');
    }
    return document.querySelector("#replaceBtn");
  }
  if (focus.handName) {
    const selected = getSelectedHandCard();
    if (!selected || selected.card.name !== focus.handName) {
      return handCards().find((node) => node.dataset.cardName === focus.handName) || null;
    }
  }
  if (focus.handAny && state.selectedHand == null) {
    return document.querySelector("#playerHand .hand-card[data-hand-card='true']:not(:disabled)");
  }
  if (focus.detail && focus.owner && focus.slot) {
    const boardId = focus.owner === "enemy" ? "enemyBoard" : "playerBoard";
    return document.querySelector(`#${boardId} [data-slot="${focus.slot}"] .detail-button`);
  }
  if (focus.owner && focus.slot) {
    const boardId = focus.owner === "enemy" ? "enemyBoard" : "playerBoard";
    const selectedNeedButton = focus.owner === "player" && state.selected === focus.slot && focus.buttons?.length;
    if (!selectedNeedButton) return document.querySelector(`#${boardId} [data-slot="${focus.slot}"]`);
  }
  if (focus.buttons?.length) {
    return document.querySelector(`#${focus.buttons[0]}`);
  }
  return null;
}

function renderTutorialGuide() {
  if (!state.tutorial) {
    hideTutorialGuide();
    return;
  }
  const target = tutorialTargetElement();
  if (!target) {
    hideTutorialGuide();
    return;
  }
  const guide = ensureTutorialGuide();
  const step = tutorialStep();
  const rect = target.getBoundingClientRect();
  const pad = 8;
  const left = Math.max(6, rect.left - pad);
  const top = Math.max(6, rect.top - pad);
  const right = Math.min(window.innerWidth - 6, rect.right + pad);
  const bottom = Math.min(window.innerHeight - 6, rect.bottom + pad);
  const width = Math.max(24, right - left);
  const height = Math.max(24, bottom - top);
  const bubbleWidth = Math.min(300, window.innerWidth - 24);
  const bubbleHeight = estimateTutorialBubbleHeight(step);
  const bubble = pickTutorialBubblePlacement(
    { left, top, right, bottom, width, height },
    bubbleWidth,
    bubbleHeight,
  );
  const arrowLeft = Math.min(window.innerWidth - 34, Math.max(16, bubble.arrowLeft));
  const arrowTop = Math.min(window.innerHeight - 36, Math.max(8, bubble.arrowTop));

  guide.querySelector(".tutorial-mask-top").style.cssText = `left:0;top:0;width:100vw;height:${top}px;`;
  guide.querySelector(".tutorial-mask-left").style.cssText = `left:0;top:${top}px;width:${left}px;height:${height}px;`;
  guide.querySelector(".tutorial-mask-right").style.cssText = `left:${right}px;top:${top}px;width:${window.innerWidth - right}px;height:${height}px;`;
  guide.querySelector(".tutorial-mask-bottom").style.cssText = `left:0;top:${bottom}px;width:100vw;height:${window.innerHeight - bottom}px;`;
  guide.querySelector(".tutorial-target-ring").style.cssText = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;`;
  guide.querySelector(".tutorial-arrow").classList.toggle("up", bubble.arrow === "up");
  guide.querySelector(".tutorial-arrow").classList.toggle("down", bubble.arrow === "down");
  guide.querySelector(".tutorial-arrow").style.cssText = `left:${arrowLeft}px;top:${arrowTop}px;`;
  guide.querySelector(".tutorial-bubble").style.cssText = `left:${bubble.left}px;top:${bubble.top}px;width:${bubbleWidth}px;`;
  guide.querySelector(".tutorial-bubble strong").textContent = tutorialGoalText(step);
  guide.querySelector(".tutorial-bubble span").textContent = step.hint;
}

function estimateTutorialBubbleHeight(step) {
  const textLength = tutorialGoalText(step).length + step.hint.length;
  return Math.min(140, Math.max(84, 52 + Math.ceil(textLength / 18) * 18));
}

function rectOverlap(a, b) {
  if (!a || !b) return 0;
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return x * y;
}

function clampRect(left, top, width, height) {
  const margin = 12;
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(margin, window.innerHeight - height - margin);
  const x = Math.min(maxLeft, Math.max(margin, left));
  const y = Math.min(maxTop, Math.max(margin, top));
  return { left: x, top: y, right: x + width, bottom: y + height, width, height };
}

function protectedTutorialRects(targetRect) {
  const selectors = [
    ".button-grid button",
    ".utility-grid button",
    ".action-panel",
    "#playerHand .hand-card.selected",
    "#playerHand .hand-card.tutorial-focus",
    ".slot.tutorial-focus",
    ".detail-button.tutorial-focus",
  ];
  const rects = [targetRect];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        rects.push({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom });
      }
    });
  });
  return rects;
}

function pickTutorialBubblePlacement(target, bubbleWidth, bubbleHeight) {
  const gap = 18;
  const targetRect = { left: target.left, top: target.top, right: target.right, bottom: target.bottom };
  const centerX = target.left + target.width / 2;
  const centerY = target.top + target.height / 2;
  const candidates = [
    { side: "below", rect: clampRect(centerX - bubbleWidth / 2, target.bottom + gap, bubbleWidth, bubbleHeight), arrow: "up" },
    { side: "above", rect: clampRect(centerX - bubbleWidth / 2, target.top - bubbleHeight - gap, bubbleWidth, bubbleHeight), arrow: "down" },
    { side: "right", rect: clampRect(target.right + gap, centerY - bubbleHeight / 2, bubbleWidth, bubbleHeight), arrow: "up" },
    { side: "left", rect: clampRect(target.left - bubbleWidth - gap, centerY - bubbleHeight / 2, bubbleWidth, bubbleHeight), arrow: "up" },
  ];
  const protectedRects = protectedTutorialRects(targetRect);
  const scored = candidates.map((candidate) => {
    const overlap = protectedRects.reduce((sum, rect) => sum + rectOverlap(candidate.rect, rect), 0);
    const edgePenalty = candidate.rect.top > window.innerHeight * 0.62 ? 24000 : 0;
    const preferred = target.top < window.innerHeight * 0.38 && candidate.side === "below" ? -500 : 0;
    return { ...candidate, score: overlap + edgePenalty + preferred };
  }).sort((a, b) => a.score - b.score);
  const best = scored[0];
  const arrowLeft = Math.min(best.rect.right - 32, Math.max(best.rect.left + 18, centerX - 12));
  const arrowTop = best.arrow === "up"
    ? Math.min(best.rect.top - 14, target.bottom + 6)
    : Math.max(best.rect.bottom + 4, target.top - 28);
  return { left: best.rect.left, top: best.rect.top, arrow: best.arrow, arrowLeft, arrowTop };
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
      tutorialFocusMatches({ owner, slot }) ? "tutorial-focus" : "",
    ].join(" ");
    node.style.setProperty("--slot-color", COLOR[slot]);
    node.dataset.slot = slot;
    node.disabled = false;
    node.innerHTML = `
      ${renderSlotCard(slotState, owner)}
      <span class="slot-element-dot">${LABEL[slot]}</span>
    `;
    node.addEventListener("click", async () => {
      if (slotState && isDoubleCardTap(`slot:${owner}:${slot}`)) {
        showCardDetail(slotState, owner, slot);
        return;
      }
      if (owner === "enemy" && await activateEnemySlotTarget(slot)) return;
      if (owner === "player" && state.active === "player" && !state.winner) {
        state.selected = slot;
        if (state.selectedHand == null || !["main1", "main2"].includes(state.phase)) {
          state.selectedHand = null;
        }
      }
      render();
    });
    node.addEventListener("dblclick", (event) => {
      event.preventDefault();
      if (slotState) showCardDetail(slotState, owner, slot);
    });
    const detailButton = node.querySelector(".detail-button");
    if (detailButton) {
      if (tutorialFocusMatches({ owner, slot, detail: true })) detailButton.classList.add("tutorial-focus");
      detailButton.addEventListener("click", (event) => {
        event.stopPropagation();
        showCardDetail(slotState, owner, slot);
        if (state.tutorial && owner === "player" && slot === "fire") completeTutorialStep(0, 1);
      });
    }
    root.append(node);
  }
}

function renderSlotCard(slotState, owner) {
  if (!slotState) return `<span class="slot-empty" aria-hidden="true"></span>`;
  const hidden = Boolean(slotState.faceDown);
  const valueText = slotState.mode === "eye" ? "阵眼" : `灵力:${slotState.hp + slotState.stones}`;
  const art = !hidden ? cardArtUrl(slotState.card) : "";
  const cardName = hidden ? `里侧${slotState.mode === "attack" ? "攻击" : slotState.mode === "ongoing" ? "永续" : "防守"}` : slotState.card.name;
  const deployText = hidden ? "未知效果" : cardDeployText(slotState.card);
  const spellText = hidden ? "点击查看需翻开" : cardSpellText(slotState.card);
  const artClass = art ? "has-art" : "";
  const hiddenClass = hidden ? "slot-card-hidden" : "";
  const cardStyle = `--slot-color:${COLOR[slotState.card.element]};${art ? `--card-art:url('${art}')` : ""}`;
  if (hidden) {
    return `
      <div class="hand-card slot-card ${hiddenClass}" style="${cardStyle}" aria-label="${cardName}"></div>
    `;
  }
  return `
    <div class="hand-card slot-card ${artClass}" style="${cardStyle}">
      <span class="hand-element">${LABEL[slotState.card.element]}</span>
      <span class="hand-type">${slotTypeMark(slotState)}</span>
      <strong>${cardName}</strong>
      ${art ? '<span class="hand-art"></span>' : ""}
      <span class="hand-value">${valueText}</span>
      <span class="hand-text"><b>${deployText}</b><i>${spellText}</i></span>
      <span class="detail-button" role="button" aria-label="查看${cardName}">查看卡片</span>
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

function isDoubleCardTap(key) {
  const now = performance.now();
  const doubled = lastCardTap.key === key && now - lastCardTap.time < 380;
  lastCardTap = { key, time: now };
  return doubled;
}

function renderHand() {
  const root = document.querySelector("#playerHand");
  root.innerHTML = "";
  if (state.player.hand.length === 0) {
    root.innerHTML = `<div class="card empty">无手卡</div>`;
    return;
  }
  state.player.hand.forEach((card, index) => {
    const art = cardArtUrl(card);
    const node = document.createElement("button");
    node.type = "button";
    node.className = [
      "hand-card",
      state.selectedHand === index ? "selected" : "",
      tutorialFocusMatches({ handName: card.name }) || tutorialFocusMatches({ handAny: true }) ? "tutorial-focus" : "",
    ].join(" ");
    node.style.setProperty("--slot-color", COLOR[card.element]);
    if (art) node.style.setProperty("--card-art", `url("${art}")`);
    node.dataset.cardName = card.name;
    node.dataset.handCard = "true";
    node.innerHTML = `
      <span class="hand-element">${LABEL[card.element]}</span>
      <span class="hand-type">${TYPE_MARK[card.type] || "术"}</span>
      <strong>${card.name}</strong>
      ${art ? '<span class="hand-art"></span>' : ""}
      <span class="hand-value">${card.type === "eye" ? "阵眼" : `灵力:${card.value}`}</span>
      <span class="hand-text">
        <b>${cardDeployText(card)}</b>
        <i>${cardSpellText(card)}</i>
      </span>
    `;
    node.disabled = state.active !== "player" || Boolean(state.winner);
    node.querySelector(".hand-text")?.addEventListener("click", (event) => {
      event.stopPropagation();
      showCardDetail({ card, hp: card.value, stones: 0, mode: card.type }, "player", "hand");
    });
    node.addEventListener("click", () => {
      if (isDoubleCardTap(`hand:${card.uid || card.name}:${index}`)) {
        showCardDetail({ card, hp: card.value, stones: 0, mode: card.type }, "player", "hand");
        return;
      }
      state.selectedHand = index;
      state.selected = null;
      render();
    });
    node.addEventListener("dblclick", (event) => {
      event.preventDefault();
      showCardDetail({ card, hp: card.value, stones: 0, mode: card.type }, "player", "hand");
    });
    let pressTimer = null;
    node.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        showCardDetail({ card, hp: card.value, stones: 0, mode: card.type }, "player", "hand");
      }, 520);
    }, { passive: true });
    node.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
      pressTimer = null;
    });
    node.addEventListener("touchmove", () => {
      clearTimeout(pressTimer);
      pressTimer = null;
    }, { passive: true });
    root.append(node);
  });
}

function renderEnemyHand() {
  const root = document.querySelector("#enemyHand");
  if (!root) return;
  root.innerHTML = "";
  state.enemy.hand.forEach((_, index) => {
    const card = document.createElement("span");
    card.className = "enemy-hand-card";
    card.setAttribute("aria-label", `对方手卡 ${index + 1}`);
    root.append(card);
  });
}

function renderStones(count) {
  return Array.from({ length: count }, () => `<i class="stone-dot"></i>`).join("");
}

document.querySelector("#imbueBtn").addEventListener("click", () => imbue(state.selected));
document.querySelector("#activateBtn").addEventListener("click", () => activate(state.selected));
document.querySelector("#replaceBtn").addEventListener("click", () => placeSelectedHand());
document.querySelector("#spellBtn").addEventListener("click", () => castSelectedSpell());
document.querySelector("#endBtn").addEventListener("click", () => nextPhase());
document.querySelector("#tutorialHelpBtn")?.addEventListener("click", () => showTutorialStep(state.tutorial?.step || 0, true));
window.addEventListener("resize", () => renderTutorialGuide());
window.addEventListener("scroll", () => renderTutorialGuide(), true);

function collectionCount(profile = playerDataState.profile) {
  if (!profile?.collection) return 0;
  return Object.values(profile.collection).reduce((sum, count) => sum + Number(count || 0), 0);
}

function renderPlayerDataState() {
  const actions = document.querySelectorAll(".account-action");
  actions.forEach((button) => {
    button.hidden = !authState.user;
  });
  const deckSummary = document.querySelector("#deckSummary");
  const shopSummary = document.querySelector("#shopSummary");
  const profile = playerDataState.profile;
  if (deckSummary) {
    deckSummary.textContent = profile
      ? `收藏 ${collectionCount(profile)} 张 · 卡组 ${countMapTotal(profile.deck || {})} 张 · 灵石 ${profile.stones || 0}`
      : "登录后可整理卡组。";
  }
  if (shopSummary) {
    shopSummary.textContent = profile
      ? `当前灵石 ${profile.stones || 0} · 已开包 ${profile.packsOpened || 0}`
      : "登录后可使用灵石抽卡。";
  }
  const buyButton = document.querySelector("#buyBoosterBtn");
  if (buyButton) buyButton.disabled = !profile || Number(profile.stones || 0) < 100;
}

async function requestPlayerData(action = "playerStatus", payload = {}) {
  const response = await fetch(`${PLAYER_DATA_ENDPOINT}?action=${encodeURIComponent(action)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      initialCards: initialCollectionCards(),
      defaultDeck: initialDeckMap(),
      ...payload,
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "资产请求失败");
  playerDataState.profile = data.profile || null;
  renderPlayerDataState();
  return data;
}

async function loadPlayerProfile() {
  if (!authState.user) {
    playerDataState.profile = null;
    renderPlayerDataState();
    return null;
  }
  playerDataState.loading = true;
  try {
    return await requestPlayerData("playerStatus");
  } finally {
    playerDataState.loading = false;
  }
}

function renderCollection(container, collection) {
  if (!container) return;
  container.innerHTML = "";
  const entries = Object.entries(collection || {}).sort(([a], [b]) => a.localeCompare(b, "zh-CN"));
  if (!entries.length) {
    container.innerHTML = `<p class="trigger-text">还没有卡牌。</p>`;
    return;
  }
  entries.forEach(([key, count]) => {
    const card = cardByKey(key) || { name: key.split(":").slice(1).join(":") || key, element: key.split(":")[0] || "core", type: "", value: 0, text: "" };
    container.append(createDeckCardNode(card, {
      count,
      note: `${TYPE[card.type] || "卡"}${card.value ? ` · 灵力 ${card.value}` : ""}`,
      actions: [],
    }));
  });
}

function currentDeckDraft() {
  if (!playerDataState.deckDraft || Object.keys(playerDataState.deckDraft).length === 0) {
    playerDataState.deckDraft = { ...(playerDataState.profile?.deck || initialDeckMap()) };
  }
  return playerDataState.deckDraft;
}

function cardMatchesDeckFilters(card) {
  const { element, type } = playerDataState.deckFilters;
  const elementOk = element === "all" || card.element === element || (element === "core" && card.type === "eye");
  const typeOk = type === "all"
    || card.type === type
    || (type === "defense" && ["defense", "counter"].includes(card.type));
  return elementOk && typeOk;
}

function deckRuleText(deck) {
  const issues = deckIssues(deck);
  const total = countMapTotal(deck);
  if (!issues.length) return `卡组 ${total}/${DECK_RULES.max}，规则合法。`;
  return `卡组 ${total}/${DECK_RULES.max}，${issues.join("；")}。`;
}

function renderDeckBuilder() {
  const profile = playerDataState.profile;
  const collection = profile?.collection || {};
  const deck = currentDeckDraft();
  const deckStatus = document.querySelector("#deckStatus");
  const deckSummary = document.querySelector("#deckSummary");
  const collectionSummary = document.querySelector("#collectionSummary");
  const deckCountSummary = document.querySelector("#deckCountSummary");
  const sourceTitle = document.querySelector("#deckSourceTitle");
  const saveButton = document.querySelector("#saveDeck");
  const total = countMapTotal(deck);
  const valid = isDeckValid(deck);
  if (deckSummary) deckSummary.textContent = `收藏 ${collectionCount(profile)} 张 · 当前卡组 ${total} 张`;
  if (deckStatus) {
    deckStatus.textContent = deckRuleText(deck);
    deckStatus.classList.toggle("valid", valid);
    deckStatus.classList.toggle("invalid", !valid);
  }
  if (collectionSummary) {
    collectionSummary.textContent = playerDataState.deckSource === "pack"
      ? `${allCollectibleCards().length} 种`
      : `${collectionCount(profile)} 张`;
  }
  if (deckCountSummary) deckCountSummary.textContent = `${total} 张`;
  if (sourceTitle) sourceTitle.textContent = playerDataState.deckSource === "pack" ? "补充包池" : "我的收藏";
  document.querySelectorAll("[data-deck-source]").forEach((button) => {
    button.classList.toggle("active", button.dataset.deckSource === playerDataState.deckSource);
  });
  if (saveButton) saveButton.disabled = !valid;
  renderDeckCollection();
  renderDeckCards();
}

function renderDeckCollection() {
  const root = document.querySelector("#deckCollection");
  if (!root) return;
  root.innerHTML = "";
  const collection = playerDataState.profile?.collection || {};
  const deck = currentDeckDraft();
  const sourceEntries = playerDataState.deckSource === "pack"
    ? allCollectibleCards().map((card) => [collectibleKey(card), Number(collection[collectibleKey(card)] || 0)])
    : Object.entries(collection);
  const cards = sourceEntries
    .map(([key, count]) => ({ key, count: Number(count || 0), card: cardByKey(key) }))
    .filter((entry) => entry.card && cardMatchesDeckFilters(entry.card))
    .sort((a, b) => a.key.localeCompare(b.key, "zh-CN"));
  if (!cards.length) {
    root.innerHTML = `<p class="trigger-text">没有符合筛选的卡。</p>`;
    return;
  }
  cards.forEach(({ key, count, card }) => {
    const inDeck = Number(deck[key] || 0);
    const canAdd = inDeck < count && inDeck < DECK_RULES.maxCopies && countMapTotal(deck) < DECK_RULES.max;
    const canBulkAdd = availableAddCount(key) > 0;
    root.append(createDeckCardNode(card, {
      count,
      note: `卡组 ${inDeck}/${Math.min(count, DECK_RULES.maxCopies)}`,
      muted: playerDataState.deckSource === "pack" && count <= 0,
      actions: [
        {
          label: "+1",
          title: "加入 1 张",
          disabled: !canAdd,
          onClick: () => addCardToDeck(key),
        },
        {
          label: "加满",
          title: "加入可用数量",
          disabled: !canBulkAdd,
          onClick: () => addMaxCardToDeck(key),
        },
      ],
    }));
  });
}

function renderDeckCards() {
  const root = document.querySelector("#deckCards");
  if (!root) return;
  root.innerHTML = "";
  const deck = currentDeckDraft();
  const cards = Object.entries(deck)
    .map(([key, count]) => ({ key, count: Number(count || 0), card: cardByKey(key) }))
    .filter((entry) => entry.card && entry.count > 0)
    .sort((a, b) => a.key.localeCompare(b.key, "zh-CN"));
  if (!cards.length) {
    root.innerHTML = `<p class="trigger-text">还没有加入卡牌。</p>`;
    return;
  }
  cards.forEach(({ key, count, card }) => {
    root.append(createDeckCardNode(card, {
      count,
      note: `${LABEL[card.element] || "中"} · ${TYPE[card.type] || "卡"}`,
      actions: [
        {
          label: "-1",
          title: "移除 1 张",
          onClick: () => removeCardFromDeck(key),
        },
        {
          label: "全删",
          title: "从卡组全部移除",
          onClick: () => removeAllCardFromDeck(key),
        },
      ],
    }));
  });
}

function createDeckCardNode(card, options) {
  const art = cardArtUrl(card);
  const item = document.createElement("article");
  item.className = [
    "collection-card",
    "deck-mini-card",
    options.muted ? "is-muted" : "",
  ].filter(Boolean).join(" ");
  item.style.setProperty("--slot-color", COLOR[card.element] || "#e5c574");
  if (art) item.style.setProperty("--card-art", `url("${art}")`);
  const valueText = card.type === "eye" ? "阵眼" : `灵力:${card.value || 0}`;
  item.innerHTML = `
    <button class="deck-card-preview" type="button" aria-label="查看${escapeHtml(card.name)}">
      <span class="hand-element">${LABEL[card.element] || "中"}</span>
      <span class="hand-type">${TYPE_MARK[card.type] || "术"}</span>
      <strong>${escapeHtml(card.name)}</strong>
      ${art ? '<span class="hand-art"></span>' : ""}
      <span class="hand-value">${escapeHtml(valueText)}</span>
      <span class="hand-text">
        <b>${escapeHtml(cardDeployText(card))}</b>
      </span>
      <span class="deck-card-count">x${Number(options.count || 0)}</span>
    </button>
    <small class="card-count-note">${escapeHtml(options.note || "")}</small>
  `;
  item.querySelector(".deck-card-preview")?.addEventListener("click", () => showCatalogCardDetail(card, options.note || ""));
  const actions = document.createElement("div");
  actions.className = "deck-card-actions";
  (options.actions || []).forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    if (action.title) button.setAttribute("aria-label", action.title);
    button.disabled = Boolean(action.disabled);
    button.addEventListener("click", action.onClick);
    actions.append(button);
  });
  item.append(actions);
  return item;
}

function showCatalogCardDetail(card, note = "") {
  const art = cardArtUrl(card);
  const artwork = document.querySelector("#cardArtwork");
  const meta = [
    "卡牌图鉴",
    LABEL[card.element] || "中",
    TYPE[card.type] || "卡",
    card.type === "eye" ? "阵眼" : `灵力 ${card.value || 0}`,
    note,
  ].filter(Boolean).join(" · ");
  document.querySelector("#cardTitle").textContent = card.name;
  artwork.hidden = !art;
  artwork.style.setProperty("--card-art", art ? `url("${art}")` : "none");
  document.querySelector("#cardMeta").textContent = meta;
  document.querySelector("#cardText").innerHTML = cardDetailHtml({
    card,
    hp: card.value || 0,
    stones: 0,
    mode: card.type,
  }, false);
  document.querySelector("#cardDialog").showModal();
}

function availableAddCount(key) {
  const collectionCountForCard = Number(playerDataState.profile?.collection?.[key] || 0);
  const deck = currentDeckDraft();
  const current = Number(deck[key] || 0);
  return Math.max(0, Math.min(
    collectionCountForCard - current,
    DECK_RULES.maxCopies - current,
    DECK_RULES.max - countMapTotal(deck),
  ));
}

function addCardToDeck(key) {
  const add = availableAddCount(key);
  if (add <= 0) return;
  const deck = currentDeckDraft();
  const current = Number(deck[key] || 0);
  deck[key] = current + 1;
  renderDeckBuilder();
}

function addMaxCardToDeck(key) {
  const add = availableAddCount(key);
  if (add <= 0) return;
  const deck = currentDeckDraft();
  deck[key] = Number(deck[key] || 0) + add;
  renderDeckBuilder();
}

function removeCardFromDeck(key) {
  const deck = currentDeckDraft();
  const current = Number(deck[key] || 0);
  if (current <= 1) delete deck[key];
  else deck[key] = current - 1;
  renderDeckBuilder();
}

function removeAllCardFromDeck(key) {
  const deck = currentDeckDraft();
  delete deck[key];
  renderDeckBuilder();
}

function resetDeckDraft() {
  const collection = playerDataState.profile?.collection || {};
  const nextDeck = {};
  Object.entries(initialDeckMap()).forEach(([key, count]) => {
    const owned = Number(collection[key] || 0);
    if (owned > 0) nextDeck[key] = Math.min(Number(count || 0), owned, DECK_RULES.maxCopies);
  });
  if (countMapTotal(nextDeck) < DECK_RULES.min) {
    Object.entries(collection).forEach(([key, count]) => {
      if (countMapTotal(nextDeck) >= DECK_RULES.min) return;
      const current = Number(nextDeck[key] || 0);
      const add = Math.min(Number(count || 0) - current, DECK_RULES.maxCopies - current, DECK_RULES.min - countMapTotal(nextDeck));
      if (add > 0) nextDeck[key] = current + add;
    });
  }
  playerDataState.deckDraft = nextDeck;
  renderDeckBuilder();
}

async function saveDeckDraft() {
  const deck = currentDeckDraft();
  if (!isDeckValid(deck)) {
    showToast(deckRuleText(deck), "log-destroy", "minor");
    return;
  }
  const button = document.querySelector("#saveDeck");
  if (button) button.disabled = true;
  try {
    await requestPlayerData("saveDeck", { deck });
    playerDataState.deckDraft = { ...(playerDataState.profile?.deck || deck) };
    renderDeckBuilder();
    showToast("卡组已保存。", "log-burst");
  } catch (error) {
    showToast(error.message || "卡组保存失败。", "log-destroy", "minor");
  } finally {
    renderDeckBuilder();
  }
}

function renderBoosterResult(cards) {
  const result = document.querySelector("#boosterResult");
  if (!result) return;
  result.hidden = false;
  const grouped = {};
  cards.forEach((card) => {
    grouped[collectibleKey(card)] = (grouped[collectibleKey(card)] || 0) + 1;
  });
  renderCollection(result, grouped);
}

function openDeckDialog() {
  if (!authState.user) {
    openAuthDialog();
    return;
  }
  const dialog = document.querySelector("#deckDialog");
  playerDataState.deckDraft = { ...(playerDataState.profile?.deck || initialDeckMap()) };
  renderPlayerDataState();
  renderDeckBuilder();
  dialog?.showModal();
  loadPlayerProfile().then(() => {
    playerDataState.deckDraft = { ...(playerDataState.profile?.deck || initialDeckMap()) };
    renderDeckBuilder();
  }).catch(() => {
    showToast("卡组资产读取失败。", "log-destroy", "minor");
  });
}

function openShopDialog() {
  if (!authState.user) {
    openAuthDialog();
    return;
  }
  const result = document.querySelector("#boosterResult");
  if (result) result.hidden = true;
  renderPlayerDataState();
  document.querySelector("#shopDialog")?.showModal();
  loadPlayerProfile().catch(() => showToast("商店资产读取失败。", "log-destroy", "minor"));
}

async function buyBoosterPack() {
  const button = document.querySelector("#buyBoosterBtn");
  if (!authState.user) {
    openAuthDialog();
    return;
  }
  const cards = drawBoosterCards(5);
  if (button) button.disabled = true;
  try {
    const data = await requestPlayerData("buyBooster", { cards });
    renderBoosterResult(data.cards || cards);
    showToast("补充卡包已打开，获得 5 张卡。", "log-burst");
  } catch (error) {
    showToast(error.message || "开包失败。", "log-destroy", "minor");
  } finally {
    renderPlayerDataState();
  }
}

async function awardVictoryStones() {
  if (!authState.user) return;
  try {
    const data = await requestPlayerData("awardVictory");
    showToast(`胜利奖励 +${data.reward || 100} 灵石。`, "log-burst");
  } catch {
    showToast("胜利奖励暂未保存，请稍后再试。", "log-destroy", "minor");
  }
}

function authLabel() {
  if (!authState.user) return "游客模式";
  const profile = playerDataState.profile;
  const stones = profile ? ` · 灵石 ${profile.stones || 0}` : "";
  return `${authState.user.nickname} · ${authState.user.phoneTail}${stones}`;
}

function renderAuthState() {
  const startStatus = document.querySelector("#startAccountStatus");
  const startAuthButton = document.querySelector("#startAuthBtn");
  const authButton = document.querySelector("#authBtn");
  const current = document.querySelector("#authCurrent");
  const logoutButton = document.querySelector("#logoutAuth");
  if (startStatus) startStatus.textContent = authLabel();
  const startAuthLabel = startAuthButton?.querySelector("span:last-child");
  if (startAuthLabel) startAuthLabel.textContent = authState.user ? "账号" : "登录";
  else if (startAuthButton) startAuthButton.textContent = authState.user ? "账号" : "登录";
  if (authButton) authButton.textContent = authState.user ? "账号" : "登录";
  if (authButton) authButton.setAttribute("aria-pressed", String(Boolean(authState.user)));
  if (current) current.textContent = authState.user
    ? `当前账号：${authState.user.nickname}（尾号 ${authState.user.phoneTail}）`
    : "当前为游客模式。";
  if (logoutButton) logoutButton.hidden = !authState.user;
  renderPlayerDataState();
}

function setAuthMode(mode) {
  authState.mode = mode;
  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === mode);
  });
  const nicknameLine = document.querySelector("#authNicknameLine");
  const inviteLine = document.querySelector("#authInviteLine");
  const submitButton = document.querySelector("#submitAuth");
  const password = document.querySelector("#authPassword");
  if (nicknameLine) nicknameLine.hidden = mode !== "register";
  if (inviteLine) inviteLine.hidden = mode !== "register";
  if (submitButton) submitButton.textContent = mode === "register" ? "注册" : "登录";
  if (password) password.autocomplete = mode === "register" ? "new-password" : "current-password";
}

async function requestAuth(action, payload = {}) {
  const response = await fetch(`${AUTH_ENDPOINT}?action=${encodeURIComponent(action)}`, {
    method: action === "status" ? "GET" : "POST",
    headers: action === "status" ? undefined : { "Content-Type": "application/json" },
    body: action === "status" ? undefined : JSON.stringify(payload),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "账号请求失败");
  authState.user = data.user || null;
  renderAuthState();
  if (authState.user) loadPlayerProfile().catch(() => renderPlayerDataState());
  else {
    playerDataState.profile = null;
    renderPlayerDataState();
  }
  return data;
}

function openAuthDialog(mode = authState.user ? "login" : "login") {
  setAuthMode(mode);
  renderAuthState();
  document.querySelector("#authDialog")?.showModal();
}

function initAuth() {
  const dialog = document.querySelector("#authDialog");
  const form = document.querySelector("#authForm");
  const closeButton = document.querySelector("#closeAuth");
  const logoutButton = document.querySelector("#logoutAuth");
  const startAuthButton = document.querySelector("#startAuthBtn");
  const authButton = document.querySelector("#authBtn");
  if (!dialog || !form) return;

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode || "login"));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const phone = document.querySelector("#authPhone")?.value.trim() || "";
    const password = document.querySelector("#authPassword")?.value || "";
    const nickname = document.querySelector("#authNickname")?.value.trim() || "";
    const inviteCode = document.querySelector("#authInviteCode")?.value.trim() || "";
    const submitButton = document.querySelector("#submitAuth");
    if (submitButton) submitButton.disabled = true;
    try {
      await requestAuth(authState.mode, { phone, password, nickname, inviteCode });
      dialog.close();
      showToast(authState.mode === "register" ? "注册成功，已登录。" : "登录成功。", "log-burst");
    } catch (error) {
      showToast(error.message || "账号操作失败。", "log-destroy", "minor");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  logoutButton?.addEventListener("click", async () => {
    try {
      await requestAuth("logout");
      dialog.close();
      showToast("已退出登录。", "log-phase", "minor");
    } catch {
      showToast("退出失败，请稍后再试。", "log-destroy", "minor");
    }
  });

  closeButton?.addEventListener("click", () => dialog.close());
  startAuthButton?.addEventListener("click", () => openAuthDialog());
  authButton?.addEventListener("click", () => openAuthDialog());
  setAuthMode("login");
  renderAuthState();
  requestAuth("status").catch(() => renderAuthState());
}

function initStartScreen() {
  const startScreen = document.querySelector("#startScreen");
  const gameShell = document.querySelector("#gameShell");
  const startButton = document.querySelector("#startGameBtn");
  const deckButton = document.querySelector("#deckBuilderBtn");
  const shopButton = document.querySelector("#shopBtn");
  const tutorialButton = document.querySelector("#tutorialBtn");
  const startRulesButton = document.querySelector("#startRulesBtn");
  const startAiButton = document.querySelector("#startAiBtn");
  const settingsButton = document.querySelector("#settingsBtn");
  const settingsDialog = document.querySelector("#settingsDialog");
  const homeButton = document.querySelector("#homeBtn");
  const rulesButton = document.querySelector("#rulesBtn");
  const restartButton = document.querySelector("#restartBtn");
  const rulesDialog = document.querySelector("#rulesDialog");
  const aiDialog = document.querySelector("#aiDialog");

  const beginGame = (mode = "normal") => {
    gameStarted = true;
    if (startScreen) startScreen.hidden = true;
    if (gameShell) gameShell.hidden = false;
    document.body.classList.remove("start-mode");
    document.body.classList.add("game-mode");
    if (mode === "tutorial") setupTutorial();
    else setup();
  };

  startButton?.addEventListener("click", () => beginGame("normal"));
  deckButton?.addEventListener("click", openDeckDialog);
  shopButton?.addEventListener("click", openShopDialog);
  tutorialButton?.addEventListener("click", () => beginGame("tutorial"));
  startRulesButton?.addEventListener("click", () => rulesDialog?.showModal());
  rulesButton?.addEventListener("click", () => rulesDialog?.showModal());
  settingsButton?.addEventListener("click", () => settingsDialog?.showModal());
  homeButton?.addEventListener("click", () => {
    settingsDialog?.close();
    gameStarted = false;
    resetState();
    if (gameShell) gameShell.hidden = true;
    if (startScreen) startScreen.hidden = false;
    document.body.classList.remove("game-mode");
    document.body.classList.add("start-mode");
    hideTutorialGuide();
    renderAuthState();
  });
  startAiButton?.addEventListener("click", () => {
    if (window.openAiSettings) window.openAiSettings();
    else aiDialog?.showModal();
  });
  restartButton?.addEventListener("click", () => {
    if (!gameStarted) return;
    settingsDialog?.close();
    setup();
    showToast("新战局已展开。");
  });
}

function formatMessageTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderVictoryMessages(messages) {
  const list = document.querySelector("#victoryMessages");
  if (!list) return;
  list.innerHTML = "";
  if (!messages.length) {
    const item = document.createElement("li");
    item.innerHTML = "<p>还没有留言。第一块胜者碑正等着你。</p>";
    list.append(item);
    return;
  }
  messages.forEach((entry) => {
    const item = document.createElement("li");
    const name = escapeHtml(entry.name || "无名阵师");
    const message = escapeHtml(entry.message || "");
    const time = escapeHtml(formatMessageTime(entry.createdAt));
    item.innerHTML = `
      <strong>${name}</strong>
      <p>${message}</p>
      ${time ? `<time>${time}</time>` : ""}
    `;
    list.append(item);
  });
}

async function loadVictoryMessages() {
  const response = await fetch(VICTORY_MESSAGES_ENDPOINT, { cache: "no-store" });
  if (!response.ok) throw new Error("load failed");
  const payload = await response.json();
  renderVictoryMessages(Array.isArray(payload.messages) ? payload.messages : []);
}

async function saveVictoryMessage(name, message) {
  const response = await fetch(VICTORY_MESSAGES_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, message }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "save failed");
  renderVictoryMessages(Array.isArray(payload.messages) ? payload.messages : []);
}

function restartFromResult() {
  hideResultScreen();
  state.resultShown = false;
  gameStarted = true;
  const startScreen = document.querySelector("#startScreen");
  const gameShell = document.querySelector("#gameShell");
  if (startScreen) startScreen.hidden = true;
  if (gameShell) gameShell.hidden = false;
  document.body.classList.remove("start-mode");
  document.body.classList.add("game-mode");
  setup();
}

function initResultScreen() {
  const form = document.querySelector("#victoryMessageForm");
  const saveButton = document.querySelector("#saveVictoryMessage");
  const messagesPanel = document.querySelector("#victoryMessagesPanel");
  const refreshButton = document.querySelector("#refreshVictoryMessages");
  const victoryRestart = document.querySelector("#victoryRestart");
  const defeatRestart = document.querySelector("#defeatRestart");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameInput = document.querySelector("#victoryName");
    const messageInput = document.querySelector("#victoryMessage");
    const name = (nameInput?.value || "").trim() || "无名阵师";
    const message = (messageInput?.value || "").trim();
    if (!message) {
      showToast("先留一句获胜留言。", "log-phase", "minor");
      messageInput?.focus();
      return;
    }
    localStorage.setItem("arrayDuelVictoryName", name);
    if (saveButton) saveButton.disabled = true;
    try {
      await saveVictoryMessage(name, message);
      form.hidden = true;
      if (messagesPanel) messagesPanel.hidden = false;
      showToast("获胜留言已保存。", "log-burst");
    } catch {
      showToast("留言保存失败，请稍后再试。", "log-destroy", "minor");
    } finally {
      if (saveButton) saveButton.disabled = false;
    }
  });

  refreshButton?.addEventListener("click", async () => {
    try {
      await loadVictoryMessages();
      showToast("玩家留言已刷新。", "log-phase", "minor");
    } catch {
      showToast("留言列表读取失败。", "log-destroy", "minor");
    }
  });

  victoryRestart?.addEventListener("click", restartFromResult);
  defeatRestart?.addEventListener("click", restartFromResult);
}

function initPlayerDataUi() {
  document.querySelectorAll("[data-deck-source]").forEach((button) => {
    button.addEventListener("click", () => {
      playerDataState.deckSource = button.dataset.deckSource || "owned";
      renderDeckBuilder();
    });
  });
  document.querySelectorAll("[data-deck-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.deckFilter;
      const value = button.dataset.value || "all";
      playerDataState.deckFilters[filter] = value;
      document.querySelectorAll(`[data-deck-filter="${filter}"]`).forEach((node) => {
        node.classList.toggle("active", node === button);
      });
      renderDeckBuilder();
    });
  });
  document.querySelector("#saveDeck")?.addEventListener("click", saveDeckDraft);
  document.querySelector("#resetDeck")?.addEventListener("click", resetDeckDraft);
  document.querySelector("#refreshDeck")?.addEventListener("click", async () => {
    try {
      await loadPlayerProfile();
      playerDataState.deckDraft = { ...(playerDataState.profile?.deck || initialDeckMap()) };
      renderDeckBuilder();
      showToast("卡组资产已刷新。", "log-phase", "minor");
    } catch {
      showToast("刷新失败。", "log-destroy", "minor");
    }
  });
  document.querySelector("#refreshShop")?.addEventListener("click", async () => {
    try {
      await loadPlayerProfile();
      showToast("商店资产已刷新。", "log-phase", "minor");
    } catch {
      showToast("刷新失败。", "log-destroy", "minor");
    }
  });
  document.querySelector("#buyBoosterBtn")?.addEventListener("click", buyBoosterPack);
  renderPlayerDataState();
}

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
  };

  const openSettings = () => {
    const config = getAiConfig();
    fields.enabled.checked = Boolean(config.enabled);
    fields.baseUrl.value = config.baseUrl || "";
    fields.model.value = config.model || "";
    fields.modelPreset.value = [...fields.modelPreset.options].some((option) => option.value === config.model) ? config.model : "";
    dialog.showModal();
  };

  window.openAiSettings = openSettings;

  const updateButton = () => {
    const config = getAiConfig();
    openButton.textContent = config.enabled ? "AI On" : "AI设置";
    openButton.setAttribute("aria-pressed", String(config.enabled));
  };

  openButton.addEventListener("click", openSettings);

  fields.modelPreset?.addEventListener("change", () => {
    if (fields.modelPreset.value) fields.model.value = fields.modelPreset.value;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAiConfig({
      enabled: fields.enabled.checked,
      baseUrl: fields.baseUrl.value.trim(),
      model: fields.model.value.trim(),
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

initAuth();
initPlayerDataUi();
initAiSettings();
initStartScreen();
initResultScreen();
initMusic();
loadCardArtManifest();
render();
