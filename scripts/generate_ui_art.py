#!/usr/bin/env python3
import pathlib
import sys

from PIL import Image, ImageFilter

import generate_card_art as card_art


ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "web" / "assets" / "ui"


AI_AVATAR_PROMPT = (
    "Square portrait illustration for a mobile xianxia card battle game AI opponent avatar. "
    "Subject: an elegant but intimidating male/female ambiguous cultivator tactician, half-shadowed face, "
    "wearing dark jade and black-gold robes, calm sharp eyes, faint Five Elements array halo behind the head. "
    "Mood: clever, dangerous, arrogant, not monstrous. "
    "Style: polished 2D game character portrait, crisp painterly anime-fantasy, high contrast, readable at small size. "
    "Composition: centered bust portrait, circular-avatar friendly, strong silhouette, clean background. "
    "Palette: dark ink green, antique gold, subtle cyan spiritual light. "
    "No text, no logo, no watermark, no UI frame."
)


START_BG_PROMPT = (
    "Single vertical mobile game start screen background for a xianxia Five Elements card battle game named Array Duel / 斗阵. "
    "Scene: a dramatic night ritual arena above misty mountains, a large glowing Five Elements formation array on the ground, "
    "five directional elemental lights for wood, fire, earth, metal, water, central golden nexus, floating talismans and sword qi. "
    "The image should feel premium and game-like, with clear depth, cinematic lighting, refined spiritual energy, "
    "not a software UI mockup. "
    "Composition: vertical poster-like background, central formation visible but leave a darker readable area in the lower middle for title/buttons, "
    "no characters in the foreground, no text, no letters, no numbers, no watermark, no logo. "
    "Style: polished 2D fantasy game key art, crisp painterly, high contrast, mystical xianxia atmosphere."
)


BATTLE_BG_PROMPT = (
    "Vertical mobile game battlefield background texture for a xianxia card battle UI. "
    "It must look like a playable card-table backdrop, not poster key art. "
    "Scene: bright Chinese ink-wash shanshui landscape on warm rice paper, distant blue-green mountains at the top, "
    "soft river mist, pale clouds, a few pine branches at the far edges, subtle stone-and-jade tabletop texture in the lower half. "
    "The middle 70 percent of the image must be calm, clean, low-detail negative space for cards and UI. "
    "Use airy daylight and gentle immortal-cultivation atmosphere, refined and elegant, not dark, not horror, not sci-fi. "
    "Very subtle Five Elements hints only as tiny edge accents: muted green, red, ochre, silver, and blue brush wisps; no magic circle. "
    "Composition: vertical 9:16 mobile game background, scenery around top and side borders, center intentionally quiet, "
    "soft paper grain, shallow contrast, no strong focal point, no large object, no platform, no arena, no character. "
    "Palette: ivory rice paper, mist white, pale jade green, soft cyan mountain blue, muted ink gray, tiny antique-gold accents. "
    "No black empty background, no giant moon, no huge central array, no glowing portal, no text, no letters, no numbers, no logo, no watermark. "
    "Style: premium 2D mobile game background, elegant xianxia ink painting blended with subtle game UI texture, readable behind small card slots."
)


CARD_BACK_PROMPT = (
    "Vertical card back artwork for a mobile xianxia Five Elements card battle game named Array Duel / 斗阵. "
    "Design a clean, readable card back, not a busy illustration. "
    "Main visual: one large centered Five Elements array sigil, simple circular geometry, five small colored nodes around it, "
    "thin antique gold linework, dark jade-black lacquer background, subtle paper grain. "
    "Use only a few strong shapes so it remains beautiful and recognizable when scaled to a tiny battlefield card. "
    "Composition: vertical playing-card ratio, elegant thin border, clear empty margin, high contrast center emblem, perfectly symmetrical. "
    "Avoid clutter, avoid many small ornaments, avoid character art, avoid landscape, avoid realistic objects, avoid glowing fog blobs. "
    "Palette: deep jade black, antique gold, tiny accents of green, red, ochre, silver, blue. "
    "No text, no letters, no numbers, no logo, no watermark, no mockup, no UI buttons. "
    "Style: premium 2D game card back asset, crisp vector-like painterly finish, clean and refined."
)


