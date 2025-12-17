# ChromaGen AI

ChromaGen AI is an intelligent color palette generator that creates harmonious, accessible, and thematic color schemes based on user descriptions. 

Originally designed to use LLMs, this version uses a sophisticated local keyword analysis engine to generate palettes instantly without requiring external API keys, making it safe and easy to deploy anywhere.

## Features

- **Natural Language Input**: Type descriptions like "Cyberpunk Neon", "Forest Rain", or "Vintage Coffee" to generate matching palettes.
- **Harmonious Algorithms**: Uses color theory principles (analogous, complementary, split-complementary) to ensure generated colors look good together.
- **Contrast Checking**: Built-in accessibility preview to see how colors work for text and UI elements.
- **History Tracking**: Automatically saves your generated palettes locally so you don't lose them.
- **Export Options**: Download your palettes as JSON for use in design tools or development.
- **Modern UI**: Built with a dark-mode first, glassmorphism-inspired design.

## Tech Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Logic**: Custom color manipulation algorithms (HSL/RGB conversion, harmony generation)

## How It Works

The engine analyzes your prompt for:
1.  **Color Keywords**: Detects specific hue references (e.g., "ruby", "ocean", "sage").
2.  **Mood/Vibe**: Detects modifiers like "pastel", "neon", or "dark" to adjust saturation and lightness.
3.  **Generation**: Constructs a 5-color palette using a base hue and calculating harmonious relationships relative to that base.

## Usage

1.  Enter a theme or mood in the search bar.
2.  Click "Generate".
3.  Click on any color card to copy its Hex, RGB, or HSL code.
4.  Use the "Export JSON" button to save the palette data.

## License

MIT
