import { Devvit, SettingScope } from '@devvit/public-api';
import {settingsForBanEvasionHandling} from "./settings.js"; 
import {handleCommentSubmitEvent} from "./modplus.js";
Devvit.configure({ redditAPI: true });

Devvit.addSettings(settingsForBanEvasionHandling);

Devvit.addTrigger({
  event: "CommentSubmit",
  onEvent: handleCommentSubmitEvent,
});

export default Devvit;