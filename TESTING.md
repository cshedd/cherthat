# 🧪 Testing Guide for CherThat Chrome Extension

This document outlines the testing approach for the CherThat Chrome extension, covering manual testing procedures, edge cases, and test scenarios.

## Table of Contents
1. [Setup & Prerequisites](#setup--prerequisites)
2. [Manual Testing Procedures](#manual-testing-procedures)
3. [Test Scenarios](#test-scenarios)
4. [Edge Cases](#edge-cases)
5. [Backend Integration Testing](#backend-integration-testing)
6. [Browser Compatibility](#browser-compatibility)
7. [Debugging Tools](#debugging-tools)

---

## Setup & Prerequisites

### Initial Setup
1. **Load Extension in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/` folder

2. **Verify Extension Loaded**
   - ✅ Extension appears in extensions list
   - ✅ No errors in the extensions page
   - ✅ Extension shows "Enabled" status

3. **Open Developer Tools**
   - Right-click extension icon → "Inspect popup" (if applicable)
   - Go to `chrome://extensions/` → Find CherThat → "Inspect views: service worker"

### Test Data Sources
Use these websites for consistent testing:
- **Unsplash**: https://unsplash.com (high-quality images)
- **Pinterest**: https://pinterest.com (image-heavy content)
- **Shopify stores**: Various product pages
- **Blog posts**: Sites with embedded images
- **Local test page**: Create a simple HTML file with multiple images

---

## Manual Testing Procedures

### Test 1: Basic Hover Detection

**Objective**: Verify the "cher that" button appears when hovering over images.

**Steps**:
1. Navigate to https://unsplash.com
2. Hover over any image
3. Verify button appears in bottom-right corner of image
4. Verify button text says "cher that"
5. Verify button has dark brown background (#5a4a3a)
6. Verify button has white text (Montserrat Bold font)

**Expected Results**:
- ✅ Button appears within 100ms of hover
- ✅ Button is positioned correctly (bottom-right of image)
- ✅ Button styling matches PRD specifications
- ✅ Button disappears when mouse leaves image area

**How to Verify**:
- Visual inspection
- Check browser console for errors (F12)

---

### Test 2: Button Click & Save (Local Mode)

**Objective**: Test saving images when backend is not configured.

**Steps**:
1. Ensure `background.js` has `BACKEND_URL` pointing to non-existent endpoint
2. Navigate to a webpage with images
3. Hover over an image and click "cher that"
4. Observe button feedback (should show "Saving..." then "✓ Saved!")

**Expected Results**:
- ✅ Button shows "Saving..." state immediately
- ✅ Button changes to "✓ Saved!" with green background
- ✅ Button disappears after 1.5 seconds
- ✅ Image saved to `chrome.storage.local`

**How to Verify**:
1. Open service worker console (`chrome://extensions/` → Inspect views)
2. Run in console:
   ```javascript
   chrome.storage.local.get(['savedImages'], (result) => {
     console.log('Saved images:', result.savedImages);
   });
   ```
3. Verify image data includes:
   - `image_url`: Full URL of the image
   - `source_url`: URL of the webpage
   - `created_at`: ISO timestamp
   - `id`: Unique identifier

---

### Test 3: Button Positioning

**Objective**: Verify button appears correctly on images of various sizes and positions.

**Steps**:
1. Test on different image sizes:
   - Small images (< 50px) - button should NOT appear
   - Medium images (200-500px)
   - Large images (> 1000px)
   - Full-width images
2. Test on images in different positions:
   - Images at top of page
   - Images in scrollable areas
   - Images in iframes (may not work - known limitation)

**Expected Results**:
- ✅ Button only appears on images > 50x50px
- ✅ Button stays in bottom-right corner relative to image
- ✅ Button scrolls correctly with page
- ✅ Button doesn't overlap image content excessively

**How to Verify**:
- Visual inspection across different websites
- Test scrolling behavior

---

### Test 4: Multiple Images on Same Page

**Objective**: Ensure only one button appears at a time.

**Steps**:
1. Navigate to a page with multiple images (e.g., image gallery)
2. Quickly hover over multiple images
3. Verify only one button is visible at any time

**Expected Results**:
- ✅ Previous button disappears when hovering new image
- ✅ No multiple buttons stacking up
- ✅ No memory leaks or performance issues

**How to Verify**:
- Visual inspection
- Check browser performance (Task Manager)

---

### Test 5: Dynamically Loaded Images

**Objective**: Test with lazy-loaded or dynamically inserted images.

**Steps**:
1. Navigate to a page that uses lazy loading (e.g., Pinterest, Instagram)
2. Scroll to load more images
3. Hover over newly loaded images
4. Verify button appears correctly

**Expected Results**:
- ✅ Button works on images loaded after initial page load
- ✅ MutationObserver correctly detects new images

**How to Verify**:
- Visual inspection
- Check console for MutationObserver activity

---

## Test Scenarios

### Scenario A: Happy Path
1. User visits Unsplash.com
2. User hovers over a beautiful landscape photo
3. "cher that" button appears
4. User clicks button
5. Button shows "Saving..." then "✓ Saved!"
6. Image data saved successfully
7. User can continue browsing and save more images

**Success Criteria**: All steps complete without errors.

---

### Scenario B: Network Failure (Backend Unavailable)
1. Backend API is down or unreachable
2. User clicks "cher that" on an image
3. Extension falls back to local storage
4. Button still shows success state (saved locally)
5. User can inspect locally saved images

**Success Criteria**: 
- ✅ Graceful fallback to local storage
- ✅ User still sees positive feedback
- ✅ No error messages shown to user
- ✅ Data preserved for later sync

---

### Scenario C: Rapid Fire Saving
1. User hovers over multiple images quickly
2. Clicks "cher that" on each one
3. Each save operation completes independently

**Success Criteria**:
- ✅ All images save successfully
- ✅ No race conditions
- ✅ Button state updates correctly for each save
- ✅ No duplicate saves

---

### Scenario D: Image URL Edge Cases

Test these image URL scenarios:
- ✅ Standard `<img src="...">` tags
- ✅ Images with `data-src` (lazy loading)
- ✅ Images with `srcset` (responsive images)
- ✅ Background images (should NOT trigger - current limitation)
- ✅ SVG images
- ✅ GIF animations
- ✅ Images behind authentication (may fail to load)

**Success Criteria**: Extension handles each case appropriately or gracefully fails.

---

## Edge Cases

### Edge Case 1: Very Small Images
**Test**: Hover over icon-sized images (< 50px)
**Expected**: Button should NOT appear
**Why**: Icons and decorative elements shouldn't trigger save

### Edge Case 2: Broken Image URLs
**Test**: Hover over `<img>` tags with invalid `src` attributes
**Expected**: Button may appear, but save should handle gracefully
**Verification**: Check console for errors

### Edge Case 3: Same Page Navigation (SPA)
**Test**: Use extension on single-page app (React Router, etc.)
**Expected**: Extension should continue working after route changes
**Verification**: Save images on different routes

### Edge Case 4: Images in iframes
**Test**: Try to save images inside `<iframe>` elements
**Expected**: May not work (cross-origin restrictions)
**Status**: Known limitation

### Edge Case 5: Protected/CORS Images
**Test**: Save images from sites with strict CORS policies
**Expected**: May save URL but image may not display later
**Verification**: Check if image URL is accessible

### Edge Case 6: Mobile View
**Test**: Test on responsive sites in mobile view
**Expected**: Button should still appear correctly
**Note**: Chrome extensions work differently on mobile Chrome

---

## Backend Integration Testing

### Test 6: Backend Connection

**Prerequisites**: Backend API must be running

**Steps**:
1. Update `background.js` with correct `BACKEND_URL`
2. Ensure backend accepts POST requests to `/api/images`
3. Click "cher that" on an image
4. Verify network request in DevTools → Network tab

**Expected Results**:
- ✅ POST request sent to backend
- ✅ Request includes JSON body with `image_url`, `source_url`, `created_at`
- ✅ Backend returns 200 OK or 201 Created
- ✅ Response data logged in console

**How to Verify**:
1. Open DevTools → Network tab
2. Filter by "XHR" or "Fetch"
3. Click save button
4. Inspect POST request details
5. Check response status and body

---

### Test 7: Backend Error Handling

**Objective**: Test behavior when backend returns errors.

**Test Cases**:
1. **500 Server Error**: Backend crashes
   - Expected: Fallback to local storage
   - User sees success (local save)

2. **400 Bad Request**: Invalid data format
   - Expected: Save fails, button shows error
   - Check console for error details

3. **401 Unauthorized**: Auth required (future feature)
   - Expected: Handle gracefully

4. **Network Timeout**: Slow/no connection
   - Expected: Fallback to local storage after timeout

**How to Verify**:
- Use Chrome DevTools → Network → Throttling
- Mock backend responses using service worker
- Check console logs for error handling

---

## Browser Compatibility

### Chrome Version Testing

Test on these Chrome versions:
- ✅ Latest Chrome (Chromium-based)
- ⚠️ Chrome 90+ (Manifest V3 support)
- ⚠️ Edge Chromium (should work, needs testing)

**Known Issues**:
- Chrome mobile: Extensions work differently
- Older Chrome: Manifest V3 requires Chrome 88+

---

## Debugging Tools

### 1. Content Script Debugging
- **Where**: Regular page console (F12)
- **What to check**: 
  - Button injection errors
  - Hover detection issues
  - DOM manipulation problems

**Console Commands**:
```javascript
// Check if content script loaded
console.log('CherThat content script loaded');

// Manually trigger button (for testing)
document.querySelectorAll('img').forEach(img => {
  if (img.src) console.log('Found image:', img.src);
});
```

---

### 2. Service Worker Debugging
- **Where**: `chrome://extensions/` → Inspect views → Service worker
- **What to check**:
  - API calls
  - Local storage operations
  - Message passing errors

**Console Commands**:
```javascript
// Check saved images
chrome.storage.local.get(['savedImages'], (result) => {
  console.log('Total images:', result.savedImages?.length || 0);
  console.table(result.savedImages);
});

// Clear saved images (for testing)
chrome.storage.local.set({ savedImages: [] }, () => {
  console.log('Cleared all saved images');
});

// Get specific image
chrome.storage.local.get(['savedImages'], (result) => {
  const images = result.savedImages || [];
  const image = images.find(img => img.image_url.includes('unsplash'));
  console.log('Found image:', image);
});
```

---

### 3. Network Debugging
- **Where**: DevTools → Network tab
- **What to check**:
  - API requests/responses
  - CORS errors
  - Request payload format

**Filters to use**:
- Filter by "Fetch" or "XHR"
- Check "Preserve log" for SPA navigation

---

### 4. Performance Debugging
- **Where**: DevTools → Performance tab
- **What to check**:
  - Button rendering performance
  - Memory leaks
  - Event listener cleanup

---

## Test Checklist

Use this checklist for each testing session:

### Installation & Setup
- [ ] Extension loads without errors
- [ ] No console errors on extension page
- [ ] Icons display correctly (if added)

### Basic Functionality
- [ ] Button appears on image hover
- [ ] Button styling matches PRD
- [ ] Button disappears on mouse out
- [ ] Click saves image (local or backend)
- [ ] Success feedback displays correctly

### Edge Cases
- [ ] Small images (< 50px) don't show button
- [ ] Works with lazy-loaded images
- [ ] Works with multiple images on page
- [ ] Handles broken image URLs gracefully
- [ ] Works on different websites

### Backend Integration (when ready)
- [ ] API calls succeed
- [ ] Correct data format sent
- [ ] Error handling works
- [ ] Local fallback works when backend unavailable

### User Experience
- [ ] Button appears quickly (< 200ms)
- [ ] Button positioning is accurate
- [ ] No visual glitches
- [ ] Smooth animations/transitions

---

## Reporting Bugs

When reporting bugs, include:

1. **Steps to Reproduce**: Clear step-by-step instructions
2. **Expected Behavior**: What should happen
3. **Actual Behavior**: What actually happens
4. **Browser Version**: Chrome version number
5. **Extension Version**: From manifest.json
6. **Console Logs**: Any errors in content script or service worker console
7. **Network Logs**: If backend-related, include Network tab details
8. **Screenshots**: Visual issues
9. **Website URL**: Where the issue occurred

---

## Automated Testing (Future)

Consider adding:
- **Unit Tests**: Jest or Vitest for utility functions
- **Integration Tests**: Playwright or Puppeteer for end-to-end
- **E2E Tests**: Automate hover/click/save flow

---

## Testing Schedule

### Phase 1: Initial Testing (Week 1)
- Basic functionality tests
- Local storage testing
- UI/UX validation

### Phase 2: Integration Testing (Week 2)
- Backend integration
- Error handling
- Edge case testing

### Phase 3: User Acceptance Testing (Week 3)
- Beta user feedback
- Real-world scenario testing
- Performance testing

---

## Success Metrics

Track these metrics during testing:

- **Save Success Rate**: % of successful saves
- **Button Appearance Time**: Average time to show button on hover
- **Error Rate**: % of saves that fail
- **Local Fallback Usage**: % of saves that use local storage
- **User Satisfaction**: From beta user feedback

---

## Notes

- The extension currently uses local storage as a fallback when backend is unavailable
- All saved images include timestamp, source URL, and image URL
- Extension works offline (saves locally)
- Public sharing feature requires backend integration (future)

