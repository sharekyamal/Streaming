// Sample video data (used in both index.html and video.html)
let videos = {
  live1: {
    embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Fdnaindia%2Fvideos%2F1000703981665667%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    title: 'SBO Live',
    streamer: 'မိုး',
    thumbnail: 'https://pbs.twimg.com/media/Fzo-ABjaAAEzlmD?format=jpg&name=medium',
    viewers: 'Live Now',
    isLive: true,
  },
   live2: {
    embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fweb.facebook.com%2Fdnaindia%2Fvideos%2F1000703981665667%2F&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>',
    title: 'SBO Live',
    streamer: 'ကတုံး',
    thumbnail: 'https://pbs.twimg.com/media/Fzo-ABjaAAEzlmD?format=jpg&name=medium',
    viewers: 'Live Now',
    isLive: true,
  },
  history1: {
    embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?href=YOUR_HISTORY_VIDEO_URL" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>',
    title: 'Game Tour...',
    streamer: 'RAVI',
    thumbnail: 'https://via.placeholder.com/120x80?text=History+Video+1',
    viewers: '23.5K Views',
    isLive: false,
  },
};

// Telegram Bot Token and Chat IDs
const TELEGRAM_BOT_TOKEN = '7937844611:AAFtYXHDQwIy36RlDW6txBCk857ELD5iTqI';
const TELEGRAM_CHAT_IDS = [
  '-1002277431924', // Group Chat ID
  '@sbolivechannel',    // Channel Username (Public Channel ဆိုရင်)
];

// Make videos globally available
window.videos = videos;

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

// Function to send notification to Telegram
async function sendNotification(message) {
  for (const chatId of TELEGRAM_CHAT_IDS) {
    try {
      await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`
      );
      console.log(`Notification sent to ${chatId}`);
    } catch (error) {
      console.error(`Error sending notification to ${chatId}:`, error);
    }
  }
}

// Function to add a new live video and send notification
function addNewLiveVideo(videoId, videoData) {
  videos[videoId] = videoData;
  window.videos = videos;

  // Refresh the UI
  const liveStreamsContainer = document.getElementById('live-streams');
  const videoItem = document.createElement('div');
  videoItem.className = 'video-item';
  videoItem.onclick = () => openVideoPage(videoId);
  videoItem.innerHTML = `
    <img src="${videoData.thumbnail}" alt="${videoData.title}">
    <div class="badge">LIVE</div>
    <div class="video-info">
      <p>${videoData.title}</p>
      <p class="streamer">${videoData.streamer}</p>
      <p class="viewers">👀 <i class="fas fa-circle live-icon"></i> <span class="live-badge">LIVE</span></p>
    </div>
  `;
  liveStreamsContainer.appendChild(videoItem);

  // Send notification
  const message = `New Live Stream Alert! 🎥\nTitle: ${videoData.title}\nStreamer: ${videoData.streamer}\nWatch now!`;
  sendNotification(message);
}

// Function to open video page
function openVideoPage(videoId) {
  localStorage.setItem('currentVideoId', videoId);
  window.location.href = 'video.html';
}

// Populate video lists dynamically (for index.html)
if (window.location.pathname.includes('index.html') || !window.location.pathname.includes('video.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const liveStreamsContainer = document.getElementById('live-streams');
    const videoListContainer = document.getElementById('video-list');

    // Check if containers exist
    if (!liveStreamsContainer || !videoListContainer) {
      console.error('Live streams or video list container not found.');
      return;
    }

    // Populate Live Streams and History
    Object.keys(videos).forEach(videoId => {
      const video = videos[videoId];
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
            <p class="viewers">👀 <i class="fas fa-circle live-icon"></i> <span class="live-badge">LIVE</span></p>
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

    // Example: Add a new live video (for testing)
    // You can call this function whenever a new live video is added
    const newLiveVideo = {
      embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?href=YOUR_NEW_LIVE_VIDEO_URL" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>',
      title: 'New SBO Live',
      streamer: 'မိုး',
      thumbnail: 'https://via.placeholder.com/120x80?text=New+Live+Stream',
      viewers: 'Live Now',
      isLive: true,
    };
    // Uncomment the line below to test adding a new live video
    // addNewLiveVideo('live2', newLiveVideo);
  });
}
