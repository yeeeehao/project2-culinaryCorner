import { ValidateProps } from '@/api-lib/constants';
import { findBookmarks, insertBookmark } from '@/api-lib/db/bookmark';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const bookmarks = await findBookmarks(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by
  );

  res.json({ bookmarks });
});

handler.post(
  ...auths,
  async (req, res, next) => {
    try {
      await validateBody({
        type: 'object',
        properties: {
          recipeName: ValidateProps.bookmark.recipeName,
          recipeId: ValidateProps.bookmark.recipeId,
        },
        required: ['recipeName', 'recipeId'],
        additionalProperties: true,
      })(req, res, next);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Bad Request' });
    }
  },
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const bookmark = await insertBookmark(db, {
      recipeName: req.body.recipeName,
      recipeId: req.body.recipeId,
      creatorId: req.user._id,
    });

    return res.json({ bookmark });
  }
);

export const config = {
  api: {
    bodyParser: true,
  },
};

export default handler;
