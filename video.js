// Replace with your Telegram Bot Token and Group Chat ID
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_GROUP_CHAT_ID = 'YOUR_GROUP_CHAT_ID';

// Sample video data (used in both index.html and video.html)
const videos = {
  live1: {
    embedCode: '<iframe src="https://www.facebook.com/plugins/video.php?href=YOUR_LIVE_VIDEO_URL" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true"></iframe>',
    title: 'Game Pro Ti...',
    streamer: 'RISHAB',
    thumbnail: 'https://via.placeholder.com/120x80?text=Live+Stream+1',
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
  // Add more videos as needed
};

// Make videos globally available for script.js
window.videos = videos;

// Initialize Telegram Web App (for video.html)
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

// Load video and comments on page load (for video.html)
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('video.html')) {
    const videoId = localStorage.getItem('currentVideoId');
    if (videoId && videos[videoId]) {
      const player = document.getElementById('player');
      player.innerHTML = videos[videoId].embedCode;
    } else {
      const player = document.getElementById('player');
      player.innerHTML = '<p>Video not found.</p>';
    }
    loadComments();
  }
});

// Load comments from Telegram group
async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  if (!TelegramWebApp) {
    commentsList.innerHTML = '<p>Comments are only available in Telegram.</p>';
    return;
  }
  commentsList.innerHTML = '<p>Loading comments...</p>';

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatHistory?chat_id=${TELEGRAM_GROUP_CHAT_ID}&limit=50`
    );
    const data = await response.json();

    if (!data.ok || !data.result.messages) {
      commentsList.innerHTML = '<p>No comments found.</p>';
      return;
    }

    commentsList.innerHTML = '';
    data.result.messages.forEach(message => {
      if (message.text) {
        const username = message.from.username || message.from.first_name || 'Anonymous';
        const avatar = message.from.photo?.small_file_id
          ? `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${message.from.photo.small_file_id}`
          : 'https://via.placeholder.com/30';

        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerHTML = `
          <img src="${avatar}" alt="Avatar">
          <div>
            <strong>${username}</strong>
            <p>${message.text}</p>
          </div>
        `;
        commentsList.appendChild(comment);
      }
    });
  } catch (error) {
    commentsList.innerHTML = '<p>Error loading comments.</p>';
    console.error('Error:', error);
  }
}

// Post a comment to Telegram group
async function postComment() {
  if (!TelegramWebApp) {
    console.error('Comment posting is only available in Telegram.');
    return;
  }
  const commentInput = document.getElementById('comment-input');
  const text = commentInput.value.trim();

  if (!text) return;

  try {
    const user = TelegramWebApp.initDataUnsafe.user || { username: 'Anonymous', first_name: 'User' };
    const username = user.username || user.first_name || 'Anonymous';
    const message = `[${username}] ${text}`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_GROUP_CHAT_ID}&text=${encodeURIComponent(message)}`
    );

    commentInput.value = '';
    loadComments();
  } catch (error) {
    console.error('Error posting comment:', error);
  }
}