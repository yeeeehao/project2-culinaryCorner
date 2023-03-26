<h1 align="center">Web Project2 - Culinary Corner</h1>

<h2 align="center">Team Members</h2>

<div>Hao Ye (6238023)</div>

<div>Juan Wang (6218207)</div>

<div>Chuangjian Xia (6328003)</div>

<h2></h2>

<div align="center">

An [**Next.js**](https://github.com/zeit/next.js/) and [**MongoDB**](https://www.mongodb.com/) web application, We used the framework of [**nextjs-mongodb-app**](https://github.com/hoangvvo/nextjs-mongodb-app) when designing the webpage, and made a series of modifications according to the [**Proposal**](https://github.com/yeeeehao/project2).

:rocket: [Check out the demo](https://culinary-corner.vercel.app/) :rocket:

</div>

<h2 align="center">Features</h2>

<h3 align="center">:lock: Authentication and Account</h3>

<div align="center">

- [x] Session-based authentication ([Passport.js](https://github.com/jaredhanson/passport))
- [x] Sign up/Log in/Sign out API
- [x] Password change

</div>

<h3 align="center">:woman::man: Profile</h3>

<div align="center">

- [x] Profile picture, username, name, bio, email
- [x] Update user profile

</div>

<h3 align="center">✨ Main Functions</h3>

<div align="center">

- [x] View other people's profiles and posts
- [x] Publish recipe posts and comments
- [x] Modify and delete self-published posts
- [x] List recipes by recipe categories and list recipes by search
- [x] Get random recipe recommendations
- [] Users can bookmark recipes and view them (not done)

</div>


<h2 align="center">Guide</h2>

This project accompanies the following posts:

- [User authentication (using Passport.js)](https://hoangvvo.com/blog/next-js-and-mongodb-app-1)
- [User profile and Profile Picture](https://hoangvvo.com/blog/next-js-and-mongodb-app-2)
- [Posts and comments](https://hoangvvo.com/blog/next-js-and-mongodb-app-4)

<h3 align="center">Dependencies</h3>

This project uses the following dependencies:

- `next.js` - v9.3 or above required for **API Routes** and new [**new data fetching method**](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering).
- `react` - v16.8 or above required for **react hooks**.
- `react-dom` - v16.8 or above.
- `swr` - required for state management, may be replaced with `react-query`
- `mongodb` - may be replaced by `mongoose`.
- `passport`, `passport-local` - required for authentication.
- `next-connect` - recommended if you want to use Express/Connect middleware and easier method routing.
- `next-session`, `connect-mongo` - required for session, may be replaced with other session libraries such as `cookie-session`, `next-iron-session`, or `express-session` (`express-session` is observed not to work properly on Next.js 11+).
- `bcryptjs` - optional, may be replaced with any password-hashing library. `argon2` recommended.
- `validator` - optional but recommended, to validate email.
- `ajv` - optional but recommended, to validate request body.
- `multer` - may be replaced with any middleware that handles `multipart/form-data`
- `cloudinary` - optional, **only if** you are using [Cloudinary](https://cloudinary.com) for image upload.
- several other optional dependencies for cosmetic purposes.

<h3 align="center">Environmental variables</h3>

Environmental variables in this project include:

- `MONGODB_URI` The MongoDB Connection String (with credentials and database name)
- `WEB_URI` The _URL_ of your web app.
- `CLOUDINARY_URL` (optional, Cloudinary **only**) Cloudinary environment variable for configuration. See [this](https://cloudinary.com/documentation/node_integration#configuration).

<h3 align="center">Development</h3>

Start the development server by running `yarn dev` or `npm run dev`. Getting started by create a `.env.local` file with the above variables. See [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables).

<h2 align="center">Deployment</h2>

This project can be deployed [anywhere Next.js can be deployed](https://nextjs.org/docs/deployment). Make sure to set the environment variables using the options provided by your cloud/hosting providers.

After building using `npm run build`, simply start the server using `npm run start`.

You can also deploy this with serverless providers given the correct setup.

<h2 align="center">
  License
</h2>

<div align="center">
  
  [MIT](LICENSE)
  
</div>
