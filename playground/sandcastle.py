"""A tiny, consequence-free sandcastle generator.

Standard library only. No network. No empire-building.
"""

from __future__ import annotations


def build_sandcastle(towers: int = 3, moat: bool = True) -> str:
    """Return a small ASCII sandcastle."""
    towers = max(1, min(towers, 7))

    crown = "  /\\  " * towers
    roofs = " /__\\ " * towers
    walls = " |  | " * towers
    gate_width = towers * 6
    gate = "|" + " " * (gate_width // 2 - 2) + "/\\" + " " * (gate_width // 2 - 2) + "|"
    base = "=" * gate_width

    lines = [crown.rstrip(), roofs.rstrip(), walls.rstrip(), gate, base]

    if moat:
        lines.append("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~")

    lines.append("The tide is somebody else's problem.")
    return "\n".join(lines)


if __name__ == "__main__":
    print(build_sandcastle())
