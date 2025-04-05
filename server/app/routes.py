from fastapi import APIRouter, UploadFile, File
from typing import List

from . structure import (
    QueryRequest, CheckEmail, LoginDetails,
    UploadRequest, Configuration
)

from . qdrant_connection import (
    create_collection,
    store_embeddings,
    similarity_search, similarity_search_answer
)

from . openai_client import (
    convert_vector
)

from . functions import (
    read_json_file, is_valid_email,
    create_jwt_token, decode_jwt_token,
    read_upload_file_db, write_upload_file_db,
    flatten_2d_list, remove_domain, set_environment_credentials
)

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

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




@router.post("/uploadfile")
async def upload_file(token: str, files: List[UploadFile] = File(...)):
    # Validate the token (decode the JWT and extract email)
    email = decode_jwt_token(token, secret_key)['email']
    print(email)  # You can use the email in your logic
    try:
        import json
        import os
        FILE_PATH = "./db/configuration.json"
        if os.path.exists(FILE_PATH):
            with open(FILE_PATH, "r") as file:
                try:
                    configurations = json.load(file)
                    
                except json.JSONDecodeError:
                    configurations = {}
            if len(configurations[email]["openai_key"]) >0:
                set_environment_credentials(configurations[email]["openai_key"])
        else:
            configurations = {}
    except: 
        pass
    
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
        
        print("Stared loading the file")
        file_path = (
                f"./media/files/{file_uuid}.pdf"
            )
        loader = PyPDFLoader(file_path)
        pages = loader.load_and_split()

        print(len(pages))
        
        required_documents = []
        for page in pages:
            print(page)
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            texts = text_splitter.split_text(page.page_content)
            required_documents.append(texts)
        
        copy_list = flatten_2d_list(required_documents)
        

        # Add this file's details to the email's section in the database
        upload_db[email].append({
            "filename": filename,
            "uuid": file_uuid,
            "size": file_size
        })

        collection_name = email
        create_collection(collection_name)

        for count in range(len(copy_list)):

            created_vectors = convert_vector(copy_list[count])
            store_embeddings(collection_name, copy_list[count], created_vectors)

    # Write the updated JSON data back to the file
    write_upload_file_db(upload_db_path, upload_db)

    return {"success": True, "files": file_details}


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


@router.post("/configuration")
def configuration(data: Configuration, token: str):
    import json
    import os

    email = decode_jwt_token(token, secret_key)["email"]

    print(data.openai_key)

    set_environment_credentials(data.openai_key)

    # Read existing data

    FILE_PATH = "./db/configuration.json"
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, "r") as file:
            try:
                configurations = json.load(file)
                
            except json.JSONDecodeError:
                configurations = {}
    else:
        configurations = {}

    # Check if user already exists, if yes, update only
    if email in configurations:
        configurations[email].update({
            "openai_key": data.openai_key,
            "embedding_model": data.embedding_model,
            "retrival_model": data.retrival_model
        })
    else:
        # If email does not exist, add new entry
        configurations[email] = {
            "openai_key": data.openai_key,
            "embedding_model": data.embedding_model,
            "retrival_model": data.retrival_model
        }

    # Save back to the JSON file
    with open(FILE_PATH, "w") as file:
        json.dump(configurations, file, indent=4)

    return {"success": True, "message": "Configuration saved successfully"}


@router.get("/configuration")
def get_configuration(token: str):
    import json
    import os

    email = decode_jwt_token(token, secret_key)["email"]

    FILE_PATH = "./db/configuration.json"
    if not os.path.exists(FILE_PATH):
        return {"success": False, "message": "No configuration found"}

    with open(FILE_PATH, "r") as file:
        try:
            configurations = json.load(file)
        except json.JSONDecodeError:
            return {"success": False, "message": "Invalid configuration data"}

    if email in configurations:
        return {"success": True, "configuration": configurations[email]}
    
    return {"success": False, "message": "No configuration found for this user"}


@router.post("/answers")
def answers(data: QueryRequest, token: str):
    email = decode_jwt_token(token, secret_key)["email"]
    vector = convert_vector(data.user_query)
    results = similarity_search_answer(embeddings = vector, collection_name=email, question= data.user_query)
    final_recommend = [result.payload["query"] for result in results]

    llm = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key="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"
    )

    messages = [
    (
        "system",
        """You are a helpful QA chat bot based on context answer the question correctly
        dont go out of box, if the question is not not in context dont answer
        context: {final_recommend[0]}
        """,
    ),
        ("human", data.user_query),
    ]
    ai_msg = llm.invoke(messages)
    print()

    return {
        "success": True,
        "recommend": ai_msg.content
    }








