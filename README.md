# Track It

Production-ready Next.js app for food nutrition analysis and cholesterol tracking.

## Stack

- Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style components
- MongoDB Atlas with Mongoose models
- OpenAI Responses API with vision and structured Zod output
- Recharts dashboards
- React Hook Form-ready schemas with Zod

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` and `MONGODB_URI` in `.env.local` or Vercel.

## Routes

- `POST /api/report/upload`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `POST /api/meal/analyze`
- `GET /api/dashboard`

## Notes

The food-photo scanner analyzes photos on the fly through the LLM and does not store food photos or nutrition results in MongoDB. Cholesterol tracking stores extracted lipid report data in `lipid_reports` and a persistent dashboard graph snapshot in `cholesterol_trends`. The graph snapshot is rebuilt from every stored report if it ever falls out of sync.

Cholesterol report and dashboard APIs use a signed HTTP-only session cookie. They do not trust a `userId` sent from the browser.

Signup requires acceptance of Terms and Conditions. The user record stores consent status, consent timestamp, terms version, IP, and user agent.
