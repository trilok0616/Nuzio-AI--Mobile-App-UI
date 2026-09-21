# Nuzio AI Backend

Node.js + Express + MongoDB backend for the Nuzio AI mobile news app.

## Implemented

- Email/password registration and login
- JWT access tokens + rotating database-backed refresh tokens
- Optional Google Sign-In verification
- Language + location preference storage
- Profession selection
- Interest/niche selection
- Voice selection: Aria, Kai, Meera
- Onboarding completion
- Discover news endpoint
- Personalized news feed
- Daily brief endpoint
- Saved articles
- User profile and notification settings
- Optional Stripe subscription checkout, customer portal and webhook
- Security headers, CORS, rate limiting and input validation
- Demo news fallback so development works without a news API key

## Requirements

- Node.js 20+
- MongoDB 7+ or MongoDB Atlas

## Start locally

1. Copy the environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Put a long random value in `JWT_ACCESS_SECRET`.

3. Start MongoDB. If Docker is installed:

```bash
docker compose up -d
```

4. Install packages:

```bash
npm install
```

5. Start the API:

```bash
npm run dev
```

6. Test:

```text
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "service": "nuzio-backend"
}
```

## Figma screen -> backend API

| Screen | API |
|---|---|
| Splash | No backend call |
| Language + Location | `PATCH /api/v1/users/language-location` |
| Login | `POST /api/v1/auth/login` or `/auth/google` |
| Profession | `PATCH /api/v1/users/profession` |
| Niches | `PATCH /api/v1/users/interests` |
| Voice | `GET /api/v1/voices`, `PATCH /api/v1/users/voice` |
| Finish Setup | `POST /api/v1/users/onboarding/complete` |
| Brief | `GET /api/v1/brief/today` |
| Discover | `GET /api/v1/news` or `/api/v1/news/feed` |
| Saved | `GET/POST/DELETE /api/v1/saved` |
| Settings | `GET/PATCH /api/v1/users/me` |
| Billing | `/api/v1/billing/*` |

## Authentication

### Register

`POST /api/v1/auth/register`

```json
{
  "name": "Demo User",
  "email": "demo@nuzio.app",
  "password": "Password123"
}
```

### Login

`POST /api/v1/auth/login`

```json
{
  "email": "demo@nuzio.app",
  "password": "Password123"
}
```

The response returns:

- `accessToken`
- `refreshToken`
- `user`

For protected endpoints send:

```text
Authorization: Bearer ACCESS_TOKEN
```

When the access token expires:

`POST /api/v1/auth/refresh`

```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

## Onboarding examples

### Language + Location

`PATCH /api/v1/users/language-location`

```json
{
  "language": "en",
  "locationPermission": true,
  "location": {
    "city": "Jaipur",
    "country": "India"
  }
}
```

The mobile frontend should request operating-system location permission. The backend only stores the result/data sent by the frontend.

### Profession

`PATCH /api/v1/users/profession`

```json
{
  "profession": "Software Developer"
}
```

### Interests

`PATCH /api/v1/users/interests`

```json
{
  "interests": ["Technology", "Artificial Intelligence", "Business"]
}
```

### Voice

`PATCH /api/v1/users/voice`

```json
{
  "voice": "aria"
}
```

Valid values: `aria`, `kai`, `meera`.

### Complete onboarding

`POST /api/v1/users/onboarding/complete`

## Discover and personalized feed

General news:

```text
GET /api/v1/news
GET /api/v1/news?category=technology
GET /api/v1/news?q=artificial%20intelligence
```

Personalized:

```text
GET /api/v1/news/feed
```

If `NEWS_API_KEY` is empty, the backend returns bundled demo articles. This lets the frontend be integrated before a live news provider is selected.

## Daily brief

```text
GET /api/v1/brief/today
```

Version 1 selects the top personalized stories and returns compact summaries. A production AI summarizer can later replace this summarization step without changing the mobile API.

## Saved stories

Save:

`POST /api/v1/saved`

```json
{
  "articleId": "abc123",
  "title": "Example story",
  "summary": "Short summary",
  "category": "technology",
  "source": "Example News",
  "url": "https://example.com/story",
  "publishedAt": "2026-09-21T10:00:00.000Z"
}
```

List:

`GET /api/v1/saved`

Delete:

`DELETE /api/v1/saved/:articleId`

## Billing

The billing code is included, but real payments require Stripe credentials.

```text
GET  /api/v1/billing/subscription
POST /api/v1/billing/checkout
POST /api/v1/billing/portal
POST /api/v1/billing/webhook
```

Do not store card numbers in MongoDB.

## External credentials still required

These features are implemented but require real credentials:

- Google login -> `GOOGLE_CLIENT_ID`
- Live news -> `NEWS_API_KEY`
- Stripe -> `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`

## Before production launch

Add production deployment configuration, HTTPS, managed secrets, tests/CI, password reset/email verification, account deletion/data export, monitoring, database backups, news-content licensing review, and privacy/consent handling.
