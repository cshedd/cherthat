# CherThat Chrome Extension

Chrome extension that lets users save images from any webpage to their CherThat moodboard.

## Setup Instructions

### 1. Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle switch in the top right corner)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The extension should now appear in your extensions list

### 2. Add Icons (Required)

The extension requires icon files. You have a few options:

**Option A: Create Simple Placeholder Icons**
- Create three PNG files: `icon16.png`, `icon48.png`, `icon128.png`
- Sizes: 16x16, 48x48, and 128x128 pixels respectively
- Use a simple design (e.g., 🪄 emoji on colored background or "CT" text)
- Place them in the `extension/icons/` folder

**Option B: Use Online Icon Generator**
- Visit https://www.favicon-generator.org/ or similar
- Generate icons from text/emoji
- Download and place in `extension/icons/` folder

**Note:** Without icons, the extension will still work but may show errors in the console.

### 3. Configure Backend URL (Optional for Testing)

Edit `background.js` and update the `BACKEND_URL` constant:
```javascript
const BACKEND_URL = 'https://your-api.vercel.app/api/images';
```

If the backend isn't configured yet, the extension will automatically fall back to local storage (Chrome's `chrome.storage.local`).

## How It Works

1. **Hover Detection**: When you hover over an image (larger than 50x50px), a "cher that" button appears in the bottom-right corner
2. **Save Action**: Click the button to save the image
3. **Backend Call**: The extension sends the image URL, source page URL, and timestamp to your backend API
4. **Fallback**: If the backend is unavailable, images are saved locally in Chrome storage for testing

## Testing Without Backend

The extension automatically stores images locally if the backend isn't available. To inspect saved images:

1. Go to `chrome://extensions/`
2. Find CherThat extension
3. Click "Inspect views: service worker" (under the extension details)
4. In the console, run:
   ```javascript
   chrome.storage.local.get(['savedImages'], (result) => {
     console.log('Saved images:', result.savedImages);
   });
   ```

## File Structure

```
extension/
├── manifest.json      # Extension configuration
├── content.js         # Script injected into web pages (handles hover/click)
├── background.js      # Service worker (handles API calls)
├── styles.css         # Button styling
├── icons/             # Extension icons (16x16, 48x48, 128x128)
└── README.md          # This file
```

## Troubleshooting

- **Button not appearing**: Make sure images are at least 50x50px. Check browser console for errors.
- **Save not working**: Check the service worker console (`chrome://extensions/` → Inspect views) for errors
- **CORS errors**: Make sure your backend API has proper CORS headers configured
- **Extension not loading**: Ensure all required files are present and `manifest.json` is valid JSON

## Next Steps

See `TESTING.md` in the project root for comprehensive testing guidelines.

