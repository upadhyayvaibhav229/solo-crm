# Backend API Routes

Base URL: `http://localhost:8000`

## Admin

| Method | URL | Description |
| --- | --- | --- |
| GET | `/admin/` | Django admin |

## Auth

Prefix: `/api/auth/`

| Method | URL | Description |
| --- | --- | --- |
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Get JWT access and refresh tokens |
| POST | `/api/auth/login/refresh/` | Refresh JWT access token |
| GET | `/api/auth/me/` | Get current authenticated user |
| POST | `/api/auth/logout/` | Blacklist/logout JWT token |

## Leads

Prefix: `/api/leads/`

| Method | URL | Description |
| --- | --- | --- |
| GET | `/api/leads/` | List leads for current user |
| POST | `/api/leads/` | Create lead |
| GET | `/api/leads/{id}/` | Get lead details |
| PUT | `/api/leads/{id}/` | Replace lead |
| PATCH | `/api/leads/{id}/` | Update lead partially |
| DELETE | `/api/leads/{id}/` | Delete lead |

## Followups

Prefix: `/api/leads/followups/`

| Method | URL | Description |
| --- | --- | --- |
| GET | `/api/leads/followups/` | List followups for current user's leads |
| POST | `/api/leads/followups/` | Create followup |
| GET | `/api/leads/followups/{id}/` | Get followup details |
| PUT | `/api/leads/followups/{id}/` | Replace followup |
| PATCH | `/api/leads/followups/{id}/` | Update followup partially |
| DELETE | `/api/leads/followups/{id}/` | Delete followup |

## Calls

Prefix: `/api/leads/calls/`

| Method | URL | Description |
| --- | --- | --- |
| GET | `/api/leads/calls/` | List calls for current user's leads |
| POST | `/api/leads/calls/` | Create call |
| GET | `/api/leads/calls/{id}/` | Get call details |
| PUT | `/api/leads/calls/{id}/` | Replace call |
| PATCH | `/api/leads/calls/{id}/` | Update call partially |
| DELETE | `/api/leads/calls/{id}/` | Delete call |

## Router Root

| Method | URL | Description |
| --- | --- | --- |
| GET | `/api/leads/` | DRF router API root / lead list endpoint |

## Notes

- Authenticated endpoints require a JWT access token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

- `{id}` means the database id of the lead, followup, or call resource.
