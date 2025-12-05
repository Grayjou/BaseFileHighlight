# Example Files

This directory contains example files to demonstrate how the Base File Highlight extension works.

## Expected Behavior

### Files that SHOULD be highlighted (mint green by default):
- `python/base_file.py` - Only imports external packages (numpy, pandas, ast, json, sys, datetime)
- `javascript/base_file.jsx` - Only imports external packages (react, axios)
- `javascript/base_file_commonjs.js` - Only requires built-in Node.js modules (express, path, fs)

### Files that SHOULD NOT be highlighted (default color):
- `python/dependent_file.py` - Imports from local module `base_file`
- `python/relative_import_file.py` - Uses relative import `.base_file`
- `javascript/dependent_file.jsx` - Imports from local file `./base_file`
- `javascript/dependent_file_commonjs.js` - Requires local file `./base_file_commonjs`

## Testing the Extension

1. Open this repository in VSCode with the extension installed
2. Look at the file explorer on the left
3. Files listed as "should be highlighted" above should appear in mint green (or the configured color)
4. Files listed as "should not be highlighted" should appear in the default color

## Configuration Options

You can customize the behavior in VSCode settings:

```json
{
  "baseFileHighlight.enabled": true,
  "baseFileHighlight.highlightColor": "charts.green",
  "baseFileHighlight.useSymbol": false,
  "baseFileHighlight.symbolColor": "charts.green",
  "baseFileHighlight.fileExtensions": [".py", ".js", ".ts", ".jsx", ".tsx"]
}
```

### Symbol Mode

If you enable symbol mode, highlighted files will show a colored dot (●) instead of changing the text color:

```json
{
  "baseFileHighlight.useSymbol": true,
  "baseFileHighlight.symbolColor": "charts.green"
}
```

This is useful if you want to avoid conflicts with red text colors from compiler errors.
