# 🪄 Product Requirements Document (PRD)
**Product Name:** CherThat  
**Version:** v1.0 (MVP)  
**Owner:** [Your Name]  
**Date:** October 31, 2025

---

## 1. Overview

**Purpose**  
CherThat is a Chrome extension and web app that lets users instantly save and organize inspiration images from anywhere on the web into a beautiful, shareable moodboard — without downloads, uploads, or clutter.

**Vision**  
To make creative inspiration capture as effortless as taking a screenshot, but organized, accessible, and delightful to revisit or share.

**Primary Goal (MVP)**  
Let users click a button on any image → automatically save it → instantly view and share it on a personal web-hosted moodboard.

---

## 2. Target User

**Persona:**  
- Creators, designers, stylists, writers, or anyone collecting visual inspiration.  
- Non-technical users who appreciate aesthetic organization and speed.  
- People currently saving screenshots, bookmarking Pinterest links, or managing local folders.

**User Problem:**  
Current inspiration tools are:
- Too slow or cluttered  
- Hard to organize by theme or project  
- Not easily shareable or exportable  

**User Motivation:**  
“I want to save what inspires me — instantly and beautifully.”

---

## 3. User Goals & Success Metrics

| Goal | Success Metric |
|------|----------------|
| Save images quickly | User can save an image in ≤ 2 clicks |
| Review board instantly | Saved images appear on board within 2 seconds |
| Share inspiration | User can share a public link that others can open |
| Simple setup | Install + first save in under 2 minutes |
| Delight | 3+ friends say “that’s so cool” after trying it 😄 |

---

## 4. Core User Flow (MVP)

1. **Install Extension** → User adds Chrome extension.  
2. **Visit Any Webpage** → Hover or right-click on an image.  
3. **Click “Save to CherThat”** → Image URL is sent to backend.  
4. **Open CherThat Board** → Image appears instantly in a grid layout.  
5. **Delete or Share** → User can delete images or copy a public board link.

---

## 5. MVP Feature Set (Scope for 2–3 Weeks)

| Category | Feature | Description | Priority |
|-----------|----------|--------------|-----------|
| **Extension** | “Save to CherThat” button | Appears on image hover or via right-click. Sends image URL + metadata to backend. | 🟢 Must-have |
| **Backend** | Image URL capture endpoint | Accepts POST requests from extension; stores image URL, source page, and timestamp. | 🟢 Must-have |
| **Database** | Store image data | Simple table for image URLs + timestamps (Supabase or Airtable). | 🟢 Must-have |
| **Frontend** | Moodboard view | Displays saved images in a clean, responsive grid layout. | 🟢 Must-have |
| **Delete** | Remove image from board | Click “X” to delete image from moodboard and database. | 🟢 Must-have |
| **Share** | Public moodboard link | Generate a unique, shareable public URL (via Vercel) for a read-only board view. | 🟢 Must-have |
| **Auth** | Anonymous or email login | De-prioritized for MVP (no login needed initially). | 🔴 Future |
| **Tagging / Organization** | Add tags or multiple boards | Optional in later release. | 🔴 Future |

---

## 6. Technical Approach

| Component | Tool | Notes |
|------------|------|-------|
| **Extension** | JavaScript/HTML | Injects “Save” button on images, sends image URL to backend API. |
| **Hosting** | Vercel | Hosts the frontend web app and public shareable links. |
| **Backend** | Supabase (or Airtable + Make/Zapier) | Handles data storage, CRUD for image links. |
| **Database Schema** | `images` (id, image_url, source_url, created_at) | Simple structure for quick iteration. |
| **Privacy** | Store only image URLs, timestamps, and source URLs. No personal info collected. |

---

## 7. Design & UX

**Style:** Minimal, clean, and visually calming — inspired by Are.na and Notion.  
**Color Palette:** Soft neutrals (light beige/gray tones).  
**Interactions:**  
- Hover on image → "Save to CherThat" overlay button.  
- Moodboard: simple grid with image hover state showing a small delete icon.  
- Shareable board: read-only view with lightweight animation.  

**Moodboard Page Layout:**
- **Header:** Dark brown banner at the top with rounded corners, displaying "Cher That" in large white, bold text (Montserrat Bold).
- **Subtitle:** Light beige field with rounded corners directly below the header, containing the text "Everything you've Cher'd."
- **Background:** Light beige background for the entire moodboard page.
- **Image Grid:** Responsive grid layout with **3 images per row** and as many rows as needed based on the number of saved images. Each image square has rounded corners and displays on a light beige background. Each image has a small black "X" icon in the top-right corner to remove it from the board.

