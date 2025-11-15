# CherThat Web App

Next.js application for the CherThat moodboard with in-memory storage for local prototyping.

## Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

The API routes are available at `/api/images`:

### POST /api/images
Save a new image to the moodboard.

**Request Body:**
```json
{
  "image_url": "https://example.com/image.jpg",
  "source_url": "https://example.com/page",
  "created_at": "2025-10-31T14:02:12Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "img_1234567890_abc123",
    "image_url": "https://example.com/image.jpg",
    "source_url": "https://example.com/page",
    "created_at": "2025-10-31T14:02:12Z"
  }
}
```

### GET /api/images
Fetch all saved images (newest first).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "img_1234567890_abc123",
      "image_url": "https://example.com/image.jpg",
      "source_url": "https://example.com/page",
      "created_at": "2025-10-31T14:02:12Z"
    }
  ]
}
```

### DELETE /api/images?id={id}
Delete an image by ID.

**Response:**
```json
{
  "success": true,
  "message": "Image deleted"
}
```

## In-Memory Storage

**Important:** This prototype uses in-memory storage. All images are stored in a JavaScript array that:
- Persists during the development server session
- **Resets when the server restarts**
- Is not shared across multiple server instances

This is suitable for local testing and prototyping. For production, migrate to Supabase or another persistent database.

## CORS Configuration

The API routes are configured to accept requests from the Chrome extension. CORS headers are set to allow:
- Origin: `*` (for local development)
- Methods: `GET, POST, DELETE, OPTIONS`
- Headers: `Content-Type`

## Extension Integration

The Chrome extension is configured to send requests to `http://localhost:3000/api/images` when the Next.js dev server is running.

To use with production:
1. Deploy to Vercel
2. Update `extension/background.js` with the production URL
3. Update CORS configuration in `next.config.js` if needed

## Development

### Project Structure
```
web/
├── app/
│   ├── api/
│   │   └── images/
│   │       └── route.js    # API endpoint handlers
│   ├── page.js             # Moodboard frontend
│   └── layout.js           # Root layout with fonts
├── styles/
│   └── globals.css         # Global styles
├── package.json
└── next.config.js
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Migration to Supabase

To migrate from in-memory storage to Supabase:

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create `.env.local` with Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Replace the in-memory array in `app/api/images/route.js` with Supabase client calls

4. The API interface remains the same, so no changes needed in the extension or frontend

## Troubleshooting

**Images not appearing after saving:**
- Check that the Next.js dev server is running on port 3000
- Verify the extension is pointing to `http://localhost:3000/api/images`
- Check browser console and server logs for errors

**CORS errors:**
- Ensure `next.config.js` has CORS headers configured
- Verify the extension is making requests to the correct URL

**Images reset after restart:**
- This is expected behavior with in-memory storage
- Images persist only during the active server session
- Consider migrating to Supabase for persistent storage

