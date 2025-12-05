# Base File Highlight

<p align="center">
  <img src="images/icon.svg" alt="Base File Highlight icon" width="160" />
</p>

A VSCode extension that highlights files with no local dependencies (installed packages only).

## Features

- **Automatic Detection**: Identifies files that only import external packages/libraries
- **Configurable Highlighting**: Customize the highlight color (default: mint green `#98FF98`)
- **Symbol Mode**: Option to use a symbol indicator instead of color to avoid conflicts with compiler errors
- **Multi-Language Support**: Works with Python, JavaScript, TypeScript, JSX, and TSX files
- **Real-time Updates**: Automatically updates when files are created, modified, or deleted

## How It Works

The extension analyzes import statements in your files:

### Python Example
```python
# base_file.py - Only external packages → Highlighted
import numpy
import pandas
import ast
import json

# regular_file.py - Has local imports → Not highlighted  
import numpy
from my_local_module import something
```

### JavaScript/TypeScript Example
```javascript
// base_file.js - Only external packages → Highlighted
import React from 'react';
import axios from 'axios';

// regular_file.js - Has local imports → Not highlighted
import React from 'react';
import { MyComponent } from './components/MyComponent';
```

## Configuration

Access settings via `File > Preferences > Settings` and search for "Base File Highlight":

- **`baseFileHighlight.enabled`** (default: `true`)
  - Enable or disable the extension

- **`baseFileHighlight.highlightColor`** (default: `#98FF98`)
  - Color for highlighting base files
  - Supports hex color codes like `#98FF98` (mint green), `#FFD700` (gold), or `#4FC3F7` (light blue)
  - Can also use VSCode theme color IDs like `charts.green`, `charts.blue`, or `charts.yellow`
  - Hex colors are fully supported in VSCode file decorations

- **`baseFileHighlight.useSymbol`** (default: `false`)
  - Use a symbol indicator (●) instead of text color
  - Useful to avoid conflicts with red text from compiler errors

- **`baseFileHighlight.symbolColor`** (default: `#98FF98`)
  - Color for the symbol when `useSymbol` is enabled
  - Supports both hex color codes and VSCode theme color IDs
  - Same format as `highlightColor`

- **`baseFileHighlight.fileExtensions`** (default: `[".py", ".js", ".ts", ".jsx", ".tsx"]`)
  - File extensions to analyze for dependencies

## Installation

### From VSIX (Local Installation)
1. Download the `.vsix` file
2. Open VSCode
3. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
4. Click the "..." menu at the top of the Extensions view
5. Select "Install from VSIX..."
6. Choose the downloaded `.vsix` file

### From Source
1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to open a new VSCode window with the extension loaded

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm (v10 or higher)

### Build
```bash
npm install
npm run compile
```

### Lint
```bash
npm run lint
```

### Watch Mode
```bash
npm run watch
```

### Testing
```bash
# Run unit tests
npm test

# Compile and lint before testing
npm run pretest
```

The test suite includes:
- Extension activation tests
- Configuration validation tests
- Import detection tests for Python and JavaScript/TypeScript files
- Hex color support verification

## License

See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Troubleshooting

**Q: The highlighting doesn't appear immediately**
- A: The extension analyzes files on startup. For large projects, this may take a few seconds. Try reopening the folder or reloading the window.

**Q: Some files are incorrectly highlighted**
- A: The import detection uses pattern matching. Complex import patterns may not be detected correctly. Please open an issue with examples.

**Q: Can I use this with other languages?**
- A: Currently supports Python and JavaScript/TypeScript. You can add more file extensions in settings, but import detection logic may need updates.

