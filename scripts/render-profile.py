#!/usr/bin/env python3
import json
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"

W, H = 1306, 1204
GOLD = (242, 207, 136)
TEXT = (238, 235, 226)
MUTED = (188, 176, 154)
SHADOW = (0, 0, 0, 180)


FALLBACK_USER = {
    "login": "Maple0517",
    "name": "Maple",
    "bio": "SDE @aws",
    "company": "@AWS",
    "location": "Seattle",
    "public_repos": 9,
    "followers": 2,
    "following": 3,
}

FALLBACK_REPOS = {
    "accountant": {
        "name": "accountant",
        "html_url": "https://github.com/Maple0517/accountant",
        "description": "AI-native finance workspace for clean transactions, receipts, and Notion sync.",
        "stargazers_count": 0,
    },
    "Pomotree": {
        "name": "Pomotree",
        "html_url": "https://github.com/Maple0517/Pomotree",
        "description": "Local-first focus timer that grows task trees and protects deep work.",
        "stargazers_count": 0,
    },
}


def gh_json(path, fallback):
    try:
        raw = subprocess.check_output(["gh", "api", path], text=True, stderr=subprocess.DEVNULL)
        return {**fallback, **json.loads(raw)}
    except Exception:
        return fallback


def font(path, size):
    return ImageFont.truetype(path, size=size)


SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
SANS_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def text(draw, xy, content, fill=TEXT, size=18, face=SANS, anchor=None, stroke=False):
    x, y = xy
    f = font(face, size)
    if stroke:
        draw.text((x + 2, y + 2), content, fill=SHADOW, font=f, anchor=anchor)
    draw.text((x, y), content, fill=fill, font=f, anchor=anchor)


def fit_text(draw, content, max_width, size, face):
    f = font(face, size)
    value = content
    while draw.textlength(value, font=f) > max_width and len(value) > 4:
        value = value[:-2].rstrip() + "..."
    return value


def circle_avatar(base):
    avatar = Image.open(ASSETS / "avatar.png").convert("RGB").resize((138, 138), Image.Resampling.LANCZOS)
    mask = Image.new("L", avatar.size, 0)
    ImageDraw.Draw(mask).ellipse((0, 0, 137, 137), fill=255)
    base.paste(avatar, (69, 133), mask)


def rounded_label(draw, x, y, label, width=None):
    f = font(SANS_BOLD, 12)
    w = width or int(draw.textlength(label, font=f) + 22)
    draw.rounded_rectangle((x, y, x + w, y + 24), radius=5, fill=(13, 20, 32), outline=(99, 75, 43))
    draw.text((x + 10, y + 6), label, fill=TEXT, font=f)
    return w


def draw_radar(draw, cx, cy, r):
    labels = [
        ("Backend 95", -4, -r - 27),
        ("System 90", r + 60, -29),
        ("AI / ML 85", r + 58, 45),
        ("Cloud 85", 0, r + 22),
        ("Frontend 75", -r - 68, 45),
        ("Product 85", -r - 68, -29),
    ]
    points = []
    for i in range(6):
        a = math.radians(-90 + i * 60)
        points.append((cx + math.cos(a) * r, cy + math.sin(a) * r))
    for scale in [1, 0.66, 0.33]:
        ring = [(cx + (x - cx) * scale, cy + (y - cy) * scale) for x, y in points]
        draw.polygon(ring, outline=(120, 86, 190, 110), fill=None)
    for x, y in points:
        draw.line((cx, cy, x, y), fill=(100, 82, 130, 90), width=1)
    values = [0.95, 0.9, 0.85, 0.85, 0.75, 0.85]
    poly = [(cx + (x - cx) * v, cy + (y - cy) * v) for (x, y), v in zip(points, values)]
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.polygon(poly, fill=(92, 42, 180, 130), outline=(174, 132, 255, 230))
    return overlay, labels


def draw_skill_gem(draw, x, y, color, label, level):
    draw.rounded_rectangle((x, y, x + 46, y + 46), radius=5, fill=(8, 15, 25), outline=(109, 79, 43))
    draw.polygon([(x + 23, y + 5), (x + 38, y + 16), (x + 33, y + 38), (x + 23, y + 43), (x + 13, y + 38), (x + 8, y + 16)], fill=color)
    text(draw, (x + 23, y + 57), label, fill=TEXT, size=11, anchor="ma")
    text(draw, (x + 23, y + 72), f"Lv. {level}", fill=GOLD, size=11, anchor="ma")