**Chrome Extension Button Design:**
- **Button Appearance:** Dark brown button with rounded corners, positioned in the bottom-right corner of each image on web pages.
- **Button Text:** "cher that" in white text (Montserrat Bold).
- **Interaction:** Button appears as an overlay when hovering over images on any webpage.

**Brand Elements:**  
- Logo: 🪄 or 📎 + "CherThat"  
- Font: Montserrat Bold for headers and "Save to CherThat" button on images. Inter or Poppins for body text (sans-serif, geometric, modern)  
- Tone: Creative, effortless, friendly  

---

## 8. Future Stretch Features (Phase 2+)

| Feature | Description |
|----------|-------------|
| **Tagging** | Add custom tags or color palettes. |
| **Multiple boards** | Organize moodboards by project or theme. |
| **AI clustering** | Group images visually or by concept. |
| **Offline mode** | Local caching of saved images. |
| **Collaborative boards** | Invite others to contribute to a shared board. |

---

## 9. Risks & Considerations

| Risk | Mitigation |
|------|-------------|
| Website permissions (CORS) | Use image URLs, not image binaries. |
| Copyright of images | Store only links, not copies of content. |
| Chrome store approval delay | Allow manual zip install for MVP testing. |
| Public link sharing abuse | Include “Report” button on public boards (future). |

---

## 10. Privacy & Legal Basics

- Store only user-selected image URLs and timestamps.  
- No scraping or automatic collection; user must click to save.  
- Include a one-screen privacy note:  
  “CherThat saves links to images you click — not the images themselves.”  
- Public boards are read-only and can be deleted anytime.  
- Data hosted in privacy-compliant regions (e.g., Supabase EU/US).  

---

## 11. Build Path & Timeline (Example 3-Week Sprint)

| Week | Focus | Output |
|------|--------|--------|
| **Week 1** | Build Chrome extension MVP | “Save to CherThat” button injects on images → sends URL to backend. |
| **Week 2** | Build moodboard view | Grid displays saved URLs, enables delete and public share link. |
| **Week 3** | Polish, test, and deploy | Public board pages on Vercel, bug fixes, simple landing page. |

---

## 12. MVP Success Criteria

✅ Users can install extension and save 5+ images in <2 minutes  
✅ Saved images appear instantly on board  
✅ Public shareable link works (friends can open it easily)  
✅ Delete button successfully removes images  
✅ At least 3 beta users report “it feels easy and satisfying”

---

## 13. Example Data in Airtable
| id        | image_url                                                                                                                                                    | source_url                                                                               | created_at           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | -------------------- |
| `img_001` | [https://images.unsplash.com/photo-1524230572899-e1e9ff0e4e2c](https://images.unsplash.com/photo-1524230572899-e1e9ff0e4e2c)                                 | [https://unsplash.com/photos/green-chair](https://unsplash.com/photos/green-chair)       | 2025-10-31T14:02:12Z |
| `img_002` | [https://i.pinimg.com/originals/ab/34/ce/ab34ce82a2a9.jpg](https://i.pinimg.com/originals/ab/34/ce/ab34ce82a2a9.jpg)                                         | [https://pinterest.com/pin/5941234567890123](https://pinterest.com/pin/5941234567890123) | 2025-10-31T14:08:55Z |
| `img_003` | [https://cdn.shopify.com/s/files/1/0259/4563/products/minimal-chair_1024x.jpg](https://cdn.shopify.com/s/files/1/0259/4563/products/minimal-chair_1024x.jpg) | [https://shopify.com/products/minimal-chair](https://shopify.com/products/minimal-chair) | 2025-10-31T14:10:43Z |
| `img_004` | [https://images.unsplash.com/photo-1616627455002-4fdf2e3427f8](https://images.unsplash.com/photo-1616627455002-4fdf2e3427f8)                                 | [https://unsplash.com/photos/desert-light](https://unsplash.com/photos/desert-light)     | 2025-10-31T15:12:07Z |
| `img_005` | [https://images.unsplash.com/photo-1500530855697-b586d89ba3ee](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee)                                 | [https://unsplash.com/photos/modern-kitchen](https://unsplash.com/photos/modern-kitchen) | 2025-10-31T15:15:50Z |


