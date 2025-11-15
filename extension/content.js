// Inject "Save to CherThat" button on image hover
// VERSION 1.0.1 - Added localhost blocking
(function() {
  // VISIBLE TEST - If you see this alert, the new code is loading
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    alert('CherThat v1.0.1: Extension disabled on localhost');
  }
  
  // Disable extension on all localhost pages (development moodboard)
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  console.log('CherThat v1.0.1 loaded. Hostname:', hostname);
  if (isLocalhost) {
    // Multiple ways to verify this is working
    console.log('✅ CherThat extension disabled on localhost');
    console.warn('CherThat: localhost detected, extension disabled');
    console.error('CherThat: This is an error log to test console visibility');
    
    // Exit early - don't run any extension code on localhost
    return;
  }
  
  console.log('✅ CherThat content script loaded on:', window.location.href);
  
  let activeButton = null;
  let hoveredImage = null;
  let hideTimeout = null;

  function removeActiveButton() {
    // Remove any existing button and clean up
    if (activeButton) {
      activeButton.remove();
      activeButton = null;
    }
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
    hoveredImage = null;
    
    // Also remove any orphaned buttons that might exist
    const existingButtons = document.querySelectorAll('.cherthat-save-button');
    existingButtons.forEach(btn => btn.remove());
  }

  function createSaveButton(img) {
    // Don't create a new button if we're already hovering over this image
    if (hoveredImage === img && activeButton) {
      return;
    }

    // Remove existing button if any
    removeActiveButton();

    // Don't show button on moodboard page
    if (isMoodboardPage()) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'cherthat-save-button';
    button.textContent = 'cher that';
    
    // Position relative to image - use fixed positioning coordinates
    // Since button uses position: fixed in CSS, we don't need scroll offsets
    const rect = img.getBoundingClientRect();
    
    // Position button at bottom-right of image (viewport coordinates)
    const buttonTop = rect.bottom - 40; // 40px from bottom
    const buttonLeft = rect.right - 120; // 120px from right
    
    // Make sure button stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let finalTop = buttonTop;
    let finalLeft = buttonLeft;
    
    if (buttonLeft < 10) {
      finalLeft = rect.left + 10; // If too far left, align to image left + padding
    }
    if (buttonTop < 10) {
      finalTop = rect.top + 10; // If too far up, align to image top + padding
    }
    if (buttonLeft + 120 > viewportWidth - 10) {
      finalLeft = viewportWidth - 130; // Keep within viewport
    }
    if (buttonTop + 36 > viewportHeight - 10) {
      finalTop = viewportHeight - 46; // Keep within viewport
    }
    
    button.style.top = `${finalTop}px`;
    button.style.left = `${finalLeft}px`;
    
    button.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      // Check if chrome.runtime is available
      if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
        console.error('CherThat: chrome.runtime is not available. Extension may need to be reloaded.');
        button.textContent = '✗ Extension Error';
        button.style.backgroundColor = '#c44';
        setTimeout(() => {
          removeActiveButton();
        }, 2000);
        return;
      }
      
      const imageUrl = img.src || img.currentSrc || img.dataset.src || img.dataset.original;
      const sourceUrl = window.location.href;
      
      if (imageUrl) {
        // Disable button during save
        button.disabled = true;
        button.textContent = 'Saving...';
        
        // Send to background script
        try {
          chrome.runtime.sendMessage({
            type: 'SAVE_IMAGE',
            data: {
              image_url: imageUrl,
              source_url: sourceUrl,
              created_at: new Date().toISOString()
            }
          }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Extension error:', chrome.runtime.lastError);
              button.textContent = '✗ Error';
              button.style.backgroundColor = '#c44';
              setTimeout(() => {
                removeActiveButton();
              }, 1500);
              return;
            }
            
            if (response && response.success) {
              button.textContent = '✓ Saved!';
              button.style.backgroundColor = '#5a7c59'; // Green feedback
              setTimeout(() => {
                removeActiveButton();
              }, 1500);
            } else {
              button.textContent = '✗ Error';
              button.style.backgroundColor = '#c44';
              setTimeout(() => {
                removeActiveButton();
              }, 1500);
            }
          });
        } catch (error) {
          console.error('CherThat: Error sending message:', error);
          button.textContent = '✗ Error';
          button.style.backgroundColor = '#c44';
          setTimeout(() => {
            removeActiveButton();
          }, 1500);
        }
      } else {
        button.textContent = '✗ No URL';
        setTimeout(() => {
          removeActiveButton();
        }, 1500);
      }
    });
    
    // Keep button visible when hovering over it
    button.addEventListener('mouseenter', () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    });
    
    button.addEventListener('mouseleave', () => {
      // Only hide if we're not hovering over the image either
      if (hoveredImage !== img) {
        scheduleButtonHide();
      }
    });
    
    document.body.appendChild(button);
    activeButton = button;
    hoveredImage = img;
  }

  function scheduleButtonHide() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    hideTimeout = setTimeout(() => {
      removeActiveButton();
    }, 300); // 300ms delay for better UX
  }

  // Check if we're on the moodboard page - don't show button there
  function isMoodboardPage() {
    // Method 1: Check for unique elements that only exist on the moodboard page
    const container = document.querySelector('main.container');
    const header = document.querySelector('.header h1');
    
    // If we find the moodboard container and header with "Cher That" text, we're on the moodboard
    if (container && header && header.textContent.trim() === 'Cher That') {
      return true;
    }
    
    // Method 2: Fallback - Check URL origin (for cases where DOM might not be ready)
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') && 
           (pathname === '/' || pathname === '');
  }

  // Handle image hover - use mouseenter (fires once per element)
  document.addEventListener('mouseenter', (e) => {
    // Check if it's an image element
    if (e.target.tagName === 'IMG' && e.target.src) {
      // Don't show button on moodboard page
      if (isMoodboardPage()) {
        return;
      }
      // Don't show button on very small images (likely icons/decoration)
      const rect = e.target.getBoundingClientRect();
      if (rect.width > 50 && rect.height > 50) {
        // Only create if this is a different image than the one we're currently hovering
        if (hoveredImage !== e.target) {
          createSaveButton(e.target);
        }
      }
    }
  }, true);

  // Remove button when mouse leaves image area - use mouseleave
  document.addEventListener('mouseleave', (e) => {
    if (e.target.tagName === 'IMG' && hoveredImage === e.target) {
      // Check if we're moving to the button
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget || !relatedTarget.closest?.('.cherthat-save-button')) {
        scheduleButtonHide();
      }
    }
  }, true);

  // Hide button when scrolling starts (prevents multiple buttons from appearing)
  window.addEventListener('scroll', () => {
    // Immediately remove button when scrolling
    if (activeButton) {
      removeActiveButton();
    }
    
    // Clear any pending hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }, { passive: true });

  // Handle dynamically loaded images (e.g., lazy loading)
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'IMG' && node.src) {
            // Image added to DOM
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    removeActiveButton();
  });
})();

