# Cardio Pilot

Production-ready Next.js cholesterol tracking agent for lipid reports and reviewed meal-photo nutrition logs.

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
- `POST /api/meal/analyze`
- `POST /api/meal/save`
- `GET /api/dashboard`
- `GET /api/progress`
- `GET /api/coach`

## Notes

The meal workflow intentionally pauses on `/meal/review` so users can edit foods, quantities, and nutrition totals before saving. The app stores both the raw AI prediction and the user-corrected record.
