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
  encodeBtn.addEventListener('click', async () => {
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
    
    try {
      const file = encodeFileInput.files[0];
      const result = await encodeMessageInImage(file, secretMessageInput.value, 
        enablePasswordCheckbox.checked ? passwordInput.value : null);
      
      // Show the result
      resultImage.src = result;
      encodeResults.classList.remove('hidden');
      
      // Scroll to results
      encodeResults.scrollIntoView({ behavior: 'smooth' });
      showToast('Message successfully encoded!');
    } catch (error) {
      console.error('Encoding error:', error);
      showToast(error.message || 'Error encoding message');
    } finally {
      encodeBtn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> Encode Message';
      encodeBtn.disabled = false;
    }
  });
  
  // Decode Button Click
  decodeBtn.addEventListener('click', async () => {
    // Validate inputs
    if (!decodeFileInput.files.length) {
      showToast('Please upload an image first');
      return;
    }
    
    // Start decoding
    decodeBtn.innerHTML = '<span class="loader"></span> Decoding...';
    decodeBtn.disabled = true;
    
    try {
      const file = decodeFileInput.files[0];
      const password = hasPasswordCheckbox.checked ? decodePasswordInput.value : null;
      const message = await decodeMessageFromImage(file, password);
      
      decodedMessage.value = message;
      decodeResults.classList.remove('hidden');
      
      // Scroll to results
      decodeResults.scrollIntoView({ behavior: 'smooth' });
      showToast('Message successfully decoded!');
    } catch (error) {
      console.error('Decoding error:', error);
      showToast(error.message || 'Error decoding message');
      decodeResults.classList.add('hidden');
    } finally {
      decodeBtn.innerHTML = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 9l-9 9-9-9"></path><path d="M3 9l9 9 9-9"></path><path d="M3 9h18"></path><path d="M21 9l-9-9-9 9"></path></svg> Decode Message';
      decodeBtn.disabled = false;
    }
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
  shareBtn.addEventListener('click', async () => {
    if (navigator.share) {
      try {
        // Convert base64 to blob for sharing
        const response = await fetch(resultImage.src);
        const blob = await response.blob();
        const file = new File([blob], 'encoded-image.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Encoded Image from Cryptex',
          text: 'Check out this image with a hidden message!',
          files: [file]
        });
        
        showToast('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
        showToast('Error sharing. Try downloading instead.');
      }
    } else {
      showToast('Web Share API not supported on this browser. Try downloading instead.');
    }
  });
  
  // Copy Button Click
  copyBtn.addEventListener('click', () => {
    decodedMessage.select();
    document.execCommand('copy');
    
    // For modern browsers
    navigator.clipboard.writeText(decodedMessage.value)
      .then(() => showToast('Message copied to clipboard!'))
      .catch(() => {
        // Fallback for older browsers
        decodedMessage.select();
        document.execCommand('copy');
        showToast('Message copied to clipboard!');
      });
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
      showToast('Please select a valid image file (JPEG, PNG, etc.)');
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

// Updated Steganography Functions
async function encodeMessageInImage(file, message, password = null) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          const image = new Image();
          image.onload = function() {
              try {
                  // Create canvas with original dimensions
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = image.width;
                  canvas.height = image.height;
                  
                  // Draw image on canvas
                  ctx.drawImage(image, 0, 0);
                  
                  // Get image data
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const pixels = imageData.data;
                  
                  // Prepare message with header
                  let finalMessage = message;
                  if (password) {
                      finalMessage = encryptMessage(finalMessage, password);
                  }
                  
                  // Add header to identify our stego image (8 bytes)
                  const header = 'STEGO' + (password ? '1' : '0');
                  const fullMessage = header + finalMessage;
                  
                  // Convert to binary with termination
                  const binary = textToBinary(fullMessage);
                  
                  // Check capacity
                  const maxBits = (pixels.length / 4) * 3; // Using 3 LSBs per pixel
                  if (binary.length > maxBits) {
                      reject(new Error(`Message too large. Max: ${Math.floor(maxBits/8)} bytes`));
                      return;
                  }
                  
                  // Encode message in image
                  let bitIndex = 0;
                  for (let i = 0; i < pixels.length && bitIndex < binary.length; i += 4) {
                      // Encode 3 bits per pixel (RGB channels)
                      for (let channel = 0; channel < 3 && bitIndex < binary.length; channel++) {
                          const bit = binary[bitIndex++];
                          pixels[i + channel] = (pixels[i + channel] & 0xFE) | parseInt(bit);
                      }
                  }
                  
                  // Put modified data back
                  ctx.putImageData(imageData, 0, 0);
                  
                  // Convert to PNG (important for lossless transfer)
                  const result = canvas.toDataURL('image/png');
                  resolve(result);
              } catch (error) {
                  reject(error);
              }
          };
          image.onerror = () => reject(new Error('Image loading failed'));
          image.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
  });
}

async function decodeMessageFromImage(file, password = null) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          const image = new Image();
          image.onload = function() {
              try {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  canvas.width = image.width;
                  canvas.height = image.height;
                  ctx.drawImage(image, 0, 0);
                  
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                  const pixels = imageData.data;
                  
                  // Extract binary data
                  let binary = '';
                  for (let i = 0; i < pixels.length; i += 4) {
                      // Read 3 bits per pixel
                      for (let channel = 0; channel < 3; channel++) {
                          binary += (pixels[i + channel] & 1).toString();
                      }
                  }
                  
                  // Convert to text
                  const extracted = binaryToText(binary);
                  
                  // Check for our header
                  if (!extracted.startsWith('STEGO')) {
                      reject(new Error('No hidden message found'));
                      return;
                  }
                  
                  // Get encryption flag (5th character of header)
                  const isEncrypted = extracted[5] === '1';
                  const message = extracted.substring(6); // Skip header
                  
                  if (isEncrypted) {
                      if (!password) {
                          reject(new Error('This image is password protected'));
                          return;
                      }
                      try {
                          const decrypted = decryptMessage(message, password);
                          resolve(decrypted);
                      } catch {
                          reject(new Error('Incorrect password'));
                      }
                  } else {
                      resolve(message);
                  }
              } catch (error) {
                  reject(error);
              }
          };
          image.onerror = () => reject(new Error('Image loading failed'));
          image.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
  });
}

