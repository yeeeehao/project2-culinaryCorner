import { deletePost, findPostById, updatePost } from '@/api-lib/db';
import { getMongoDb } from '@/api-lib/mongodb';
import { ValidateProps } from '@/api-lib/constants';
import { auths, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';

const upload = multer({ dest: '/tmp' });
const handler = nc(ncOpts);

if (process.env.CLOUDINARY_URL) {
  const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret,
  } = new URL(process.env.CLOUDINARY_URL);

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

handler.use(...auths);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const post = await findPostById(db, req.query.postId);
  res.json({ post });
});

handler.delete(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const db = await getMongoDb();

  const deletedPost = await deletePost(db, req.query.postId, req.user._id); // Change this line from req.query.id to req.query.postId

  if (!deletedPost) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.status(204).end();
});

handler.patch(
  ...auths,
  upload.single('recipePicture'),
  validateBody({
    type: 'object',
    properties: {
      recipeName: ValidateProps.post.recipeName,
      content: ValidateProps.post.content,
      category: ValidateProps.post.category,
    },
    additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    let recipePicture;
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: 'fill',
      });
      recipePicture = image.secure_url;
    }

    const { recipeName, content, category } = req.body;

    if (!recipeName || !content || !category) {
      console.log('Validation failed:', req.body);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
      const updatedPost = await updatePost(
        db,
        req.query.postId,
        {
          ...(recipeName && { recipeName }),
          ...(content && { content }),
          ...(category && { category }),
          ...(recipePicture && { recipePicture }),
        },
        req.user._id
      );

      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      res.status(200).json({ updatedPost });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
