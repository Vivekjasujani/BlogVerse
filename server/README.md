# BlogVerse API

This Express API provides authentication, posts, profiles, likes, and featured-image storage using MongoDB and Cloudinary.

## Local setup

1. Copy `.env.example` to `.env` and fill in MongoDB Atlas, JWT, and Cloudinary values.
2. Run `npm install` from this `server` directory.
3. Run `npm run dev` from this directory.
4. The health check is available at `GET http://localhost:5000/api/health`.

## API routes

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account and session |
| POST | `/api/auth/login` | No | Create a session |
| POST | `/api/auth/logout` | No | Clear the session |
| GET | `/api/auth/me` | Yes | Current signed-in user |
| GET | `/api/posts` | No | Paginated published posts |
| GET | `/api/posts/:slug` | No | One published post |
| POST | `/api/posts` | Yes | Create post; multipart field: `image` |
| PATCH | `/api/posts/:postId` | Owner | Update a post |
| DELETE | `/api/posts/:postId` | Owner | Delete a post and featured image |
| GET | `/api/posts/:postId/like` | Yes | Current user's like status |
| POST | `/api/posts/:postId/like` | Yes | Toggle a like |
| GET | `/api/profiles/:userId` | No | Public profile and stats |
| GET | `/api/profiles/:userId/posts` | No | User's published posts |
| PATCH | `/api/profiles/me` | Yes | Update location/about |
| GET | `/api/profiles/me/liked-posts` | Yes | Current user's liked posts |

## Deployment

Deploy this directory as a Node web service. Use `npm install` as the build command and `npm start` as the start command. Set `NODE_ENV=production` and `CLIENT_URL` to the deployed frontend URL. Multiple allowed frontend origins can be comma-separated in `CLIENT_URL`.
