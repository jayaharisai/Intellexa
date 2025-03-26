from openai import OpenAI

client = OpenAI()



def convert_vector(text: str):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )

    embedding_vector = response.data[0].embedding
    return embedding_vector


