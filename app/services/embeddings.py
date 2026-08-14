import os
import logging
from typing import List

logger = logging.getLogger("tvpl_downloader.rag.embeddings")

_client = None

def get_client():
    global _client
    if _client is None:
        from openai import OpenAI
        api_key = os.environ.get("DASHSCOPE_API_KEY") or os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("DASHSCOPE_API_KEY not set. Get free key at dashscope.aliyuncs.com")
        _client = OpenAI(
            base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
            api_key=api_key
        )
    return _client

def get_embedding(text: str, model: str = "text-embedding-v3") -> List[float]:
    client = get_client()
    response = client.embeddings.create(model=model, input=text)
    return response.data[0].embedding

def get_embeddings_batch(texts: List[str], model: str = "text-embedding-v3") -> List[List[float]]:
    client = get_client()
    all_embeddings = []
    batch_size = 50
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        response = client.embeddings.create(model=model, input=batch)
        batch_embeddings = [item.embedding for item in response.data]
        all_embeddings.extend(batch_embeddings)
        logger.info(f"Embedded batch {i//batch_size + 1} ({len(batch)} texts)")
    return all_embeddings
