import {ScheduledJobEvent, TriggerContext, User} from "@devvit/public-api";
import {CommentSubmit ,ModAction} from "@devvit/protos";
import {DateUnit, Setting} from "./settings.js";
import {ThingPrefix, getPostOrCommentById, replaceAll} from "./utility.js";

export async function handleCommentSubmitEvent (event: CommentSubmit, context: TriggerContext) {
    if (!event.author?.name || !event.comment || !event.subreddit || event.author.id === context.appAccountId) {
        console.log("Event is not in the right state.");
        return;
    }

    await handlePostOrCommentSubmitEvent(event.comment.id, event.subreddit.name, event.author.name, context);
}

async function handlePostOrCommentSubmitEvent(targetId: string, subredditName: string, userName: string, context: TriggerContext){
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
    const bannedWords = await context.settings.get(Setting.BannedWords);
    const target = await getPostOrCommentById(targetId, context);
   
    

}

function hasBannedWords(sentence: string, bannedWords: string): boolean {
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

//=======================================================================


