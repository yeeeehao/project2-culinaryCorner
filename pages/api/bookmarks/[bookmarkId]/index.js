import { deleteBookmark, findBookmarkById } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { auths } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);
handler.use(...auths);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const bookmark = await findBookmarkById(db, req.query.bookmarkId);
  res.json({ bookmark });
});

handler.delete(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }
  const db = await getMongoDb();
  console.log(req.query);

  const success = await deleteBookmark(db, req.query.bookmarkId);
  if (!success) {
    return res.status(400).json({ message: 'Failed to delete bookmark' });
  }
  return res.status(204).end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
