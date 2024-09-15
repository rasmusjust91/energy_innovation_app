from fastapi import FastAPI
from src.api.routes import router
from src.models.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware


description = """
## API Description
The **Innovation Tracking API** is a RESTful service designed to help employees of a green energy company submit, track, and collaborate on innovative ideas related to renewable energy technologies. The API enables the innovation department to manage and evaluate ideas efficiently, ensuring smooth communication and development across teams.
This API provides a simple and effective way for a green energy company's innovation department to manage new ideas and collaborate on advancing renewable energy solutions.

### Key Features
- **Submit Ideas**: Employees can submit new ideas regarding renewable energy technologies, such as solar, wind, or energy storage, along with details like title, description, and category.
- **Track Ideas**: The API allows users to retrieve a list of all submitted ideas, with optional filters by category (e.g., solar, wind) or status (e.g., under review, in development).
- **Update Idea Status**: Authorized users can update the status of an idea as it progresses from submission to implementation (e.g., from "under review" to "in development").
- **Collaborate with Feedback**: Users can leave comments on ideas to provide feedback, suggestions, or encouragement, fostering collaboration and engagement.
---
"""


# Create the database tables
Base.metadata.create_all(bind=engine)

# Run app
app = FastAPI(
    title="Innovation Tracking API",
    description=description,
)

# Bind routes
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
