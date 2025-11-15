# 🪄 CherThat

**CherThat** is a Chrome extension and web app that lets you instantly save and organize inspiration images from anywhere on the web into a beautiful, shareable moodboard — without downloads, uploads, or clutter.

## ✨ Features

- **One-Click Save**: Hover over any image on the web and click "cher that" to save it instantly
- **Beautiful Moodboard**: View all your saved images in a clean, responsive grid layout
- **Instant Access**: Images appear on your moodboard within seconds
- **Easy Deletion**: Remove images with a simple click
- **Offline Support**: Extension works offline and saves locally when backend is unavailable
- **Privacy-Focused**: Stores only image URLs and metadata — no image data is copied or stored

## 🏗️ Architecture

CherThat consists of two main components:

1. **Chrome Extension** (`extension/`): Injects a "cher that" button on images across the web
2. **Web App** (`web/`): Next.js application that displays your saved images in a moodboard

### How It Works

1. **Install Extension** → Add the Chrome extension to your browser
2. **Browse the Web** → Visit any webpage with images
3. **Hover & Save** → Hover over an image to see the "cher that" button, then click to save
4. **View Moodboard** → Open the web app to see all your saved images in a beautiful grid
5. **Manage** → Delete images or share your moodboard (coming soon)

## 🚀 Getting Started

### Prerequisites

- Chrome browser (version 90+)
- Node.js 18+ (for running the web app)
- npm or yarn

### Installation

#### 1. Install the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top right)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from this project
5. The extension should now appear in your extensions list

**Note**: The extension requires icon files. See `extension/README.md` for details on adding icons.

#### 2. Set Up the Web App

```bash
# Navigate to the web directory
cd web

# Install dependencies
npm install

# Run the development server
npm run dev
```

The web app will be available at `http://localhost:3000`

#### 3. Configure Backend URL (Optional)

If you're running the web app locally, the extension is already configured to use `http://localhost:3000/api/images`. 

For production, edit `extension/background.js` and update the `BACKEND_URL`:

```javascript
const BACKEND_URL = 'https://your-app.vercel.app/api/images';
```

**Note**: If the backend isn't configured, the extension will automatically fall back to local storage for testing.

## 📖 Usage

### Saving Images

1. Visit any website with images (e.g., Unsplash, Pinterest, blogs)
2. Hover over an image (must be larger than 50x50px)
3. A dark brown "cher that" button will appear in the bottom-right corner
4. Click the button to save the image
5. The button will show "Saving..." then "✓ Saved!" when complete

### Viewing Your Moodboard

1. Open the web app at `http://localhost:3000` (or your deployed URL)
2. All saved images will appear in a responsive grid (3 images per row)
3. Hover over an image to see the delete button (×) in the top-right corner
4. Click the × button to remove an image from your moodboard

### Testing Without Backend

The extension automatically stores images locally if the backend is unavailable. To inspect saved images:

1. Go to `chrome://extensions/`
2. Find CherThat extension
3. Click **"Inspect views: service worker"**
4. In the console, run:
   ```javascript
   chrome.storage.local.get(['savedImages'], (result) => {
     console.log('Saved images:', result.savedImages);
   });
   ```

## 🛠️ Development

### Project Structure

```
cherthat/
├── extension/              # Chrome extension
│   ├── manifest.json       # Extension configuration
│   ├── content.js         # Injected script (handles hover/click)
│   ├── background.js      # Service worker (handles API calls)
│   ├── styles.css         # Button styling
│   └── icons/             # Extension icons
├── web/                   # Next.js web application
│   ├── app/
│   │   ├── page.js        # Main moodboard page
│   │   ├── layout.js      # App layout
│   │   └── api/
│   │       └── images/
│   │           └── route.js  # API endpoints (GET, POST, DELETE)
│   ├── styles/
│   │   └── globals.css    # Global styles
│   └── package.json
├── prd.md                 # Product Requirements Document
├── TESTING.md            # Comprehensive testing guide
└── README.md             # This file
```

### Tech Stack

- **Extension**: Vanilla JavaScript (Manifest V3)
- **Web App**: Next.js 14, React 18
- **API**: Next.js API Routes
- **Storage**: In-memory (MVP) - can be replaced with Supabase, Airtable, or any database
- **Hosting**: Vercel (recommended for web app)

### API Endpoints

The web app provides the following API endpoints:

- `GET /api/images` - Fetch all saved images
- `POST /api/images` - Save a new image
  ```json
  {
    "image_url": "https://example.com/image.jpg",
    "source_url": "https://example.com",
    "created_at": "2025-10-31T14:02:12Z"
  }
  ```
- `DELETE /api/images?id=<image_id>` - Delete an image

### Running in Development

```bash
# Terminal 1: Run the web app
cd web
npm run dev

# Terminal 2: Test the extension
# Load extension in Chrome (see Installation section)
# Visit any website and hover over images
```

### Building for Production

```bash
# Build the web app
cd web
npm run build
npm start

# Deploy to Vercel
vercel
```

## 🎨 Design

CherThat follows a minimal, clean aesthetic inspired by Are.na and Notion:

- **Color Palette**: Soft neutrals (light beige/gray tones)
- **Typography**: Montserrat Bold for headers and buttons, Inter/Poppins for body text
- **Layout**: Responsive grid with 3 images per row
- **Interactions**: Smooth hover states and subtle animations

### Design Specifications

- **Header**: Dark brown banner with "Cher That" in large white, bold text
- **Subtitle**: Light beige field with "Everything you've Cher'd."
- **Button**: Dark brown button with rounded corners, white "cher that" text
- **Images**: Rounded corners, light beige background, delete button (×) on hover

## 🧪 Testing

See `TESTING.md` for comprehensive testing procedures, edge cases, and debugging guides.

Quick test checklist:
- [ ] Extension loads without errors
- [ ] Button appears on image hover
- [ ] Images save successfully (check console)
- [ ] Moodboard displays saved images
- [ ] Delete functionality works
- [ ] Works on different websites

## 🚧 Current Limitations

- **In-Memory Storage**: Images are stored in memory and reset on server restart (MVP)
- **No Authentication**: All images are public (future: user accounts)
- **No Sharing**: Public shareable links not yet implemented
- **No Organization**: No tags or multiple boards (future feature)
- **Localhost Blocking**: Extension is disabled on localhost pages to prevent conflicts

## 🔮 Future Features

- [ ] Persistent database (Supabase/Airtable integration)
- [ ] User authentication and private boards
- [ ] Public shareable links
- [ ] Tagging and organization
- [ ] Multiple boards per user
- [ ] AI-powered image clustering
- [ ] Offline mode with local caching
- [ ] Collaborative boards

## 📝 Notes

- The extension currently uses local storage as a fallback when backend is unavailable
- All saved images include timestamp, source URL, and image URL
- Extension works offline (saves locally)
- Images are referenced by URL only — no image data is stored
- The extension is disabled on localhost pages to prevent conflicts with the moodboard

## 🤝 Contributing

This is currently a personal project, but suggestions and feedback are welcome!

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Inspired by Are.na and Notion's clean aesthetic
- Built with Next.js and Chrome Extension APIs

---

**Made with ✨ for creators, designers, and anyone who loves collecting inspiration**

