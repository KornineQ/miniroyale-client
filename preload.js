const { contextBridge, ipcRenderer, remote } = require('electron');

contextBridge.exposeInMainWorld('myCustomAPI', {
  blockSocialEmbeds: () => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src && (src.includes('facebook') || src.includes('twitter') || src.includes('youtube'))) {
        iframe.remove();
      }
    });
  },

  disableF11Fullscreen: () => {
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


ipcRenderer.on('main-process-message', (event, message) => {
  console.log('Received message from main process:', message);
});

const { getCurrentWindow } = remote;
const currentWindow = getCurrentWindow();
console.log('Current window title:', currentWindow.getTitle());
