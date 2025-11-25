import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Get user config
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await query('SELECT * FROM user_config WHERE user_id = $1', [req.userId]);

    if (result.rows.length === 0) {
      // Create default config if it doesn't exist
      const newConfig = await query('INSERT INTO user_config (user_id) VALUES ($1) RETURNING *', [req.userId]);
      return res.json(newConfig.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user config
router.put('/', async (req: AuthRequest, res: Response) => {
  const allowedFields = [
    'theme',
    'sidebar_width',
    'editor_font_size',
    'editor_font_family',
    'line_height',
    'show_line_numbers',
    'auto_save',
    'auto_save_interval',
    'vim_mode',
    'spell_check',
    'live_preview',
    'default_view',
    'config_data',
  ];

  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  for (const [key, value] of Object.entries(req.body)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = $${paramCount++}`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  values.push(req.userId);

  try {
    const result = await query(
      `UPDATE user_config SET ${updates.join(', ')} WHERE user_id = $${paramCount} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
