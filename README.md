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
- `POST /api/meal/analyze`
- `POST /api/meal/save`
- `GET /api/dashboard`

## Notes

The streamlined app has login, cholesterol report upload, a food-photo nutrition scanner, and a dashboard that plainly shows whether LDL is reducing.
