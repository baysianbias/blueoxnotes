import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all notes
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, title, content, folder, tags, created_at, updated_at FROM notes WHERE user_id = $1 AND deleted_at IS NULL ORDER BY updated_at DESC',
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single note
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, title, content, folder, tags, created_at, updated_at FROM notes WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create note
router.post(
  '/',
  [body('title').trim(), body('content').optional(), body('folder').optional(), body('tags').optional().isArray()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, folder, tags } = req.body;

    try {
      const result = await query(
        'INSERT INTO notes (user_id, title, content, folder, tags) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, content, folder, tags, created_at, updated_at',
        [req.userId, title || 'Untitled Note', content || '', folder || 'root', tags || []]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Create note error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update note
router.put(
  '/:id',
  [body('title').optional().trim(), body('content').optional(), body('folder').optional(), body('tags').optional().isArray()],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, folder, tags } = req.body;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (content !== undefined) {
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }
    if (folder !== undefined) {
      updates.push(`folder = $${paramCount++}`);
      values.push(folder);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      values.push(tags);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id, req.userId);

    try {
      const result = await query(
        `UPDATE notes SET ${updates.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} AND deleted_at IS NULL RETURNING id, title, content, folder, tags, created_at, updated_at`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update note error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete note (soft delete)
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'UPDATE notes SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Sync endpoint - get updates since timestamp
router.get('/sync/since/:timestamp', async (req: AuthRequest, res: Response) => {
  try {
    const timestamp = new Date(parseInt(req.params.timestamp));

    const result = await query(
      'SELECT id, title, content, folder, tags, created_at, updated_at, deleted_at FROM notes WHERE user_id = $1 AND updated_at > $2',
      [req.userId, timestamp]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
