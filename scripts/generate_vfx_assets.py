from math import cos, pi, sin
from pathlib import Path
from random import Random

from PIL import Image, ImageDraw, ImageFilter


OUT = Path(__file__).resolve().parents[1] / "web" / "assets" / "vfx"
FRAMES = 8
SIZE = 96


def rgba(hex_color, alpha=255):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i + 2], 16) for i in (0, 2, 4)) + (alpha,)


def glow_layer(size=SIZE):
    return Image.new("RGBA", (size, size), (0, 0, 0, 0))


def save_strip(name, painter, frames=FRAMES, size=SIZE):
    OUT.mkdir(parents=True, exist_ok=True)
    strip = Image.new("RGBA", (size * frames, size), (0, 0, 0, 0))
    for index in range(frames):
        frame = glow_layer(size)
        painter(frame, ImageDraw.Draw(frame), index, frames)
        strip.alpha_composite(frame, (index * size, 0))
    strip.save(OUT / name)


def draw_soft_line(draw, points, color, width):
    for grow, alpha in ((10, 36), (6, 62), (2, 180), (0, 255)):
        draw.line(points, fill=color[:3] + (min(alpha, color[3]),), width=width + grow, joint="curve")


def fire_spell(img, draw, i, frames):
    t = i / (frames - 1)
    cx, cy = 48, 58 - t * 18
    for r, col in ((34, "#ff3b1f"), (24, "#ff9f30"), (12, "#fff2a4")):
        box = [cx - r * (1 - t * 0.22), cy - r, cx + r * (1 + t * 0.15), cy + r]
        draw.ellipse(box, fill=rgba(col, int(42 + 110 * (1 - t))))
    for k in range(9):
        a = -pi / 2 + (k - 4) * 0.23
        length = 28 + 16 * t + k % 3 * 4
        x = cx + cos(a) * length
        y = cy + sin(a) * length - 18 * t
        draw_soft_line(draw, [(cx, cy + 10), (x, y)], rgba("#ff6b25", 180), 3)
    img.alpha_composite(img.filter(ImageFilter.GaussianBlur(1)))


def fire_wrath(img, draw, i, frames):
    t = i / (frames - 1)
    cx, cy = 48, 50
    radius = 14 + t * 35
    for k in range(14):
        a = k / 14 * pi * 2 + t * 3.2
        start = (cx + cos(a) * (8 + t * 6), cy + sin(a) * (8 + t * 6))
        end = (cx + cos(a) * radius, cy + sin(a) * radius)
        draw_soft_line(draw, [start, end], rgba("#ff4a22", int(210 * (1 - t * 0.35))), 3)
    draw.ellipse([cx - radius * .45, cy - radius * .45, cx + radius * .45, cy + radius * .45], outline=rgba("#ffe38a", 220), width=3)


def water_magic(img, draw, i, frames):
    t = i / (frames - 1)
    cx, cy = 48, 54
    for k in range(4):
        r = 14 + k * 8 + t * 10
        draw.arc([cx - r, cy - r * .55, cx + r, cy + r * .55], 180 + t * 80, 350 + t * 120, fill=rgba("#62d9ff", 210 - k * 32), width=4)
    for k in range(8):
        x = 18 + k * 9 + sin(t * 6 + k) * 4
        y = 66 - t * 34 + cos(k) * 5
        draw.ellipse([x - 2, y - 2, x + 2, y + 2], fill=rgba("#d9fbff", 220))


def ice_lance(img, draw, i, frames):
    t = i / (frames - 1)
    x0 = 14 + t * 22
    points = [(x0, 58), (70 + t * 8, 36), (82 + t * 7, 42), (24 + t * 20, 66)]
    draw.polygon(points, fill=rgba("#bff5ff", 210), outline=rgba("#ffffff", 240))
    draw_soft_line(draw, [(x0, 58), (84 + t * 4, 39)], rgba("#4cbfe8", 150), 3)


def metal_lightning(img, draw, i, frames):
    t = i / (frames - 1)
    rng = Random(i + 41)
    x, y = 18, 50
    pts = [(x, y)]
    for step in range(1, 7):
        pts.append((18 + step * 10, 50 + rng.randint(-20, 20) * (0.4 + t)))
    pts.append((88, 48))
    draw_soft_line(draw, pts, rgba("#f5fbff", 235), 3)
    draw_soft_line(draw, [(22, 62), (44, 48), (68, 58)], rgba("#f0c76d", 150), 2)


