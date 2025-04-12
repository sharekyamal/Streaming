// Initialize Telegram Web App
let TelegramWebApp = null;
try {
  TelegramWebApp = window.Telegram.WebApp;
  if (TelegramWebApp) {
    TelegramWebApp.ready();
    TelegramWebApp.expand();
  } else {
    console.error('Telegram Web App is not available. Please open this app in Telegram.');
  }
} catch (error) {
  console.error('Error initializing Telegram Web App:', error);
}

// Function to open video page
function openVideoPage(videoId) {
  localStorage.setItem('currentVideoId', videoId);
  window.location.href = 'video.html';
}

// Populate video lists dynamically
document.addEventListener('DOMContentLoaded', () => {
  const liveStreamsContainer = document.getElementById('live-streams');
  const videoListContainer = document.getElementById('video-list');

  // Check if videos is defined
  if (!window.videos) {
    console.error('Videos data is not available.');
    return;
  }

  // Populate Live Streams and History
  Object.keys(window.videos).forEach(videoId => {
    const video = window.videos[videoId];
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.onclick = () => openVideoPage(videoId);

    if (video.isLive) {
      videoItem.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="badge">LIVE</div>
        <div class="video-info">
          <p>${video.title}</p>
          <p class="streamer">${video.streamer}</p>
          <p class="viewers">👀 ${video.viewers}</p>
        </div>
      `;
      liveStreamsContainer.appendChild(videoItem);
    } else {
      videoItem.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="video-info">
          <p>${video.title}</p>
          <p class="streamer">${video.streamer}</p>
          <p class="viewers">👀 ${video.viewers}</p>
        </div>
      `;
      videoListContainer.appendChild(videoItem);
    }
  });
});