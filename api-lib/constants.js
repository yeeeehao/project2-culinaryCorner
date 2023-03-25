export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 4, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
  },
  post: {
    recipeName: { type: 'string', minLength: 1, maxLength: 1000 },
    content: { type: 'string', minLength: 1, maxLength: 20000 },
    category: { type: 'string', minLength: 1, maxLength: 50 },
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
};
