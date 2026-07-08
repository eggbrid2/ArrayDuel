#!/usr/bin/env python3
import base64
import json
import os
import pathlib
import re
import time
import urllib.error
import urllib.request

from PIL import Image


ROOT = pathlib.Path(__file__).resolve().parents[1]
APP_JS = ROOT / "web" / "app.js"
OUT_DIR = ROOT / "web" / "assets" / "cards"
MANIFEST = OUT_DIR / "manifest.json"
DEFAULT_CONFIG = pathlib.Path.home() / "plugins" / "gpt-image2" / "config.json"

ELEMENT_STYLE = {
    "wood": ("emerald green", "ancient vines, spirit bamboo, jade sword aura"),
    "fire": ("crimson red and gold", "phoenix flame, cinnabar talisman, burning sword aura"),
    "earth": ("ochre gold and dark stone", "mountain seal, stone tablet, protective earth qi"),
    "metal": ("silver, white gold and ink black", "flying blades, sword light, polished metal qi"),
    "water": ("deep blue and moonlit cyan", "cold spring, flowing water, mirror-like frost qi"),
    "eye": (
        "five color spiritual light",
        "complete taoist battle formation diagram, central nexus node, rotating five elements rings, glowing array lines, talisman anchors",
    ),
}

TYPE_STYLE = {
    "attack": "dynamic offensive spell impact, weapon energy, forward motion",
    "defense": "protective barrier, shield formation, stable posture",
    "heal": "gentle medicinal aura, restorative light, elixir glow",
    "counter": "rebounding energy, mirrored strike, defensive retaliation",
    "destroy": "shattering talisman, broken formation, destructive spell burst",
    "ongoing": "persistent magic circle, continuous spiritual current, calm power",
    "eye": "formation nexus, complete magic array diagram, central anchor node, sustained field power, no eyeball imagery",
}

EYE_ELEMENT_STYLE = {
    "fire": "a fire-dominant Five Elements array: crimson and gold as the main palette, flame-shaped array lines, phoenix fire arcs, cinnabar talisman sparks",
    "wood": "a wood-dominant Five Elements array: emerald and jade as the main palette, vine-shaped array lines, bamboo spirit marks, leaf glyphs and living green qi",
    "metal": "a metal-dominant Five Elements array: silver and white-gold as the main palette, sword-shaped array lines, blade glyphs, sharp metallic light",
    "earth": "an earth-dominant Five Elements array: ochre and dark gold as the main palette, mountain-shaped array lines, stone tablet seals, heavy earth qi",
    "water": "a water-dominant Five Elements array: deep blue and moonlit cyan as the main palette, wave-shaped array lines, frost-water glyphs, cold spring qi",
}


def load_config():
    config_path = pathlib.Path(os.environ.get("ARRAY_DUEL_IMAGE2_CONFIG", DEFAULT_CONFIG)).expanduser()
    data = {}
    if config_path.is_file():
        data = json.loads(config_path.read_text(encoding="utf-8"))
    return {
        "url": os.environ.get("GPT_IMAGE2_BASE_URL") or os.environ.get("OPENAI_BASE_URL") or data.get("url", "https://api.openai.com/v1"),
        "apiKey": os.environ.get("GPT_IMAGE2_API_KEY") or os.environ.get("OPENAI_API_KEY") or data.get("apiKey", ""),
        "model": os.environ.get("GPT_IMAGE2_MODEL") or data.get("model", "gpt-image-2"),
        "userAgent": os.environ.get("GPT_IMAGE2_USER_AGENT") or data.get("userAgent", "curl/8.7.1"),
    }


def extract_cards():
    text = APP_JS.read_text(encoding="utf-8")
    cards = []
    pool_start = text.index("const cardPool = {")
    eye_start = text.index("const eyePool = [")
    pool_text = text[pool_start:eye_start]
    for element in ["wood", "fire", "earth", "metal", "water"]:
        block_match = re.search(rf"\n\s*{element}:\s*\[(.*?)\n\s*\],", pool_text, re.S)
        if not block_match:
            raise RuntimeError(f"Cannot find {element} card pool.")
        found = re.findall(r'\{\s*name:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*value:\s*(\d+),\s*text:\s*"([^"]+)"\s*\}', block_match.group(1))
        for index, (name, card_type, value, desc) in enumerate(found, start=1):
            cards.append({
                "name": name,
                "type": card_type,
                "value": int(value),
                "text": desc,
                "element": element,
                "filename": f"{element}-{index:02d}.jpg",
            })
    eye_block = re.search(r"const eyePool = \[(.*?)\n\];", text, re.S)
    if not eye_block:
        raise RuntimeError("Cannot find eyePool.")
    found = re.findall(r'\{\s*name:\s*"([^"]+)",\s*element:\s*"([^"]+)",\s*type:\s*"eye",\s*value:\s*(\d+),\s*text:\s*"([^"]+)"\s*\}', eye_block.group(1))
    for index, (name, element, value, desc) in enumerate(found, start=1):
        cards.append({
            "name": name,
            "type": "eye",
            "value": int(value),
            "text": desc,
            "element": element,
            "filename": f"eye-{index:02d}.jpg",
        })
    return cards


