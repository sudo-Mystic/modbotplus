// Visit developers.reddit.com/docs to learn Devvit!

import { Devvit } from '@devvit/public-api';

// Configure Devvit to enable Reddit API
Devvit.configure({
  redditAPI: true,
});

// Define a type for moderation actions
type ModAction = 'remove' | 'warn' | 'ban';

// Default moderation settings - stored as constants since we can't use storage APIs yet
const DEFAULT_BANNED_WORDS = ['badword1', 'badword2'];
const DEFAULT_ACTION: ModAction = 'remove';

// Add a comment trigger for !ping command
Devvit.addTrigger({
  event: 'CommentSubmit',
  async onEvent(event, context) {
    try {
      // Get the comment author
      const comment = event.comment;
      if (!comment || !comment.body) return;
      
      // Get current username to avoid self-replies
      const currentUser = await context.reddit.getCurrentUser();
      
      // Only respond if it's not our own comment
      if (currentUser && comment.author !== currentUser.username) {
        // Check if the comment contains the trigger word
        if (comment.body.toLowerCase().includes('!ping')) {
          // Reply to the comment with a pong message
          await context.reddit.submitComment({
            id: comment.id,
            text: 'Pong! 🏓 I am a bot and I respond to the !ping command.',
          });
          
          console.log(`Replied to comment ${comment.id} with a pong message`);
        }
        
        // Check for banned words
        if (containsBannedWords(comment.body)) {
          await moderateContent(comment.id, 'comment', context);
        }
      }
    } catch (error) {
      console.error('Error processing comment:', error);
    }
  }
});

// Add a post moderation trigger
Devvit.addTrigger({
  event: 'PostSubmit',
  async onEvent(event, context) {
    try {
      const post = event.post;
      if (!post) return;
      
      // Check for banned words in post title and body
      const contentToCheck = `${post.title || ''} ${post.selftext || ''}`;
      
      if (containsBannedWords(contentToCheck)) {
        await moderateContent(post.id, 'post', context);
      }
    } catch (error) {
      console.error('Error processing post:', error);
    }
  }
});

// Helper function to check for banned words
function containsBannedWords(content: string): boolean {
  return DEFAULT_BANNED_WORDS.some(word => 
    content.toLowerCase().includes(word.toLowerCase())
  );
}

// Moderation function
async function moderateContent(
  contentId: string, 
  contentType: 'comment' | 'post', 
  context: any
) {
  console.log(`Banned word detected in ${contentType} ${contentId}`);
  
  try {
    // Take action based on default settings
    switch (DEFAULT_ACTION) {
      case 'remove':
        // Use generic remove API for both comments and posts
        await context.reddit.remove({
          id: contentId,
          spam: false,
        });
        console.log(`Removed ${contentType} ${contentId} due to banned word`);
        break;
        
      case 'warn':
        // For comments, reply with a warning
        if (contentType === 'comment') {
          await context.reddit.submitComment({
            id: contentId,
            text: 'Warning: Your comment contains banned words and may be removed if not edited.',
          });
        }
        console.log(`Warned on ${contentType} ${contentId} due to banned word`);
        break;
        
      case 'ban':
        // Due to API limitations, this is simplified
        console.log(`Ban action would be applied for ${contentType} ${contentId}`);
        break;
    }
  } catch (error) {
    console.error(`Error moderating ${contentType}:`, error);
  }
}

// Menu items for bot administration
Devvit.addMenuItem({
  label: 'ModBot+ Settings',
  location: 'subreddit',
  onPress: async (_, context) => {
    try {
      // Create a simple form with instructions instead
      context.ui.showToast('Currently using default moderation settings');
      
      // In the future, we'll implement persistent settings using the appropriate API
      console.log('Settings menu accessed');
    } catch (error) {
      console.error('Error in settings:', error);
    }
  }
});

// Menu item to schedule a post
Devvit.addMenuItem({
  label: 'Schedule a Post',
  location: 'subreddit',
  onPress: async (_, context) => {
    try {
      // Create a simple toast notification since we can't implement scheduling yet
      context.ui.showToast('Post scheduling will be available in a future update');
      console.log('Post scheduling requested');
    } catch (error) {
      console.error('Error in post scheduling:', error);
    }
  }
});

// Menu item to schedule a comment
Devvit.addMenuItem({
  label: 'Schedule a Comment',
  location: 'post',
  onPress: async (_, context) => {
    try {
      // Create a simple toast notification since we can't implement scheduling yet
      context.ui.showToast('Comment scheduling will be available in a future update');
      console.log('Comment scheduling requested');
    } catch (error) {
      console.error('Error in comment scheduling:', error);
    }
  }
});

export default Devvit;
