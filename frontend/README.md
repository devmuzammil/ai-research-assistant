# AI Research Assistant frontend

This React app is separate from the FastAPI backend. It uses Tailwind CSS for
styling, Recoil for the chat state, and Axios for requests.

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
