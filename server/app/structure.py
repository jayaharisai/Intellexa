from pydantic import BaseModel

class QueryRequest(BaseModel):
    user_query: str

class CheckEmail(BaseModel):
    email: str

class LoginDetails(BaseModel):
    email: str
    password: str

class UploadRequest(BaseModel):
    token: str