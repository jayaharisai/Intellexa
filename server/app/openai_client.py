from openai import OpenAI

# try:
#     client = OpenAI()
# except:
#     pass



def convert_vector(text: str):
    client = OpenAI()
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )

    embedding_vector = response.data[0].embedding
    return embedding_vector