def main():
    user = gh_json("user", FALLBACK_USER)
    repos = {
        "accountant": gh_json("repos/Maple0517/accountant", FALLBACK_REPOS["accountant"]),
        "Pomotree": gh_json("repos/Maple0517/Pomotree", FALLBACK_REPOS["Pomotree"]),
    }

    img = Image.open(ASSETS / "profile-rpg-bg.png").convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    circle_avatar(img)

    # Top banner
    text(draw, (250, 130), user.get("name") or user.get("login"), fill=GOLD, size=58, face=SERIF_BOLD, stroke=True)
    text(draw, (252, 190), "SDE @ AWS | Seattle, WA", size=18, face=SANS_BOLD, stroke=True)
    text(draw, (252, 224), "Builder of AI-native products with clean UX", size=17, stroke=True)
    text(draw, (252, 268), "Code      Design      AI      Cloud", fill=GOLD, size=13, face=SANS_BOLD, stroke=True)
    text(draw, (124, 43), "HP 100 / 100", fill=GOLD, size=13, face=SANS_BOLD)
    text(draw, (124, 78), "XP 2360 / 3200", fill=GOLD, size=13, face=SANS_BOLD)
    text(draw, (373, 55), "Lv. 25", fill=GOLD, size=13, face=SANS_BOLD)

    text(draw, (1064, 128), "CURRENT QUEST", fill=GOLD, size=20, face=SERIF_BOLD)
    text(draw, (1084, 174), "Build useful things that", size=14, face=SANS_BOLD)
    text(draw, (1084, 199), "create real impact.", size=14, face=SANS_BOLD)
    text(draw, (1084, 242), "PROGRESS", fill=GOLD, size=12, face=SANS_BOLD)
    draw.rounded_rectangle((1165, 233, 1248, 244), radius=4, fill=(42, 32, 18), outline=(116, 84, 45))
    draw.rounded_rectangle((1166, 234, 1228, 243), radius=4, fill=(196, 157, 86))
    text(draw, (1258, 231), "75%", fill=GOLD, size=12, face=SANS_BOLD)

    # About
    text(draw, (66, 386), "ABOUT ME", fill=GOLD, size=20, face=SERIF_BOLD)
    text(draw, (72, 432), "I turn ideas into products that people enjoy using.", size=14)
    text(draw, (72, 458), "Backend-minded, product-driven, and AI-curious.", size=14)
    text(draw, (72, 484), "I like systems that are useful, clean, and reliable.", size=14)
    for x, label in [(92, "Problem Solver"), (197, "Product Builder"), (303, "AI Enthusiast"), (408, "Cloud Explorer")]:
        text(draw, (x, 628), label, size=12, anchor="ma")

    # Inventory
    text(draw, (506, 386), "INVENTORY", fill=GOLD, size=20, face=SERIF_BOLD)
    tech = ["Python", "TypeScript", "React", "Next.js", "Tailwind CSS", "Supabase", "AWS", "Docker", "GitHub Actions", "Terraform", "PostgreSQL", "OpenAI"]
    colors = [(255, 209, 102), (98, 168, 255), (103, 232, 249), (229, 231, 235), (56, 189, 248), (52, 211, 153), (245, 158, 11), (96, 165, 250), (139, 92, 246), (167, 139, 250), (147, 197, 253), (209, 213, 219)]
    for i, item in enumerate(tech):
        x = 506 if i < 6 else 692
        y = 423 + (i % 6) * 34
        draw.ellipse((x, y, x + 13, y + 13), fill=colors[i])
        text(draw, (x + 28, y - 2), item, size=14, face=SANS_BOLD)

    # Character stats
    text(draw, (902, 386), "CHARACTER STATS", fill=GOLD, size=20, face=SERIF_BOLD)
    radar_overlay, labels = draw_radar(draw, 1063, 475, 72)
    overlay.alpha_composite(radar_overlay)
    for label, x, y in labels:
        text(draw, (1063 + x, 475 + y), label, size=12, anchor="ma" if x == 0 else None)
    for x, color, label, level in [
        (884, (14, 165, 233), "API", 5),
        (947, (16, 185, 129), "UX", 4),
        (1010, (245, 158, 11), "Ship", 4),
        (1073, (139, 92, 246), "AI", 5),
        (1136, (37, 99, 235), "Cloud", 4),
        (1199, (239, 68, 68), "Ops", 4),
    ]:
        draw_skill_gem(draw, x, 568, color, label, level)

    # Featured projects
    text(draw, (66, 706), "FEATURED PROJECTS", fill=GOLD, size=20, face=SERIF_BOLD)
    project_specs = [
        (96, 760, repos["accountant"], "Accountant", "$", ["Next.js", "TypeScript", "Supabase", "Plaid"]),
        (678, 760, repos["Pomotree"], "Pomotree", "P", ["Tauri", "TypeScript", "Dexie", "React"]),
    ]
    for x, y, repo, title, icon, tags in project_specs:
        text(draw, (x, y), icon, fill=(255, 255, 255), size=28, face=SERIF_BOLD, anchor="mm")
        text(draw, (x + 60, y - 20), title, fill=GOLD, size=28, face=SERIF_BOLD, stroke=True)
        desc = FALLBACK_REPOS["accountant" if title == "Accountant" else "Pomotree"]["description"]
        text(draw, (x - 28, y + 38), fit_text(draw, desc, 500, 13, SANS_BOLD), size=13, face=SANS_BOLD, stroke=True)
        cursor = x - 28
        for tag in tags:
            cursor += rounded_label(draw, cursor, y + 70, tag, width=74 if len(tag) < 9 else 92) + 8
        text(draw, (x - 28, y + 96), repo.get("html_url"), fill=MUTED, size=10, stroke=True)
        text(draw, (x + 475, y - 26), f"Star {repo.get('stargazers_count', 0)}", fill=GOLD, size=12, face=SANS_BOLD, anchor="mm")

    # Bottom
    text(draw, (66, 924), "ACHIEVEMENTS", fill=GOLD, size=20, face=SERIF_BOLD)
    for y, line in [(966, "Maintained steady building cadence"), (1008, "Contributed to open-source projects"), (1050, "Built finance and productivity tools"), (1088, "Always learning, always building")]:
        text(draw, (96, y), line, size=12)

    text(draw, (390, 924), "GITHUB STATS", fill=GOLD, size=20, face=SERIF_BOLD)
    total_stars = sum(int(repos[k].get("stargazers_count") or 0) for k in repos)
    stats = [("Repositories", user.get("public_repos", 9)), ("Stars", total_stars), ("Followers", user.get("followers", 2)), ("Following", user.get("following", 3))]
    for i, (label, value) in enumerate(stats):
        y = 966 + i * 31
        text(draw, (432, y), label, fill=GOLD, size=13, face=SANS_BOLD)
        text(draw, (550, y), str(value), size=13, face=SANS_BOLD)
    for row in range(7):
        for col in range(13):
            colors_grid = [(31, 42, 30), (49, 92, 47), (75, 138, 63), (123, 184, 92), (184, 215, 119)]
            color = colors_grid[(row * 5 + col * 7) % len(colors_grid)]
            draw.rounded_rectangle((612 + col * 15, 956 + row * 15, 623 + col * 15, 967 + row * 15), radius=2, fill=color)
    text(draw, (610, 936), "Contribution Map", fill=(76, 54, 35), size=12, face=SANS_BOLD)
    text(draw, (610, 1072), "Less", fill=(76, 54, 35), size=10)
    text(draw, (780, 1072), "More", fill=(76, 54, 35), size=10)

    text(draw, (944, 924), "GITHUB TROPHIES", fill=GOLD, size=20, face=SERIF_BOLD)
    trophy_colors = [(245, 158, 11), (56, 189, 248), (239, 68, 68), (139, 92, 246), (96, 165, 250), (148, 163, 184), (14, 165, 233)]
    for i, color in enumerate(trophy_colors):
        x = 994 + (i % 4) * 78 if i < 4 else 1033 + ((i - 4) % 3) * 78
        y = 954 if i < 4 else 1034
        draw.polygon([(x, y), (x + 19, y + 11), (x + 19, y + 33), (x, y + 44), (x - 19, y + 33), (x - 19, y + 11)], fill=color)
        draw.polygon([(x, y + 7), (x + 11, y + 14), (x + 11, y + 30), (x, y + 37), (x - 11, y + 30), (x - 11, y + 14)], fill=(255, 255, 255, 55))
    text(draw, (1084, 1100), "View trophies ->", size=13, anchor="ma")

    # Footer
    text(draw, (653, 1138), "The best way to predict the future is to build it.", fill=(232, 213, 255), size=24, face=SERIF, anchor="ma", stroke=True)
    text(draw, (330, 1176), "Seattle, WA", fill=GOLD, size=12, face=SANS_BOLD, anchor="ma")
    text(draw, (610, 1176), "@AWS", fill=GOLD, size=12, face=SANS_BOLD, anchor="ma")
    text(draw, (892, 1176), "Let's build something amazing together.", fill=GOLD, size=12, face=SANS_BOLD, anchor="ma")

    img.alpha_composite(overlay)
    img.convert("RGB").save(ASSETS / "profile-rpg.png", quality=95, optimize=True)
    print("Rendered assets/profile-rpg.png")


if __name__ == "__main__":
    main()
