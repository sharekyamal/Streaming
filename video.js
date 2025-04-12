// Telegram Bot Token and Group Chat ID
const TELEGRAM_BOT_TOKEN = '7937844611:AAFtYXHDQwIy36RlDW6txBCk857ELD5iTqI';
const TELEGRAM_GROUP_CHAT_ID = '-1002277431924';

// Load video and comments on page load (for video.html)
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('video.html')) {
    // Ensure videos object is available
    if (!window.videos) {
      console.error('Videos data not found. Ensure script.js is loaded properly.');
      const player = document.getElementById('player');
      player.innerHTML = '<p>Error: Video data not found.</p>';
      return;
    }

    const videoId = localStorage.getItem('currentVideoId');
    const player = document.getElementById('player');
    
    if (videoId && window.videos[videoId]) {
      player.innerHTML = window.videos[videoId].embedCode;
    } else {
      player.innerHTML = '<p>Video not found.</p>';
    }

    loadComments();
  }
});

// Load comments from Telegram group
async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  if (!window.Telegram || !window.Telegram.WebApp) {
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
    console.error('Error loading comments:', error);
  }
}

// Post a comment to Telegram group
async function postComment() {
  if (!window.Telegram || !window.Telegram.WebApp) {
    console.error('Comment posting is only available in Telegram.');
    alert('Please open this app in Telegram to post comments.');
    return;
  }

  const commentInput = document.getElementById('comment-input');
  const text = commentInput.value.trim();

  if (!text) {
    alert('Please enter a comment.');
    return;
  }

  try {
    const user = window.Telegram.WebApp.initDataUnsafe.user || { username: 'Anonymous', first_name: 'User' };
    const username = user.username || user.first_name || 'Anonymous';
    const message = `[${username}] ${text}`;

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_GROUP_CHAT_ID}&text=${encodeURIComponent(message)}`
    );
    const data = await response.json();

    if (data.ok) {
      commentInput.value = '';
      loadComments();
    } else {
      console.error('Error posting comment:', data.description);
      alert(`Failed to post comment: ${data.description}`);
    }
  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Error posting comment. Please try again.');
  }
}
