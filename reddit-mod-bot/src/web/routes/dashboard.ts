import express from 'express';
import { getDashboardData } from '../controllers/rules';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Route to render the dashboard
router.get('/', authenticate, async (req, res) => {
    try {
        const data = await getDashboardData(req.user);
        res.render('dashboard', { data });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

export default router;