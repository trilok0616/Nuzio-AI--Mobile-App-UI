# Nuzio Frontend Integration

Local base URL:

```text
http://localhost:5000/api/v1
```

If testing on a physical mobile phone, do not use `localhost`; use your computer's LAN IP or deploy the backend to an HTTPS URL.

## Frontend flow

1. Login -> `/auth/login` or `/auth/google`
2. Language + Location -> `PATCH /users/language-location`
3. Profession -> `PATCH /users/profession`
4. Niches -> `PATCH /users/interests`
5. Voice -> `GET /voices` and `PATCH /users/voice`
6. Finish setup -> `POST /users/onboarding/complete`
7. Brief -> `GET /brief/today`
8. Discover -> `GET /news/feed`
9. Saved -> `/saved`
10. Settings -> `/users/me`
11. Billing -> `/billing/*`

## Basic API helper

```js
async function api(path, options = {}) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}
```

In the real mobile app, add automatic refresh-token handling when a protected request returns HTTP 401.