// Improved encryption functions
function encryptMessage(text, password) {
  // Generate a more secure key from password
  const key = Array.from(password).reduce((hash, char, i) => {
      return (hash << 5) - hash + char.charCodeAt(0) + i;
  }, 0) & 0x7FFFFFFF;
  
  let result = '';
  for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Use multiple operations to make cracking harder
      const encrypted = ((charCode ^ key) + i * 7) % 256;
      result += String.fromCharCode(encrypted);
  }
  
  // Convert to base64 for safer storage
  return btoa(unescape(encodeURIComponent(result)));
}

function decryptMessage(encrypted, password) {
  try {
      // Generate the same key as encryption
      const key = Array.from(password).reduce((hash, char, i) => {
          return (hash << 5) - hash + char.charCodeAt(0) + i;
      }, 0) & 0x7FFFFFFF;
      
      // Decode base64 first
      const decoded = decodeURIComponent(escape(atob(encrypted)));
      let result = '';
      
      for (let i = 0; i < decoded.length; i++) {
          const charCode = decoded.charCodeAt(i);
          // Reverse the encryption operations
          const decrypted = ((charCode - i * 7) ^ key) % 256;
          result += String.fromCharCode(decrypted < 0 ? decrypted + 256 : decrypted);
      }
      
      return result;
  } catch {
      throw new Error('Decryption failed');
  }
}

// Utility functions remain similar but with improved binary handling
function textToBinary(text) {
  return Array.from(text).map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('') + '00000000'; // Null terminator
}

function binaryToText(binary) {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
      const byte = binary.substr(i, 8);
      if (byte === '00000000' || byte.length < 8) break;
      text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
}
