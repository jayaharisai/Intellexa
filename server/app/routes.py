from fastapi import APIRouter

from . structure import (
    QueryRequest
)

from . qdrant_connection import (
    create_collection,
    store_embeddings,
    similarity_search
)

from . openai_client import (
    convert_vector
)

router = APIRouter()

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