def wood_spell(img, draw, i, frames):
    t = i / (frames - 1)
    base_y = 78
    for k in range(5):
        x = 24 + k * 12
        h = 22 + t * 34 + sin(k + t * 4) * 5
        draw_soft_line(draw, [(x, base_y), (x + sin(t * 5 + k) * 10, base_y - h)], rgba("#58d675", 200), 3)
        leaf_x = x + sin(t * 5 + k) * 10
        leaf_y = base_y - h
        draw.ellipse([leaf_x - 8, leaf_y - 4, leaf_x + 7, leaf_y + 5], fill=rgba("#a7f08f", 190))


def nature_heal(img, draw, i, frames):
    t = i / (frames - 1)
    cx, cy = 48, 52
    for k in range(12):
        a = k / 12 * pi * 2 + t * 1.8
        r = 16 + t * 22
        x = cx + cos(a) * r
        y = cy + sin(a) * r - t * 20
        draw.ellipse([x - 3, y - 5, x + 5, y + 3], fill=rgba("#b7ff9a", int(210 * (1 - t * .25))))
    draw.ellipse([30, 34, 66, 70], outline=rgba("#5fe38a", 180), width=3)


def earth_impact(img, draw, i, frames):
    t = i / (frames - 1)
    cy = 66
    for k in range(5):
        x = 20 + k * 14
        h = (1 - abs(t - 0.48)) * (18 + k % 2 * 8)
        draw.polygon([(x - 9, cy), (x, cy - h - 10), (x + 10, cy)], fill=rgba("#c2954c", 205), outline=rgba("#f0d28b", 170))
    r = 10 + t * 34
    draw.ellipse([48 - r, cy - r * .28, 48 + r, cy + r * .28], outline=rgba("#d7b46a", int(220 * (1 - t * .4))), width=4)


def earth_spell(img, draw, i, frames):
    t = i / (frames - 1)
    for k in range(7):
        x = 18 + k * 10
        y = 72 - t * (18 + k % 3 * 4)
        draw.rectangle([x - 5, y - 5, x + 5, y + 5], fill=rgba("#b48943", 190), outline=rgba("#f3d68a", 150))
    draw.arc([20, 36, 76, 84], 180, 360, fill=rgba("#e0b763", 180), width=5)


def light_pillar(img, draw, i, frames):
    t = i / (frames - 1)
    alpha = int(230 * (1 - abs(t - .45) * .8))
    for w, a in ((42, 35), (24, 80), (10, alpha)):
        draw.rounded_rectangle([48 - w / 2, 6, 48 + w / 2, 90], radius=w / 2, fill=rgba("#fff2b8", a))
    draw.ellipse([19, 70, 77, 88], outline=rgba("#f4d979", 185), width=3)


def portal(img, draw, i, frames):
    t = i / (frames - 1)
    cx, cy = 48, 50
    for k in range(3):
        r = 18 + k * 9 + sin(t * pi * 2 + k) * 3
        draw.arc([cx - r, cy - r, cx + r, cy + r], t * 360 + k * 48, t * 360 + 260 + k * 48, fill=rgba("#b78cff", 210 - k * 40), width=4)
    draw.ellipse([34, 36, 62, 64], fill=rgba("#55358f", 74), outline=rgba("#f5ddff", 190), width=2)


def magic_circle(img, draw, i, frames):
    t = i / (frames - 1)
    cx, cy = 48, 48
    for r in (16, 29, 40):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=rgba("#f4d979", 130 + r), width=2)
    pts = []
    for k in range(5):
        a = -pi / 2 + k * pi * 2 / 5 + t * .4
        pts.append((cx + cos(a) * 34, cy + sin(a) * 34))
    draw.line(pts + [pts[0]], fill=rgba("#fff5be", 220), width=2)
    for p in pts:
        draw.ellipse([p[0] - 4, p[1] - 4, p[0] + 4, p[1] + 4], fill=rgba("#ffffff", 220))


def main():
    save_strip("fire-spell.png", fire_spell)
    save_strip("fire-wrath.png", fire_wrath)
    save_strip("water-magic.png", water_magic)
    save_strip("ice-lance.png", ice_lance)
    save_strip("metal-lightning.png", metal_lightning)
    save_strip("wood-spell.png", wood_spell)
    save_strip("nature-heal.png", nature_heal)
    save_strip("earth-impact.png", earth_impact)
    save_strip("earth-spell.png", earth_spell)
    save_strip("light-pillar.png", light_pillar)
    save_strip("portal.png", portal)
    save_strip("magic-circle.png", magic_circle)


if __name__ == "__main__":
    main()
