# Geometric and Perceptual System for Text-Based Interfaces

## 1. Core principle

An interface should not first be “beautiful.” It should first be visible, readable, understandable, organized, predictable, and only then aesthetically specific.

Design in layers: **human vision → accessibility → information structure → geometry → personal taste**. Personal taste must not override the lower layers.

## 2. How humans see

People do not perceive a UI as separate pixels: the visual system groups elements and looks for an overall organization. The relevant grouping principles are proximity, similarity, connectedness, common direction, good continuation, closure, symmetry, and figure–ground separation.

Practical implications:

- Elements in the same group are closer to one another than to other groups.
- Spacing within a component is smaller than spacing between components.
- A heading sits closer to the text it describes than to the preceding section.
- Related controls share shape, size, or alignment.
- Use dividers and borders only where spacing alone cannot make structure clear.

Grouping by proximity is generally cleaner than grouping through many borders and surfaces.

## 3. Attention hierarchy

Each screen must answer: where do I look first, what belongs to it, and what comes next? It has one dominant visual center, determined by the combined effect of size, contrast, whitespace, position, and semantic importance. Never give more than one element maximum visual priority: if everything is strong, nothing is strong.

## 4. Geometric coordinate system

Use a consistent base unit of **4 pt / 4 CSS px**. Primary values derive from this scale: 4, 8, 12, 16, 24, 32, 48, 64, and 96.

For small interfaces:

- 4: microscopic spacing
- 8: related elements
- 12: compact-component internal spacing
- 16: standard internal spacing
- 24: spacing between subgroups
- 32: spacing between components
- 48–64: spacing between sections
- 96–128: major structural pause

If the internal spacing is `x`, the next group is generally at least `1.5x–2x` away. Example: 12 from heading to body; 32 from body to next section.

## 5. Proportional families

Use a limited family of ratios, not one universal formula.

- **1:1** — icons, square images, avatars, compact buttons, neutral modules.
- **2:1** — primary/secondary zones, text with supplementary information, wide cards.
- **3:1** — dominant content with a narrow panel; title with metadata; primary function with secondary controls.
- **3:2 and 4:3** — text sections, images, dialogs, editorial compositions.
- **16:9** — video and media containers, not a universal UI ratio.

## 6. Golden ratio

`φ ≈ 1.618` can generate variants for column widths, large/small type, structural zones, visual accents, and rectangular containers. It is not a universal law of beauty and is not necessarily superior to 3:2, 4:3, or 2:1. Generate several proportional variants and evaluate them through perception and real use.

## 7. Columns and text measure

### Mobile

Use one column. Horizontal margins: 16 pt minimum, 20–24 pt standard, or 28–32 pt for a calm editorial layout when width permits. Content never physically touches the screen edge.

### Tablet and desktop

On tablets use one wide column, a 2:1 two-column layout, or main content with navigation. On desktop use 12 columns for complex systems or 6/8 for simpler sites, with consistent outer margins and gutters. The column system is a coordinate framework, not decoration.

For sustained reading, target about **45–75 characters per line**; 60–70 is a practical midpoint. Do not stretch text only to occupy available width.

## 8. Typographic system

Use limited roles: display, page title, section title, body, supporting text, label, and caption. Do not create arbitrary sizes per screen.

Suggested scale: 12 caption; 14 secondary label; 16 standard UI text; 18 emphasized text/small heading; 20–24 section heading; 28–32 page heading; 40–48 large heading; 56–72 display heading.

Use modular steps of 1.125, 1.2, 1.25, or 1.333. The golden ratio is usually too large for a whole type scale; reserve it for distant levels such as body and hero text.

Line-height guidance: headings 1.05–1.2; display text 0.95–1.1; body 1.4–1.6; small text 1.4–1.7. The interface must survive WCAG text-spacing adjustments: 1.5× line height, 2× paragraph spacing, 0.12× letter spacing, and 0.16× word spacing.

## 9. Contrast and color

