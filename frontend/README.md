# AI Research Assistant frontend

This React app is separate from the FastAPI backend. It uses Tailwind CSS for
styling, Recoil for the chat state, and Axios for requests.
Assistant replies support Markdown, including GitHub Flavored Markdown tables.

The backend stores each successful chat turn in the MongoDB database
`ai_research_assistant`, in the `conversations` collection. Make sure MongoDB is
running and `MONGODB_URI` is set in `ai-service/.env`. The database and
collection appear in MongoDB Compass after the first successful chat is saved.

## Run locally

Start the backend in one terminal:

```powershell
cd ai-service
uvicorn main:app --reload
```

In another terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. During development, Vite forwards requests
from `/api/chat` to `http://127.0.0.1:8000/chat`, so the backend does not need
frontend CORS changes.

To point Axios at another API base URL, set `VITE_API_BASE_URL` before starting
Vite. The default `/api` base URL uses the development proxy above.

## Deploy to Vercel

Create two Vercel projects from this repository:

- Frontend project root directory: `frontend`
- Backend project root directory: `ai-service`

In the frontend project's environment variables, set `VITE_API_BASE_URL` to the
backend project's deployed origin (for example, `https://your-api.vercel.app`,
without `/chat`). In the backend project, set `FRONTEND_ORIGINS` to the
frontend's deployed origin.

Set `GROQ_API_KEY` and `MONGODB_URI` in the backend project's Vercel environment
settings. Do not put these secrets in frontend variables or commit them to Git.
Redeploy both projects after changing environment variables.
