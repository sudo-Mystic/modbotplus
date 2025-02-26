import express from 'express';
import { getRules, createRule, updateRule, deleteRule } from '../controllers/rules';
import { performAction } from '../controllers/actions';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Route to get all moderation rules
router.get('/rules', authenticate, getRules);

// Route to create a new moderation rule
router.post('/rules', authenticate, createRule);

// Route to update an existing moderation rule
router.put('/rules/:id', authenticate, updateRule);

// Route to delete a moderation rule
router.delete('/rules/:id', authenticate, deleteRule);

// Route to perform a moderation action
router.post('/actions', authenticate, performAction);

export default router;