// preload.js
const { contextBridge, ipcRenderer, remote } = require('electron');

// Expose custom API to the renderer process
contextBridge.exposeInMainWorld('myCustomAPI', {
  blockSocialEmbeds: () => {
    // Example: Block site embeds from social media
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src && (src.includes('facebook') || src.includes('twitter') || src.includes('youtube'))) {
        iframe.remove();
      }
    });
  },

  disableF11Fullscreen: () => {
    // Example: Disable F11 key for fullscreen
    document.addEventListener('keydown', (event) => {
      if (event.key === 'F11') {
        event.preventDefault();
      }
    });
  },

  sendToMain: (message) => {
    ipcRenderer.send('custom-message', message);
  },
});

// You can also add more functionality or access Node.js modules here

// Example: Add a listener for IPC messages from the main process
ipcRenderer.on('main-process-message', (event, message) => {
  console.log('Received message from main process:', message);
});

// Example: Use remote module to access main process functionality
const { getCurrentWindow } = remote;
const currentWindow = getCurrentWindow();
console.log('Current window title:', currentWindow.getTitle());
