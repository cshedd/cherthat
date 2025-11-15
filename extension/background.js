// Background service worker - handles API calls to backend
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_IMAGE') {
    saveImageToBackend(request.data)
      .then(response => {
        sendResponse({ success: true, data: response });
      })
      .catch(error => {
        console.error('Error saving image:', error);
        sendResponse({ success: false, error: error.message });
      });
    
    // Return true to indicate we'll send response asynchronously
    return true;
  }
});

async function saveImageToBackend(imageData) {
  // Backend URL - change this when deploying to production
  // For local development: http://localhost:3000/api/images
  // For production: https://your-app.vercel.app/api/images
  // Note: process.env is not available in Chrome extensions - set this directly
  const BACKEND_URL = 'http://localhost:3000/api/images';
  
  console.log('Saving image:', imageData);
  
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Image saved successfully:', result);
    return result;
  } catch (error) {
    // For MVP testing: store locally if backend isn't ready yet
    console.warn('Backend not available, storing locally:', error.message);
    
    // Store in chrome.storage as fallback (for testing)
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['savedImages'], (stored) => {
        if (chrome.runtime.lastError) {
          console.error('Error accessing storage:', chrome.runtime.lastError);
          reject(new Error('Failed to access local storage: ' + chrome.runtime.lastError.message));
          return;
        }
        
        try {
          const images = stored.savedImages || [];
          const newImage = {
            ...imageData,
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          };
          images.push(newImage);
          
          chrome.storage.local.set({ savedImages: images }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving to storage:', chrome.runtime.lastError);
              reject(new Error('Failed to save to local storage: ' + chrome.runtime.lastError.message));
              return;
            }
            
            console.log('Image saved locally. Total images:', images.length);
            resolve({ 
              success: true, 
              message: 'Saved locally (backend not configured)', 
              data: newImage,
              local: true
            });
          });
        } catch (storageError) {
          console.error('Error processing storage:', storageError);
          reject(new Error('Failed to process local storage: ' + storageError.message));
        }
      });
    });
  }
}

// Helper function to get locally stored images (for debugging)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_LOCAL_IMAGES') {
    chrome.storage.local.get(['savedImages'], (result) => {
      sendResponse({ images: result.savedImages || [] });
    });
    return true;
  }
  
  if (request.type === 'CLEAR_LOCAL_IMAGES') {
    chrome.storage.local.set({ savedImages: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

