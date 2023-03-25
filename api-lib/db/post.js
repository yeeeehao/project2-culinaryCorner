import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findPostById(db, id) {
  const posts = await db
    .collection('posts')
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
  if (!posts[0]) return null;
  return posts[0];
}

export async function findPosts(db, before, by, limit = 10) {
  return db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
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

export async function insertPost(
  db,
  { recipeName, content, category, recipePicture, creatorId }
) {
  const post = {
    recipeName,
    content,
    category,
    recipePicture,
    creatorId,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('posts').insertOne(post);
  post._id = insertedId;
  return post;
}

export async function deletePost(db, id, creatorId) {
  const { deletedCount } = await db.collection('posts').deleteOne({
    _id: new ObjectId(id),
    creatorId: new ObjectId(creatorId),
  });

  return deletedCount > 0;
}

export async function updatePost(db, postId, updates, userId) {
  const { recipeName, content, category } = updates;

  const result = await db
    .collection('posts')
    .findOneAndUpdate(
      { _id: new ObjectId(postId), creatorId: new ObjectId(userId) },
      { $set: { recipeName, content, category } },
      { returnOriginal: false }
    );

  if (!result.value) return null;

  // Re-populate creator field
  const postWithCreator = await findPostById(db, postId);
  return postWithCreator;
}