def save_avatar(raw):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = OUT_DIR / "ai-avatar.source.png"
    target = OUT_DIR / "ai-avatar.jpg"
    source.write_bytes(raw)
    with Image.open(source) as image:
        image = image.convert("RGB")
        width, height = image.size
        side = min(width, height)
        left = (width - side) // 2
        top = (height - side) // 2
        image = image.crop((left, top, left + side, top + side)).resize((512, 512), Image.Resampling.LANCZOS)
        image.save(target, format="JPEG", quality=88, optimize=True, progressive=True)
    source.unlink(missing_ok=True)
    return target


def save_start_background(raw):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = OUT_DIR / "start-bg.source.png"
    target = OUT_DIR / "start-bg.jpg"
    source.write_bytes(raw)
    with Image.open(source) as image:
        image = image.convert("RGB")
        width, height = image.size

        canvas_w, canvas_h = 1440, 2160
        cover_scale = max(canvas_w / width, canvas_h / height)
        cover = image.resize((int(width * cover_scale), int(height * cover_scale)), Image.Resampling.LANCZOS)
        left = (cover.width - canvas_w) // 2
        top = (cover.height - canvas_h) // 2
        cover = cover.crop((left, top, left + canvas_w, top + canvas_h))

        fit_scale = min(canvas_w / width, canvas_h / height) * 1.02
        foreground = image.resize((int(width * fit_scale), int(height * fit_scale)), Image.Resampling.LANCZOS)
        background = cover.filter(ImageFilter.GaussianBlur(22))
        x = (canvas_w - foreground.width) // 2
        y = int(canvas_h * 0.08)
        background.paste(foreground, (x, y))
        background.save(target, format="JPEG", quality=88, optimize=True, progressive=True)
    source.unlink(missing_ok=True)
    return target


def save_battle_background(raw):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = OUT_DIR / "battle-bg.source.png"
    target = OUT_DIR / "battle-bg.jpg"
    source.write_bytes(raw)
    with Image.open(source) as image:
        image = image.convert("RGB")
        width, height = image.size
        canvas_w, canvas_h = 1440, 2560
        cover_scale = max(canvas_w / width, canvas_h / height)
        cover = image.resize((int(width * cover_scale), int(height * cover_scale)), Image.Resampling.LANCZOS)
        left = (cover.width - canvas_w) // 2
        top = max(0, int((cover.height - canvas_h) * 0.42))
        cover = cover.crop((left, top, left + canvas_w, top + canvas_h))
        cover.save(target, format="JPEG", quality=88, optimize=True, progressive=True)
    source.unlink(missing_ok=True)
    return target


def save_card_back(raw):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    source = OUT_DIR / "card-back.source.png"
    target = OUT_DIR / "card-back.jpg"
    source.write_bytes(raw)
    with Image.open(source) as image:
        image = image.convert("RGB")
        width, height = image.size
        canvas_w, canvas_h = 768, 1076
        cover_scale = max(canvas_w / width, canvas_h / height)
        cover = image.resize((int(width * cover_scale), int(height * cover_scale)), Image.Resampling.LANCZOS)
        left = (cover.width - canvas_w) // 2
        top = (cover.height - canvas_h) // 2
        cover = cover.crop((left, top, left + canvas_w, top + canvas_h))
        cover.save(target, format="JPEG", quality=90, optimize=True, progressive=True)
    source.unlink(missing_ok=True)
    return target


def main():
    config = card_art.load_config()
    if not config["apiKey"]:
        raise SystemExit("Missing API key. Set GPT_IMAGE2_API_KEY/OPENAI_API_KEY or configure ~/plugins/gpt-image2/config.json.")

    targets = {
        "avatar": (AI_AVATAR_PROMPT, save_avatar),
        "background": (START_BG_PROMPT, save_start_background),
        "battle-background": (BATTLE_BG_PROMPT, save_battle_background),
        "card-back": (CARD_BACK_PROMPT, save_card_back),
    }
    selected = sys.argv[1:] or list(targets)
    for name in selected:
        if name not in targets:
            raise SystemExit(f"Unknown target: {name}")
        prompt, saver = targets[name]
        print(f"generate {name}", flush=True)
        raw = card_art.request_image(config, prompt)
        path = saver(raw)
        print(path, flush=True)


if __name__ == "__main__":
    main()
