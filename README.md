# Rythm — Music Streaming Platform

Rythm is a full-stack music streaming application where listeners can explore and play uploaded tracks, while artists can publish music and organise their releases into albums.

I built this project to understand how a real-world application fits together across the frontend, backend, database, authentication, file uploads and deployment. It is inspired by the core experience of music platforms, with a focus on building the features end to end rather than just creating a static UI.

**Live application:** https://spotify-backend-1-hxjg.onrender.com/  
**Source code:** https://github.com/kshitij12375/Spotify-Backend

---

## What you can do

### For listeners
- Create an account and log in.
- Browse the available music library.
- Play audio directly in the browser.
- Browse albums and play their tracks.

### For artists
- Register with an artist account.
- Upload audio tracks with a title.
- Create albums from tracks uploaded to their account.
- Manage their own music publishing flow through the artist upload page.

Artist-only actions are protected on the backend, not just hidden in the frontend.

---

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router |
| Styling and UI | CSS, Lucide React |
| State management | Zustand |
| API communication | Axios |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs, HTTP-only cookies |
| File uploads | Multer, ImageKit |
| Deployment | Render |

---

## How it works

The React application communicates with an Express REST API. User details and music/album metadata are stored in MongoDB. Passwords are hashed with bcryptjs, and a signed JWT stored in an HTTP-only cookie is used to authenticate protected requests.

When an artist uploads a track, Multer receives the audio file and the backend sends it to ImageKit. The resulting file URL is saved with the track's title and artist reference in MongoDB. Album records reference the artist's uploaded tracks.

The frontend uses Zustand to keep authentication and music-library state available across components.

---

## Project structure

```text
Spotify-Backend/
├── backend/
│   ├── server.js
│   └── src/
│       ├── controllers/       # Authentication, music and album logic
│       ├── db/                # MongoDB connection
│       ├── middlewares/       # JWT and role-based access checks
│       ├── models/            # User, music and album schemas
│       ├── routes/            # REST API routes
│       └── services/          # ImageKit upload service
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/             # Zustand stores
│   │   └── ui/
│   └── package.json
├── package.json
└── README.md
```

---

## Run it locally

### 1. Clone the repository

```bash
git clone https://github.com/kshitij12375/Spotify-Backend.git
cd Spotify-Backend
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_long_random_jwt_secret
PRIVATE_IMAGE=your_imagekit_private_key
FRONTEND_URL=http://localhost:5173
```

Keep these values private. Do not commit your `.env` file or expose the ImageKit private key in frontend code.

### 3. Install dependencies

Run these commands from the repository root:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:3000`.

### 5. Start the frontend

Open a second terminal at the repository root:

```bash
cd frontend
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`.

---

## API overview

All API routes are prefixed with `/api`.

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register a listener or artist | Public |
| POST | `/auth/login` | Log in | Public |
| POST | `/auth/logout` | Clear the login cookie | Public |
| GET | `/auth/me` | Get the current user | Authenticated |
| POST | `/music/upload` | Upload an audio track | Artist |
| POST | `/music/album` | Create an album from owned tracks | Artist |
| GET | `/music/` | Get the music library | Authenticated |
| GET | `/music/albums` | Get albums and their tracks | Authenticated |

### Example request bodies

Register:

```json
{
  "username": "artistname",
  "email": "artist@example.com",
  "password": "your-password",
  "role": "artist"
}
```

Login:

```json
{
  "email": "artist@example.com",
  "password": "your-password"
}
```

Create an album:

```json
{
  "title": "My First Album",
  "musics": ["MUSIC_DOCUMENT_ID_1", "MUSIC_DOCUMENT_ID_2"]
}
```

For `POST /music/upload`, send a multipart form with:
- `title`: track title
- `music`: audio file

The upload route currently enforces a 25 MB file-size limit.

---

## Deployment

The application is configured to serve the built React frontend from the Express server in production. The repository root package scripts install the frontend and backend dependencies, build the Vite app, and start the backend.

For a Render deployment using the repository root:

- **Build command:** `npm run build`
- **Start command:** `npm start`

Set the backend environment variables in the Render service dashboard:
- `MONGO_URI`
- `SECRET_KEY`
- `PRIVATE_IMAGE`
- `NODE_ENV=production`

Render supplies the `PORT` value at runtime. If you deploy the frontend and backend as separate services instead, configure the frontend API base URL and the backend CORS origin to match those service URLs.

---

## Things I learned

Working on Rythm gave me practical experience with:
- Designing REST APIs and connecting them to a React application.
- Implementing password hashing and JWT-based authentication.
- Protecting routes using user roles and server-side middleware.
- Modelling relationships between users, tracks and albums with Mongoose.
- Handling multipart audio uploads and storing files with a cloud media service.
- Managing shared application state with Zustand.
- Building and deploying a full-stack application.

## Current scope

This project focuses on authentication, artist uploads, a shared music library, albums and browser-based audio playback. Features such as playlists, search, likes, recommendations and a full queue-based player are not part of the current implementation.

---

## Author

**Kshitij Srivastava**

- GitHub: [kshitij12375](https://github.com/kshitij12375)

