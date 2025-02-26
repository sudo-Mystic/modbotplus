import { Request, Response } from 'express';
import { Action } from '../../shared/types/action';
import { logger } from '../../shared/utils/logger';

// Sample actions that can be performed by the bot
const actions: Action[] = [
    {
        name: 'banUser',
        description: 'Ban a user from the subreddit',
        execute: (userId: string) => {
            // Logic to ban a user
            logger.info(`Banning user: ${userId}`);
            // Call to Reddit API to ban user
        }
    },
    {
        name: 'removePost',
        description: 'Remove a post from the subreddit',
        execute: (postId: string) => {
            // Logic to remove a post
            logger.info(`Removing post: ${postId}`);
            // Call to Reddit API to remove post
        }
    },
    // Add more actions as needed
];

// Function to get all available actions
export const getActions = (req: Request, res: Response) => {
    res.json(actions);
};

// Function to execute a specific action
export const executeAction = (req: Request, res: Response) => {
    const { actionName, targetId } = req.body;

    const action = actions.find(a => a.name === actionName);
    if (action) {
        action.execute(targetId);
        res.status(200).send(`Action ${actionName} executed successfully.`);
    } else {
        res.status(404).send('Action not found.');
    }
};