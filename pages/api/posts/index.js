import { ValidateProps } from '@/api-lib/constants';
import { findPosts, insertPost } from '@/api-lib/db';
import { auths, validateBody } from '@/api-lib/middlewares';
import { getMongoDb } from '@/api-lib/mongodb';
import { ncOpts } from '@/api-lib/nc';
import { UploadStream } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import nc from 'next-connect';

const upload = multer({
  dest: '/tmp',
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
});
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

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const posts = await findPosts(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  res.json({ posts });
});

handler.post(
  ...auths,
  upload.single('recipePicture'), // handle the recipePicture file
  async (req, res, next) => {
    try {
      await validateBody({
        type: 'object',
        properties: {
          recipeName: ValidateProps.post.recipeName,
          content: ValidateProps.post.content,
          category: ValidateProps.post.category,
        },
        required: ['recipeName', 'content', 'category'],
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

    let recipePicture;
    if (req.file) {
      // check if file exists
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 512,
        height: 512,
        crop: 'fill',
      });
      recipePicture = image.secure_url;
    }

    const post = await insertPost(db, {
      recipeName: req.body.recipeName,
      content: req.body.content,
      category: req.body.category,
      recipePicture, // assign recipePicture
      creatorId: req.user._id,
    });

    return res.json({ post });
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
