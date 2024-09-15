from fastapi.security.api_key import APIKeyHeader
from fastapi import HTTPException, Depends


API_KEY = "mysecretapikey"
api_key_header = APIKeyHeader(name="X-API-KEY")

def verify_api_key(api_key: str = Depends(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

# Add `Depends(verify_api_key)` in the endpoints to enforce authentication.