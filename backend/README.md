# Innovation Tracking API

This is a FastAPI-based API for submitting and tracking innovation ideas for a green energy company.

## Endpoints

- **POST /ideas**: Submit a new idea
- **GET /ideas**: Retrieve ideas (with optional filters)
- **PUT /ideas/{id}**: Update the status of an idea
- **POST /ideas/{id}/comments**: Add a comment to an idea

### Authentication

Use the `X-API-KEY` header with the correct API key.

### Run the App

```bash
uvicorn main:app --reload
```

### Documentation
FastAPI automatically generates API documentation. You can visit:

Swagger UI: http://127.0.0.1:8000/docs
Redoc: http://127.0.0.1:8000/redoc