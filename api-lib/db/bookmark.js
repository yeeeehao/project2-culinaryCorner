import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findBookmarkById(db, id) {
  const bookmarks = await db
    .collection('bookmarks')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  if (!bookmarks[0]) return null;
  return bookmarks[0];
}

export async function findBookmarks(db, before, creatorId, limit = 100) {
  return db
    .collection('bookmarks')
    .aggregate([
      {
        $match: {
          ...(creatorId && { creatorId: new ObjectId(creatorId) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}

export async function insertBookmark(db, { recipeName, recipeId, creatorId }) {
  const existingBookmark = await db
    .collection('bookmarks')
    .findOne({ creatorId: new ObjectId(creatorId), recipeId });

  if (existingBookmark) {
    return { alreadyExists: true };
  }

  const bookmark = {
    recipeName,
    recipeId,
    creatorId,
    createdAt: new Date(),
  };

  const { insertedId } = await db.collection('bookmarks').insertOne(bookmark);
  bookmark._id = insertedId;
  return bookmark;
}

export async function deleteBookmark(db, id) {
  const { deletedCount } = await db.collection('bookmarks').deleteOne({
    _id: new ObjectId(id),
  });

  return deletedCount > 0;
}
