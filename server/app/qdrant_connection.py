from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
import uuid


client = QdrantClient(url="http://localhost:6333")


def create_collection(collection_name: str):
    try:
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=1536, distance=Distance.DOT),
        )
        print(f"successfully created embeddings with this name {collection_name}.")
    except:
        print("Embeddings with this name already exists....")
        pass

def store_embeddings(collection_name: str, input: str, embeddings: list):
    try:
        unique_id = uuid.uuid4()
        operation_info = client.upsert(
            collection_name=collection_name,
            wait=True,
            points=[
                PointStruct(id=str(unique_id), vector=embeddings, payload={"query": input}),
            ],
        )
        print("Embeddings stored successfully", operation_info)
    except:
        print("Issue while storing the embeddings")

def similarity_search(embeddings: list, collection_name: str, question: str):
    search_result = client.query_points(
            collection_name=collection_name,
            query=embeddings,
            with_payload=True,
            limit=3
        ).points
    return search_result