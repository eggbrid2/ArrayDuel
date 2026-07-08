#!/usr/bin/env python3
import json
import math
import os
import pathlib
import sys
import time

from PIL import Image

import generate_card_art as single


ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "web" / "assets" / "cards"
SHEET_DIR = OUT_DIR / "sheets"
COLS = int(os.environ.get("ARRAY_DUEL_SHEET_COLS", "3") or "3")
ROWS = int(os.environ.get("ARRAY_DUEL_SHEET_ROWS", "2") or "2")
PER_SHEET = COLS * ROWS


def card_line(index, card):
    palette, element_motif = single.ELEMENT_STYLE["eye" if card["type"] == "eye" else card["element"]]
    type_motif = single.TYPE_STYLE[card["type"]]
    eye_element = single.EYE_ELEMENT_STYLE.get(card["element"], "")
    subject = (
        f"complete Five Elements formation diagram with five directional positions and central nexus, overall element style: {eye_element}; no eyeball imagery"
        if card["type"] == "eye"
        else "single readable magical spell/object scene"
    )
    return (
        f"{index}. {card['name']} - element {card['element']}, type {card['type']}, "
        f"palette {palette}, subject: {subject}, motifs: {element_motif}; {type_motif}"
    )


def sheet_prompt(cards, sheet_index):
    lines = "\n".join(card_line(index + 1, card) for index, card in enumerate(cards))
    return (
        f"Create a single sprite sheet of {len(cards)} separate xianxia fantasy trading card illustrations, "
        f"arranged in an exact {COLS} columns by {ROWS} rows grid. "
        "Each grid cell must contain one complete portrait illustration, centered, with clear visual padding inside the cell. "
        "Use consistent polished 2D game card art style, dramatic spiritual energy, antique parchment and refined gold rim light. "
        "Do not draw card frames, no UI borders except faint separation between cells, no text, no letters, no numbers, no watermark, no logo. "
        "For type eye / 阵眼, draw a complete Five Elements xianxia formation array with five directional positions and a central nexus; the whole formation should be dominated by the listed element style, not an eyeball or creature. "
        "Every cell should be visually distinct and match its listed element/type. "
        f"Sheet {sheet_index}. Cell mapping:\n{lines}"
    )


def crop_sheet(sheet_path, cards):
    with Image.open(sheet_path) as image:
        image = image.convert("RGB")
        width, height = image.size
        cell_w = width // COLS
        cell_h = height // ROWS
        for index, card in enumerate(cards):
            row = index // COLS
            col = index % COLS
            left = col * cell_w
            top = row * cell_h
            crop = image.crop((left, top, left + cell_w, top + cell_h))
            temp = OUT_DIR / f".{card['filename']}.source.png"
            target = OUT_DIR / card["filename"]
            crop.save(temp, format="PNG")
            single.save_card_image(temp.read_bytes(), target)
            temp.unlink(missing_ok=True)
            print(f"slice {target.name} {card['name']}", flush=True)


def generate_sheet(config, cards, sheet_index):
    SHEET_DIR.mkdir(parents=True, exist_ok=True)
    raw = single.request_image(config, sheet_prompt(cards, sheet_index))
    sheet_path = SHEET_DIR / f"sheet-{sheet_index:02d}.png"
    sheet_path.write_bytes(raw)
    print(f"sheet {sheet_path}", flush=True)
    crop_sheet(sheet_path, cards)


def main():
    config = single.load_config()
    if not config["apiKey"]:
        raise SystemExit("Missing API key. Set GPT_IMAGE2_API_KEY/OPENAI_API_KEY or configure ~/plugins/gpt-image2/config.json.")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cards = single.extract_cards()
    single.MANIFEST.write_text(json.dumps(cards, ensure_ascii=False, indent=2), encoding="utf-8")
    start_sheet = max(1, int(os.environ.get("ARRAY_DUEL_SHEET_START", "1") or "1"))
    limit_sheets = int(os.environ.get("ARRAY_DUEL_SHEET_LIMIT", "0") or "0")
    force = os.environ.get("ARRAY_DUEL_IMAGE_FORCE") == "1"
    missing_only = os.environ.get("ARRAY_DUEL_SHEET_MISSING_ONLY", "1") != "0" and not force
    source_cards = [card for card in cards if not (OUT_DIR / card["filename"]).exists()] if missing_only else cards
    chunks = [source_cards[index:index + PER_SHEET] for index in range(0, len(source_cards), PER_SHEET)]
    selected = chunks[start_sheet - 1:]
    if limit_sheets:
        selected = selected[:limit_sheets]
    for offset, chunk in enumerate(selected, start=start_sheet):
        missing = [card for card in chunk if force or not (OUT_DIR / card["filename"]).exists()]
        if not missing:
            print(f"skip sheet {offset:02d}", flush=True)
            continue
        print(f"generate sheet {offset:02d}: {', '.join(card['name'] for card in chunk)}", flush=True)
        try:
            generate_sheet(config, chunk, offset)
        except Exception as exc:
            print(f"failed sheet {offset:02d}: {exc}", flush=True)
        time.sleep(1.2)
    print(f"done sheets={math.ceil(len(cards) / PER_SHEET)} cards={len(cards)}", flush=True)


if __name__ == "__main__":
    sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
    main()
