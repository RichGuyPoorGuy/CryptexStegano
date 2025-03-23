// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    // Tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Encode tab elements
    const encodeUploadArea = document.getElementById('encode-upload-area');
    const encodeFileInput = document.getElementById('encode-file-input');
    const encodeImagePreview = document.getElementById('encode-image-preview');
    const encodePreviewContainer = document.getElementById('encode-preview-container');
    const encodeRemoveImage = document.getElementById('encode-remove-image');
    const secretMessageInput = document.getElementById('secret-message');
    const enablePasswordCheckbox = document.getElementById('enable-password');
    const passwordInputGroup = document.getElementById('password-input-group');
    const passwordInput = document.getElementById('password');
    const encodeBtn = document.getElementById('encode-btn');
    const encodeResults = document.getElementById('encode-results');
    const resultImage = document.getElementById('result-image');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    
    // Decode tab elements
    const decodeUploadArea = document.getElementById('decode-upload-area');
    const decodeFileInput = document.getElementById('decode-file-input');
    const decodeImagePreview = document.getElementById('decode-image-preview');
    const decodePreviewContainer = document.getElementById('decode-preview-container');
    const decodeRemoveImage = document.getElementById('decode-remove-image');
    const hasPasswordCheckbox = document.getElementById('has-password');
    const decodePasswordGroup = document.getElementById('decode-password-group');
    const decodePasswordInput = document.getElementById('decode-password');
    const decodeBtn = document.getElementById('decode-btn');
    const decodeResults = document.getElementById('decode-results');
    const decodedMessage = document.getElementById('decoded-message');
    const copyBtn = document.getElementById('copy-btn');
    
    // Toast notification
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastClose = document.getElementById('toast-close');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
    
    // Theme Toggle Functionality
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      
      // Toggle icons
      sunIcon.classList.toggle('hidden');
      moonIcon.classList.toggle('hidden');
      
      // Save theme preference
      const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme);
      
      // Add animation
      const cards = document.querySelectorAll('.app-card');
      cards.forEach(card => {
        card.style.transition = 'all 0.5s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
    
    // Tab Switching Functionality
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all tabs
        tabBtns.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.add('hidden'));
        
        // Show corresponding tab content
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        
        // Add animations
        const activeTabContent = document.getElementById(`${tabId}-tab`);
        activeTabContent.classList.add('fade-in');
        
        setTimeout(() => {
          activeTabContent.classList.remove('fade-in');
        }, 500);
      });
    });
    
    // File Upload Functionality - Encode
    encodeUploadArea.addEventListener('click', () => {
      encodeFileInput.click();
    });
    
    encodeFileInput.addEventListener('change', (e) => {
      handleFileUpload(e, encodeImagePreview, encodePreviewContainer);
    });
    
    encodeUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      encodeUploadArea.classList.add('dragover');
    });
    
    encodeUploadArea.addEventListener('dragleave', () => {
      encodeUploadArea.classList.remove('dragover');
    });
    
    encodeUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      encodeUploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        encodeFileInput.files = e.dataTransfer.files;
        handleFileUpload({ target: encodeFileInput }, encodeImagePreview, encodePreviewContainer);
      }
    });
    
    encodeRemoveImage.addEventListener('click', () => {
      encodeFileInput.value = '';
      encodePreviewContainer.classList.add('hidden');
      encodeUploadArea.classList.remove('hidden');
    });
    
    // File Upload Functionality - Decode
    decodeUploadArea.addEventListener('click', () => {
      decodeFileInput.click();
    });
    
    decodeFileInput.addEventListener('change', (e) => {
      handleFileUpload(e, decodeImagePreview, decodePreviewContainer);
    });
    
    decodeUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      decodeUploadArea.classList.add('dragover');
    });
    
    decodeUploadArea.addEventListener('dragleave', () => {
      decodeUploadArea.classList.remove('dragover');
    });
    
    decodeUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      decodeUploadArea.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        decodeFileInput.files = e.dataTransfer.files;
        handleFileUpload({ target: decodeFileInput }, decodeImagePreview, decodePreviewContainer);
      }
    });
    
    decodeRemoveImage.addEventListener('click', () => {
      decodeFileInput.value = '';
      decodePreviewContainer.classList.add('hidden');
      decodeUploadArea.classList.remove('hidden');
    });
    
    // Password toggle functionality
    enablePasswordCheckbox.addEventListener('change', () => {
      passwordInputGroup.classList.toggle('hidden', !enablePasswordCheckbox.checked);
    });
    
    hasPasswordCheckbox.addEventListener('change', () => {
      decodePasswordGroup.classList.toggle('hidden', !hasPasswordCheckbox.checked);
    });
    
    // Encode Button Click
    encodeBtn.addEventListener('click', () => {
      // Validate inputs
      if (!encodeFileInput.files.length) {
        showToast('Please upload an image first');
        return;
      }
      
      if (!secretMessageInput.value.trim()) {
        showToast('Please enter a secret message');
        return;
      }
      
      if (enablePasswordCheckbox.checked && !passwordInput.value) {
        showToast('Please enter a password or uncheck the password option');
        return;
      }
      
      // Start encoding
      encodeBtn.innerHTML = '<span class="loader"></span> Encoding...';
      encodeBtn.disabled = true;
      
      const file = encodeFileInput.files[0];
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const image = new Image();
        image.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = image.width;
          canvas.height = image.height;
          
          // Draw the image on canvas
          ctx.drawImage(image, 0, 0);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          // Prepare message
          let message = secretMessageInput.value;
          
          // Apply password encryption if enabled
          if (enablePasswordCheckbox.checked && passwordInput.value) {
            message = simpleEncrypt(message, passwordInput.value);
          }
          
          // Add a marker to identify if message is password protected
          const marker = enablePasswordCheckbox.checked && passwordInput.value ? 'ENC:' : 'MSG:';
          const finalMessage = marker + message;
          
          // Convert message to binary
          const binary = textToBinary(finalMessage);
          
          // Check if image has enough pixels to store the message
          if (binary.length > pixels.length / 4 * 3) {
            showToast('Message too large for this image. Please use a larger image or a shorter message.');
            encodeBtn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> Encode Message';
            encodeBtn.disabled = false;
            return;
          }
          
          // Hide message in the least significant bits
          for (let i = 0; i < binary.length; i++) {
            const pixelIndex = i * 4;
            
            if (pixelIndex < pixels.length - 4) {
              const bit = parseInt(binary[i]);
              
              // Modify the least significant bit of the pixel
              if (i % 3 === 0) {
                pixels[pixelIndex] = bit === 1 ? makeOdd(pixels[pixelIndex]) : makeEven(pixels[pixelIndex]);
              } else if (i % 3 === 1) {
                pixels[pixelIndex + 1] = bit === 1 ? makeOdd(pixels[pixelIndex + 1]) : makeEven(pixels[pixelIndex + 1]);
              } else {
                pixels[pixelIndex + 2] = bit === 1 ? makeOdd(pixels[pixelIndex + 2]) : makeEven(pixels[pixelIndex + 2]);
              }
            }
          }
          
          // Put the modified pixels back on the canvas
          ctx.putImageData(imageData, 0, 0);
          
          // Show the result
          resultImage.src = canvas.toDataURL('image/png');
          encodeResults.classList.remove('hidden');
          
          // Reset button state
          encodeBtn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> Encode Message';
          encodeBtn.disabled = false;
          
          // Scroll to results
          encodeResults.scrollIntoView({ behavior: 'smooth' });
          
          showToast('Message successfully encoded!');
        };
        
        image.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    });
    
    decodeBtn.addEventListener('click', () => {
        // Validate inputs
        if (!decodeFileInput.files.length) {
          showToast('Please upload an image first');
          return;
        }
      
        // Start decoding
        decodeBtn.innerHTML = '<span class="loader"></span> Decoding...';
        decodeBtn.disabled = true;
      
        const file = decodeFileInput.files[0];
        const reader = new FileReader();
      
        reader.onload = function(e) {
          const image = new Image();
          image.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
      
            canvas.width = image.width;
            canvas.height = image.height;
      
            // Draw the image on canvas
            ctx.drawImage(image, 0, 0);
      
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
      
            // Extract binary message
            let binary = '';
            const maxBits = Math.min(pixels.length, 3000 * 8); // Limit to prevent processing too many pixels
      
            for (let i = 0; i < maxBits; i++) {
              const pixelIndex = i * 4;
      
              if (pixelIndex < pixels.length - 4) {
                if (i % 3 === 0) {
                  binary += pixels[pixelIndex] % 2 === 1 ? '1' : '0';
                } else if (i % 3 === 1) {
                  binary += pixels[pixelIndex + 1] % 2 === 1 ? '1' : '0';
                } else {
                  binary += pixels[pixelIndex + 2] % 2 === 1 ? '1' : '0';
                }
              }
            }
      
            // Convert binary to text
            const extractedText = binaryToText(binary);
      
            // Check if message has a marker
            if (extractedText.startsWith('MSG:')) {
              // Message is not encrypted
              const message = extractedText.substring(4);
              decodedMessage.value = message;
              decodeResults.classList.remove('hidden');
              showToast('Message successfully decoded!');
            } else if (extractedText.startsWith('ENC:')) {
              // Message is encrypted
              if (hasPasswordCheckbox.checked && decodePasswordInput.value) {
                try {
                  const encryptedMessage = extractedText.substring(4);
                  const decryptedMessage = simpleDecrypt(encryptedMessage, decodePasswordInput.value);
                  decodedMessage.value = decryptedMessage;
                  decodeResults.classList.remove('hidden');
                  showToast('Message successfully decoded!');
                } catch (error) {
                  showToast('Incorrect password or corrupted message.');
                  console.error('Decryption error:', error);
                }
              } else {
                // If the message is password-protected but no password is provided
                showToast('Image is password protected. Please check the password option and enter the correct password.');
                decodeResults.classList.add('hidden'); // Hide the results section
              }
            } else {
              showToast('No hidden message found or the image format is not supported.');
            }
      
            // Reset button state
            decodeBtn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 9l-9 9-9-9"></path><path d="M3 9l9 9 9-9"></path><path d="M3 9h18"></path><path d="M21 9l-9-9-9 9"></path></svg> Decode Message';
            decodeBtn.disabled = false;
      
            // Scroll to results
            decodeResults.scrollIntoView({ behavior: 'smooth' });
          };
      
          image.src = e.target.result;
        };
      
        reader.readAsDataURL(file);
      });
    
    // Download Button Click
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'encoded-image.png';
      link.href = resultImage.src;
      link.click();
      
      showToast('Image downloaded successfully!');
    });
    
    // Share Button Click
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        // Convert base64 to blob for sharing
        fetch(resultImage.src)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'encoded-image.png', { type: 'image/png' });
            navigator.share({
              title: 'Encoded Image from Cryptex',
              text: 'Check out this image with a hidden message!',
              files: [file]
            })
              .then(() => showToast('Shared successfully!'))
              .catch(error => {
                console.error('Error sharing:', error);
                showToast('Error sharing. Try downloading instead.');
              });
          });
      } else {
        showToast('Web Share API not supported on this browser. Try downloading instead.');
      }
    });
    
    // Copy Button Click
    copyBtn.addEventListener('click', () => {
      decodedMessage.select();
      document.execCommand('copy');
      
      showToast('Message copied to clipboard!');
    });
    
    // Toast Close Button
    toastClose.addEventListener('click', () => {
      toast.classList.add('hidden');
    });
    
    // Helper Functions
    function handleFileUpload(event, previewElement, previewContainer) {
      const file = event.target.files[0];
      
      if (file && file.type.match('image.*')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          previewElement.src = e.target.result;
          previewContainer.classList.remove('hidden');
          
          // Hide upload area
          if (previewElement === encodeImagePreview) {
            encodeUploadArea.classList.add('hidden');
          } else {
            decodeUploadArea.classList.add('hidden');
          }
        };
        
        reader.readAsDataURL(file);
      } else {
        showToast('Please select a valid image file');
      }
    }
    
    function showToast(message) {
      toastMessage.textContent = message;
      toast.classList.remove('hidden');
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
    
    // Add loaders CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loader {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
      }
      
      .upload-area.dragover {
        border-color: var(--accent-color);
        background-color: rgba(0, 123, 255, 0.05);
      }
      
      .dark-mode .upload-area.dragover {
        background-color: rgba(255, 0, 255, 0.05);
      }
    `;
    document.head.appendChild(style);
  });
  
  // Utility Functions for Steganography
  function makeEven(n) {
    return n % 2 === 0 ? n : n - 1;
  }
  
  function makeOdd(n) {
    return n % 2 === 1 ? n : n + 1;
  }
  
  function textToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const binaryChar = charCode.toString(2).padStart(8, '0');
      binary += binaryChar;
    }
    // Add termination sequence
    binary += '00000000';
    return binary;
  }
  
  function binaryToText(binary) {
    let text = '';
    for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8);
      if (byte === '00000000') {
        // Termination sequence found
        break;
      }
      const charCode = parseInt(byte, 2);
      if (charCode > 0) { // Ignore null characters
        text += String.fromCharCode(charCode);
      }
    }
    return text;
  }
  
  // Simple encryption/decryption functions
  function simpleEncrypt(text, key) {
    let result = '';
    const keySum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      const encryptedChar = String.fromCharCode(charCode ^ keyChar ^ (keySum % 256));
      result += encryptedChar;
    }
    
    return btoa(result); // Base64 encode for safer transmission
  }
  
  function simpleDecrypt(encryptedText, key) {
    try {
      const text = atob(encryptedText); // Base64 decode
      const keySum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      let result = '';
      
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        const decryptedChar = String.fromCharCode(charCode ^ keyChar ^ (keySum % 256));
        result += decryptedChar;
      }
      
      return result;
    } catch (e) {
      throw new Error('Decryption failed. Incorrect password or corrupted data.');
    }
  }