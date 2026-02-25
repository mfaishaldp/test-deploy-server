# Movie API Documentation

## Endpoints :

List of available endpoints:

- `POST /register`
- `POST /login`

Routes below need authentication:

- `GET /movies`
- `POST /movies`

Routes below need authorization:

> The request user should be an admin

- `DELETE /movies/:id`
- `PUT /movies/:id`
- `PATCH /movies/:id/show-status`
- `PATCH /movies/:id/cover-url`

&nbsp;

## 1. POST /register

Description:

- Register a new user into the system

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. POST /login

Description:

- Login into the system

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "Authorization": "Bearer access_token"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid email or password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 3. GET /movies

Description:

- Get all movie from the database

Request:

- headers:

```json
{
  "Authorization": "Bearer access_token"
}
```

- body:

```json
{
  "title": "string",
  "overview": "string",
  "rating": "integer",
  "poster": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "title": "string",
    "overview": "string",
    "rating": "integer",
    "poster": "string"
  }
]
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 4. POST /movies

Description:

- Create a new movie

Request:

- headers:

```json
{
  "Authorization": "Bearer access_token"
}
```

- body:

```json
{
  "title": "string",
  "overview": "string",
  "rating": "integer",
  "poster": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "title": "string",
  "overview": "string",
  "rating": "integer",
  "poster": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 5. DELETE /movies/:id

Description:

- Delete movie by id

Request:

- params:

```json
{
  "id": "integer (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer access_token"
}
```

_Response (200 - OK)_

```json
{
  "message": "Movie id 1 has been deleted"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie id 1 not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 6. PUT /movies/:id

Description:

- Update movie by id

Request:

- params:

```json
{
  "id": "integer (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer access_token"
}
```

- body:

```json
{
  "title": "string",
  "overview": "string",
  "rating": "integer",
  "poster": "string"
}
```

_Response (200 - OK)_

```json
{
  "id": "integer",
  "title": "string",
  "overview": "string",
  "rating": "integer",
  "poster": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie id 1 not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 7. PATCH /movies/:id/show-status

Description:

- Update movie show status by id

Request:

- params:

```json
{
  "id": "integer (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer access_token"
}
```

_Response (200 - OK)_

```json
{
  "id": "integer",
  "title": "string",
  "overview": "string",
  "rating": "integer",
  "poster": "string",
  "isShowing": "boolean"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie id 1 not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 8. PATCH /movies/:id/cover-url

Description:

- Update movie cover url by id

Request:

- params:

```json
{
  "id": "integer (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer access_token",
  "Content-Type": "multipart/form-data"
}
```

- Body:

```json
{
  "image": "file"
}
```

_Response (200 - OK)_

```json
{
  "message": "Movie <name> cover url has been updated"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie id 1 not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

### GET /movies/now-showing

- headers:

```json
{
  "Authorization": "Bearer access_token"
}
```

_Response (200 - OK)_

```json
[
  {
    "tmdbId": "number",
    "title": "string",
    "synopsis": "string",
    "releaseDate": "string",
    "coverUrl": "string",
    "rating": "float"
  }
]
```
