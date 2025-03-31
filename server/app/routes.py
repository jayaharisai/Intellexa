from fastapi import APIRouter, UploadFile, File
from typing import List

from . structure import (
    QueryRequest, CheckEmail, LoginDetails,
    UploadRequest
)

from . qdrant_connection import (
    create_collection,
    store_embeddings,
    similarity_search
)

from . openai_client import (
    convert_vector
)

from . functions import (
    read_json_file, is_valid_email,
    create_jwt_token, decode_jwt_token
)

router = APIRouter()

secret_key = "klsdjufhglwikrbfgjuwikdebfjuwswdshjfwed"

@router.post("/query")
def query(data: QueryRequest):
    vector = convert_vector(data.user_query)
    collection_name = "SearchEmbeddings"

    create_collection(collection_name)
    store_embeddings(collection_name, data.user_query, vector)
   

    return {
        "success": True,
        "message": f"Received query: {data.user_query}"
    }

@router.post("/recommend")
def recommend(data: QueryRequest):
    vector = convert_vector(data.user_query)
    results = similarity_search(embeddings = vector, collection_name="SearchEmbeddings", question= data.user_query)
    final_recommend = [result.payload["query"] for result in results]
    return {
        "success": True,
        "recommend": final_recommend
    }

@router.post("/check_email")
def check_email(data: CheckEmail):

    if not is_valid_email(data.email):
        return {"success": False, "message": "Not a valid email format."}

    file_path = "./db/user_details.json"
    json_data = read_json_file(file_path)
    if len(json_data) == 0:
        return {"success": False, "message": "No account with this email"}
    else:
        for email in json_data:
            if email["email"] == data.email:
                return {"success": True, "message": "Email exists"}

    return {"success": False,"message": "No account with this email"}

@router.post("/register_check_email")
def register_check_email(data: CheckEmail):

    if not is_valid_email(data.email):
        return {"success": False, "message": "Not a valid email format."}

    file_path = "./db/user_details.json"
    json_data = read_json_file(file_path)


    for email in json_data:
        if email["email"] == data.email:
            return {"success": False, "message": "Email exists"}

    return {"success": True,"message": "No account with this email"}

@router.post("/login")
def login(data: LoginDetails):

    if not is_valid_email(data.email):
        return {"success": False, "message": "Not a valid email format."}
    
    file_path = "./db/user_details.json"
    json_data = read_json_file(file_path)

    if len(json_data) == 0:
        return {"success": False, "message": "No account with this email"}
    else:
        for email in json_data:
            if email["email"] == data.email:
                if email["password"] == data.password:

                    token = create_jwt_token(
                        {"email": data.email},
                        secret_key
                    )

                    return {"success": True, "token": token, "message": "Login successful"}
                return {"success": False, "message": "Password incorrect"}
        return {"success": False, "message": "Email not exists."}

    return {"success": False, "message": "Email and password entered are incorrect."}

@router.post("/register")
def register(data: LoginDetails):
    if not is_valid_email(data.email):
        return {"success": False, "message": "Not a valid email format."}
    
    file_path = "./db/user_details.json"
    json_data = read_json_file(file_path)

    for email in json_data:
        if email["email"] == data.email:
            return {"success": True, "message": "Email already exists."}
    
    registered_data = {"email": data.email, "password": data.password}
    json_data.append(registered_data)
    
    import json
    with open(file_path, "w") as file:
        json.dump(json_data, file, indent=4)
    
    return {"success": True, "message": "Registration successful"}



def read_upload_file_db(file_path: str):
    import os
    import json
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            return json.load(f)
    return {}

# Function to write the updated data back to the upload files JSON
def write_upload_file_db(file_path: str, data: dict):
    import json
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)


@router.post("/uploadfile")
async def upload_file(token: str, files: List[UploadFile] = File(...)):
    # Validate the token (decode the JWT and extract email)
    email = decode_jwt_token(token, secret_key)['email']
    print(email)  # You can use the email in your logic
    
    UPLOAD_DIR = "./media/files"  # Directory where files will be saved
    import os
    os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the directory exists

    # Path to the JSON file that stores uploaded files info
    upload_db_path = "./db/upload_files.json"

    # Read the current upload records
    upload_db = read_upload_file_db(upload_db_path)

    # Ensure the email entry exists in the JSON
    if email not in upload_db:
        upload_db[email] = []  # Create a new entry for the email if it doesn't exist

    file_details = []

    for file in files:
        # Check that the file is a PDF
        if not file.filename.endswith(".pdf"):
            return {"success": False, "message": "Only PDF files are allowed."}

        # Generate a UUID for the file
        import uuid
        file_uuid = str(uuid.uuid4())
        
        # Get the filename and file content
        filename = file.filename
        file_content = await file.read() 
        file_size = len(file_content)
        
        # Reset file pointer after reading
        await file.seek(0)

        # Save the file with the generated UUID as the name
        file_path = os.path.join(UPLOAD_DIR, file_uuid + ".pdf") 
        
        with open(file_path, "wb") as f:
            f.write(file_content)

        # Append file details to the email's list in the JSON
        file_details.append({
            "filename": filename,
            "uuid": file_uuid,
            "size": file_size
        })

        # Add this file's details to the email's section in the database
        upload_db[email].append({
            "filename": filename,
            "uuid": file_uuid,
            "size": file_size
        })

    # Write the updated JSON data back to the file
    write_upload_file_db(upload_db_path, upload_db)

    return {"success": True, "files": file_details}


def read_upload_file_db(file_path: str):
    import os
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            import json
            return json.load(f)
    return {}

@router.get("/get_uploaded_files")
async def get_uploaded_files(token: str):
    # Validate the token and extract the email
    email = decode_jwt_token(token, secret_key)["email"]

    # Path to the JSON file that stores uploaded files info
    upload_db_path = "./db/upload_files.json"

    # Read the current upload records
    upload_db = read_upload_file_db(upload_db_path)

    # Check if the email exists in the database
    if email not in upload_db:
        return { "success": False, "message": "No files found for this email."}

    # Return the list of files uploaded by the given email
    uploaded_files = upload_db[email]

    return {"success": True, "files": uploaded_files}


















