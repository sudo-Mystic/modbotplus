import { Devvit, TriggerContext, User } from "@devvit/public-api";
import { CommentSubmit, linkedBundleTargetPlatformToJSON, ModAction } from "@devvit/protos";
import { DateUnit, Setting } from "./settings.js";
import { ThingPrefix, getPostOrCommentById, replaceAll } from "./utility.js";

export async function handleCommentSubmitEvent(event: CommentSubmit, context: TriggerContext) {
    if (!event.author?.name || !event.comment || !event.subreddit || event.author.id === context.appAccountId) {
        console.log("Event is not in the right state.");
        return;
    }

    await handlePostOrCommentSubmitEvent(event.comment.id, event.subreddit.name, event.author.name, context);
}

async function handlePostOrCommentSubmitEvent(targetId: string, subredditName: string, userName: string, context: TriggerContext) {
    if (userName === "AutoModerator" || userName === `${subredditName}-ModTeam`) {
        // Automod could legitimately have activity in "bad" subreddits, but we never want to act on it.
        console.log(`${userName} is exempt from all checks.`);
        return false;
    }
    let user: User | undefined;
    try {
        user = await context.reddit.getUserByUsername(userName);
    } catch {
        //
    }

    if (!user) {
        console.log("User object is not defined. This should be impossible if we checked user.");
        return;
    }

    if (user.isAdmin) {
        console.log(`${userName} is an admin! No action will be taken.`);
        return;
    }
    const bannedWords = await context.settings.get(Setting.BannedWords) as string ?? "";
    const target = await getPostOrCommentById(targetId, context);
    if (hasBannedWords(target.body ?? "null", bannedWords)) {
        console.log(`${target.authorName} commented a banned word.`);
        removeComment(targetId, context,"Removal Reason");

    }
    else {
        console.log(`${target.authorName} did not commented a banned word.`);

    }


}
async function removeComment(targetID: string,context: TriggerContext, removalReason:string) {
    try {
      // Use the remove method from the RedditAPIClient class
      // The second parameter isSpam is set to false, you can adjust this as needed
      await context.reddit.remove(targetID, false);
      const removalReason = await context.settings.get(Setting.BannedWordsRemovalReason) as string ?? "";
      if (removalReason) {
        await context.reddit.submitComment({
            id: targetID,
            text: removalReason,
           // richtext: new RichTextBuilder().rawText(removalReason)
          });
      }
  
      console.log('Comment removed successfully');
    } catch (error) {
      console.error('Failed to remove comment:', error);
    }
  }

function hasBannedWords(sentence: string, bannedWords: string): boolean {
    // Return false if bannedWords is an empty string or contains only whitespace
    if (!bannedWords.trim()) {
        return false;
    }
    // Escape regex special characters except for '*'
    const escapeRegex = (word: string) => word.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');

    // Escape the sentence itself to handle any special characters in it
    const escapedSentence = escapeRegex(sentence);

    // Split the bannedWords string into an array, trimming each word
    const bannedArray = bannedWords.split(',').map(word => word.trim());

    // Convert banned words with '*' into regex patterns
    const bannedRegexArray = bannedArray.map(word => {
        // Replace '*' with '.*' for partial matching in the regex
        const regexPattern = escapeRegex(word).replace(/\*/g, '.*');
        // Ensure the pattern checks for full words using word boundaries (\b)
        return new RegExp(`\\b${regexPattern}\\b`, 'i');
    });

    // Check if any of the regex patterns match words in the escaped sentence
    return bannedRegexArray.some(regex => regex.test(escapedSentence));
}


