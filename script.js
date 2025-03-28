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

// Steganography Functions
async function encodeMessageInImage(file, message, password = null) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const image = new Image();
            image.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas dimensions to image dimensions
                    canvas.width = image.width;
                    canvas.height = image.height;
                    
                    // Draw the image on canvas
                    ctx.drawImage(image, 0, 0);
                    
                    // Get image data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;
                    
                    // Prepare message
                    let finalMessage = message;
                    
                    // Apply password encryption if enabled
                    if (password) {
                        finalMessage = simpleEncrypt(finalMessage, password);
                    }
                    
                    // Add a marker to identify if message is password protected
                    const marker = password ? 'ENC:' : 'MSG:';
                    finalMessage = marker + finalMessage;
                    
                    // Convert message to binary with termination sequence
                    const binary = textToBinary(finalMessage);
                    
                    // Check if image has enough pixels to store the message
                    if (binary.length > pixels.length / 4 * 3) {
                        reject(new Error('Message too large for this image. Please use a larger image or a shorter message.'));
                        return;
                    }
                    
                    // Hide message in the least significant bits
                    for (let i = 0; i < binary.length; i++) {
                        const pixelIndex = Math.floor(i / 3) * 4;
                        const colorChannel = i % 3; // 0 = R, 1 = G, 2 = B
                        
                        if (pixelIndex < pixels.length - 4) {
                            const bit = parseInt(binary[i]);
                            
                            // Modify the least significant bit of the pixel
                            if (bit === 1) {
                                pixels[pixelIndex + colorChannel] = makeOdd(pixels[pixelIndex + colorChannel]);
                            } else {
                                pixels[pixelIndex + colorChannel] = makeEven(pixels[pixelIndex + colorChannel]);
                            }
                        }
                    }
                    
                    // Put the modified pixels back on the canvas
                    ctx.putImageData(imageData, 0, 0);
                    
                    // Convert to PNG to avoid lossy compression
                    const result = canvas.toDataURL('image/png');
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            
            image.onerror = function() {
                reject(new Error('Failed to load image'));
            };
            
            image.src = e.target.result;
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };
        
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
                    
                    // Draw the image on canvas
                    ctx.drawImage(image, 0, 0);
                    
                    // Get image data
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;
                    
                    // Extract binary message
                    let binary = '';
                    const maxBits = Math.min(pixels.length, 100000 * 8); // Limit to prevent processing too many pixels
                    
                    for (let i = 0; i < maxBits; i++) {
                        const pixelIndex = Math.floor(i / 3) * 4;
                        const colorChannel = i % 3; // 0 = R, 1 = G, 2 = B
                        
                        if (pixelIndex < pixels.length - 4) {
                            binary += (pixels[pixelIndex + colorChannel] % 2).toString();
                        }
                    }
                    
                    // Convert binary to text
                    const extractedText = binaryToText(binary);
                    
                    // Check if message has a marker
                    if (extractedText.startsWith('MSG:')) {
                        // Message is not encrypted
                        resolve(extractedText.substring(4));
                    } else if (extractedText.startsWith('ENC:')) {
                        // Message is encrypted
                        if (password) {
                            try {
                                const encryptedMessage = extractedText.substring(4);
                                const decryptedMessage = simpleDecrypt(encryptedMessage, password);
                                resolve(decryptedMessage);
                            } catch (error) {
                                reject(new Error('Incorrect password or corrupted message.'));
                            }
                        } else {
                            reject(new Error('Image is password protected. Please check the password option and enter the correct password.'));
                        }
                    } else {
                        reject(new Error('No hidden message found or the image format is not supported.'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            image.onerror = function() {
                reject(new Error('Failed to load image'));
            };
            
            image.src = e.target.result;
        };
        
        reader.onerror = function() {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsDataURL(file);
    });
}

// Utility Functions for Steganography
function makeEven(n) {
    return n & ~1; // Clear the least significant bit
}

function makeOdd(n) {
    return n | 1; // Set the least significant bit
}

function textToBinary(text) {
    let binary = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const binaryChar = charCode.toString(2).padStart(8, '0');
        binary += binaryChar;
    }
    // Add termination sequence (null character)
    binary += '00000000';
    return binary;
}

function binaryToText(binary) {
    let text = '';
    for (let i = 0; i < binary.length; i += 8) {
        const byte = binary.substr(i, 8);
        if (byte === '00000000' || byte.length < 8) {
            // Termination sequence found or incomplete byte
            break;
        }
        const charCode = parseInt(byte, 2);
        text += String.fromCharCode(charCode);
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
        const encryptedChar = charCode ^ keyChar ^ (keySum % 256);
        result += String.fromCharCode(encryptedChar);
    }
    
    // Base64 encode for safer transmission
    return btoa(encodeURIComponent(result).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
    }));
}

function simpleDecrypt(encryptedText, key) {
    try {
        // Base64 decode
        const decoded = atob(encryptedText);
        const text = decodeURIComponent(Array.from(decoded).map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const keySum = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const decryptedChar = charCode ^ keyChar ^ (keySum % 256);
            result += String.fromCharCode(decryptedChar);
        }
        
        return result;
    } catch (e) {
        throw new Error('Decryption failed. Incorrect password or corrupted data.');
    }
}