Minimum WCAG 2.2 contrast: 4.5:1 for standard text, 3:1 for large text and important non-text states; aim for 7:1 for enhanced standard-text readability. Primary text has high contrast; secondary text remains readable; functional borders remain visible; focus/selection changes have at least 3:1 contrast. Never rely on color alone to convey meaning.

Define functional color roles before selecting hues: background, elevated background, primary/secondary text, separator, accent, success, warning, destructive, and focus. Use adaptive colors where appropriate. A safe starting distribution is 80–90% neutral foundation, 8–15% primary color, and 2–5% strong accent. Complementary colors must not compete at equal visual weight.

## 10. Visual weight, balance, and whitespace

Visual weight is influenced by area, brightness, contrast, saturation, thickness, complexity, position, and surrounding whitespace. A working model is:

`visual weight ≈ area × contrast × saturation × semantic importance`

The visual center of gravity must be intentional. Asymmetry is valid when size, contrast, distance, whitespace, and position create counterbalance. Use symmetry for stability, clarity, and formality; use asymmetry for movement, direction, and hierarchy; never use either mechanically.

Whitespace separates groups, directs attention, increases importance, and creates rhythm. More important elements generally receive more breathing room, fewer competitors, and a clearer position. Do not add whitespace that breaks logical content relationships.

## 11. Vertical rhythm and optical geometry

Align elements to a shared 4- or 8-point vertical rhythm: e.g. one text line 24, two lines 48, paragraph gap 24, section gap 48, button height 48.

Start with mathematical geometry, then make optical corrections. Circles, letters, different typefaces, dark elements, and bounding-box centering do not always appear equal. Adjust by 1–4 pt where the eye requires it.

## 12. Components and interaction

Interactive targets on mobile are at least 44 × 44 pt/CSS px. Typical minimums: mobile buttons 44–48 pt high, primary buttons 48–56 pt, compact desktop controls 32–40 px. An icon may be 16–24 px, but its hit area must be larger; adjacent targets need enough separation to prevent accidental activation.

## 13. Adaptivity

Do not merely shrink one fixed composition. Maintain clarity across compact, regular, and wide modes. At different widths, reconsider columns, outer margins, navigation position, heading size, secondary-information visibility, and element order.

## 14. Constrained interface generation

The user sets the font, primary and neutral palette, content, platform, primary function, density, and formality. The design system enforces minimum contrast, readable type, limited text width, target sizes, base spacing, logical grouping, limited typographic roles, adaptivity, clear focus, and no reliance on color alone.

Generate variants from 1:1, 4:3, 3:2, 1.618:1, 2:1, and 3:1, with different centers of gravity, symmetry, columns, density, rhythm, and whitespace. Personal taste only selects among already valid solutions.

## 15. Evaluation

Evaluate readability, contrast, hierarchy, grouping, balance, proportional consistency, rhythm, adaptivity, accessibility, and personal aesthetic compatibility.

`S = H × A × U × G × P`

Where `H` is hierarchical clarity, `A` accessibility, `U` usability, `G` geometric integrity, and `P` personal preference. Multiplication is intentional: a very low score in one essential category reduces the whole result.

## 16. Core constitution

1. Content takes priority over decoration.
2. Readability takes priority over style.
3. Grouping follows meaning.
4. Hierarchy is visible without explanation.
5. Dimensions belong to a limited scale.
6. Spacing communicates relationships.
7. Every screen has one dominant focus.
8. Contrast is measured.
9. Color is not the only carrier of meaning.
10. Geometry begins mathematically and ends optically.
11. The golden ratio is an option, not a law.
12. Symmetry is a tool, not a goal.
13. Whitespace is a structural element.
14. The interface adapts rather than simply shrinking.
15. Personal taste selects among functionally and perceptually valid solutions.

## 17. Conclusion

For text-based websites and applications, once font, color, content, components, accessibility constraints, spacing scale, and proportional families are set, design becomes an optimization problem: arrangement, proportions, rhythm, density, emphasis, and balance.