def prompt_for(card):
    palette, element_motif = ELEMENT_STYLE["eye" if card["type"] == "eye" else card["element"]]
    type_motif = TYPE_STYLE[card["type"]]
    if card["type"] == "eye":
        eye_element = EYE_ELEMENT_STYLE.get(card["element"], "")
        composition = (
            "Composition: show one complete Five Elements formation array, top-down, filling the portrait like a ritual battle diagram. "
            "The array must be recognizable as a Five Elements formation: circular array rings, five directional positions, central nexus, and subtle symbols for wood, fire, earth, metal, and water. "
            f"But the entire formation must be visually ruled by this card's element: {eye_element}. "
            "Make the whole diagram feel like that element's version of a Five Elements array, not five equal colored dots. "
            "Keep the five-element structure visible; do not turn it into a single spell object or a generic rainbow diagram. "
            "This is an array core, not a creature and not an eyeball; absolutely no eyes, pupils, faces, iris shapes, or human gaze. "
        )
    else:
        composition = (
            "Composition: single central magical object or spell scene, strong silhouette, readable at small size, "
        )
    return (
        "Vertical fantasy trading card illustration for a mobile card game, xianxia cultivation theme. "
        f"Card name concept: {card['name']}. Element: {card['element']}. Card type: {card['type']}. "
        f"Visual motifs: {element_motif}; {type_motif}. "
        f"Palette: {palette}, antique parchment accents, refined gold rim light. "
        f"{composition}"
        "no UI frame, no text, no letters, no numbers, no watermark, no logo. "
        "Style: polished 2D game card art, painterly but crisp, dramatic spiritual energy, high contrast, "
        "portrait composition, clean background, not photorealistic."
    )


def request_image(config, prompt):
    body = json.dumps({
        "model": config["model"],
        "prompt": prompt,
        "size": "1024x1024",
        "n": 1,
    }).encode("utf-8")
    request = urllib.request.Request(
        config["url"].rstrip("/") + "/images/generations",
        data=body,
        headers={
            "Authorization": f"Bearer {config['apiKey']}",
            "Content-Type": "application/json",
            "Accept": "*/*",
            "User-Agent": config["userAgent"],
        },
        method="POST",
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=240) as response:
                data = json.loads(response.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as error:
            if error.code != 524 or attempt == 2:
                raise
            time.sleep(4 + attempt * 5)
        except urllib.error.URLError:
            if attempt == 2:
                raise
            time.sleep(4 + attempt * 5)
    item = data.get("data", [{}])[0]
    if item.get("b64_json"):
        return base64.b64decode(item["b64_json"])
    if item.get("url"):
        last_error = None
        for attempt in range(3):
            image_request = urllib.request.Request(
                item["url"],
                headers={
                    "Accept": "*/*",
                    "User-Agent": config["userAgent"],
                },
                method="GET",
            )
            try:
                with urllib.request.urlopen(image_request, timeout=240) as response:
                    return response.read()
            except urllib.error.HTTPError as error:
                last_error = error
                if error.code != 524 or attempt == 2:
                    raise
                time.sleep(3 + attempt * 4)
            except urllib.error.URLError as error:
                last_error = error
                if attempt == 2:
                    raise
                time.sleep(3 + attempt * 4)
        if last_error:
            raise last_error
    raise RuntimeError("Image response did not include b64_json or url.")


def save_card_image(raw, path):
    temp = path.with_suffix(".source.png")
    temp.write_bytes(raw)
    with Image.open(temp) as image:
        image = image.convert("RGB")
        width, height = image.size
        target_ratio = 5 / 7
        current_ratio = width / height
        if current_ratio > target_ratio:
            new_width = int(height * target_ratio)
            left = (width - new_width) // 2
            image = image.crop((left, 0, left + new_width, height))
        elif current_ratio < target_ratio:
            new_height = int(width / target_ratio)
            top = (height - new_height) // 2
            image = image.crop((0, top, width, top + new_height))
        image = image.resize((640, 896), Image.Resampling.LANCZOS)
        image.save(path, format="JPEG", quality=86, optimize=True, progressive=True)
    temp.unlink(missing_ok=True)


def main():
    config = load_config()
    if not config["apiKey"]:
        raise SystemExit("Missing API key. Set GPT_IMAGE2_API_KEY/OPENAI_API_KEY or configure ~/plugins/gpt-image2/config.json.")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cards = extract_cards()
    limit = int(os.environ.get("ARRAY_DUEL_IMAGE_LIMIT", "0") or "0")
    start = max(1, int(os.environ.get("ARRAY_DUEL_IMAGE_START", "1") or "1"))
    force = os.environ.get("ARRAY_DUEL_IMAGE_FORCE") == "1"
    MANIFEST.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding="utf-8")
    generated = []
    selected_cards = cards[start - 1:]
    if limit:
        selected_cards = selected_cards[:limit]
    for card in selected_cards:
        path = OUT_DIR / card["filename"]
        if path.exists() and not force:
            print(f"skip {card['filename']} {card['name']}", flush=True)
            continue
        print(f"generate {card['filename']} {card['name']}", flush=True)
        try:
            raw = request_image(config, prompt_for(card))
            save_card_image(raw, path)
            generated.append(card["filename"])
        except Exception as exc:
            print(f"failed {card['filename']} {card['name']}: {exc}", flush=True)
            continue
        time.sleep(0.8)
    print(f"cards: {len(cards)}, generated: {len(generated)}, output: {OUT_DIR}", flush=True)


if __name__ == "__main__":
    main()
