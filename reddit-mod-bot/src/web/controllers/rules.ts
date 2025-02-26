import { Request, Response } from 'express';
import { Rule } from '../../shared/types/rule';
import { db } from '../../shared/db';
import { logger } from '../../shared/utils/logger';

// Create a new moderation rule
export const createRule = async (req: Request, res: Response) => {
    const newRule: Rule = req.body;

    try {
        const result = await db.rules.create(newRule);
        res.status(201).json(result);
    } catch (error) {
        logger.error('Error creating rule:', error);
        res.status(500).json({ message: 'Error creating rule' });
    }
};

// Get all moderation rules
export const getRules = async (req: Request, res: Response) => {
    try {
        const rules = await db.rules.findAll();
        res.status(200).json(rules);
    } catch (error) {
        logger.error('Error fetching rules:', error);
        res.status(500).json({ message: 'Error fetching rules' });
    }
};

// Update a moderation rule
export const updateRule = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedRule: Rule = req.body;

    try {
        const result = await db.rules.update(id, updatedRule);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error updating rule:', error);
        res.status(500).json({ message: 'Error updating rule' });
    }
};

// Delete a moderation rule
export const deleteRule = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await db.rules.delete(id);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting rule:', error);
        res.status(500).json({ message: 'Error deleting rule' });
    }
};