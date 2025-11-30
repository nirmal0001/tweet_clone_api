# tweet_clone_api

Minimal Twitter-like REST API built with Express + Prisma.

## Quick start

1. Install:
   npm install
2. Create `.env` with at least:
   - DATABASE_URL=postgresql://USER:PASS@HOST:PORT/DB
   - SESSION_SECRET=your_secret
   - PORT (optional, default 8098)
3. Prisma:
   npx prisma generate
   npx prisma migrate dev
4. Run:
   npm run dev # or npm start

Server entry: index.js. Default port: 8098.

## Key files

- config/: prisma, passport, auth, multer, validation
- routes/: auth, profile, users, posts, comments, likes, chats, messages, followers
- controllers/: request handlers
- prisma/: schema & migrations
- uploads/: file uploads (avatars)

## Authentication

- Session-based using Passport local strategy. Use cookie jar for authenticated requests.

## Main endpoints (summary)

Auth

- POST /auth/signup {username,email,password,confirmPassword}
- POST /auth/login {username,password}
- DELETE /auth/logout

Profile

- GET /profile/me
- GET /profile/:username
- PATCH /profile/:username/edit (multipart; avatar field: avatar)

Posts

- GET /posts?order={asc|desc}&cursor=<id>&take=<int>
- GET /posts/:postId
- POST /posts {text}
- PATCH /posts/:postId
- DELETE /posts/:postId

Comments / Likes (under posts)

- GET/POST/PATCH/DELETE /posts/:postId/comments[/:commentId]
- GET/POST /posts/:postId/likes

Chats & Messages

- GET /chats[?receiverId=]
- GET /chats/:receiverId
- GET/POST/PATCH/DELETE /chats/:chatId/messages[/:messageId]

Followers

- GET /followers
- POST /followers {followingId}
- PATCH /followers/:followId {status:"accepted"}
- DELETE /followers/:followId

## Validation & errors

Rules live in config/validation.js. Validation returns descriptive messages (e.g., "Post not found", "You cannot follow yourself").

## Examples

Login and save cookie:
curl -X POST http://localhost:8098/auth/login -H "Content-Type: application/json" -d '{"username":"alice","password":"secret"}' -c cookies.txt

Create post (authenticated):
curl -X POST http://localhost:8098/posts -H "Content-Type: application/json" -d '{"text":"Hello"}' -b cookies.txt

Upload avatar:
curl -X PATCH http://localhost:8098/profile/me/edit -b cookies.txt -F "avatar=@/path/to/avatar.jpg" -F "firstName=Alice"

## Notes

- Use npx prisma studio for DB inspection.
- Replace uploads/ with cloud storage for production and use a persistent session store (e.g., Redis).
