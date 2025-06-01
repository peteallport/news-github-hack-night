import weaviate
import os
from weaviate.classes.config import Configure, Property, DataType
from weaviate.classes.query import Filter
from datetime import datetime, timedelta

# Load environment variables
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")

if not weaviate_url or not weaviate_api_key:
    raise ValueError("Please set WEAVIATE_URL and WEAVIATE_API_KEY environment variables")

# Connect to Weaviate
client = weaviate.connect_to_weaviate_cloud(
    cluster_url=weaviate_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key=weaviate_api_key)
)

try:
    # Check if News collection exists
    try:
        news = client.collections.get("News")
        print("Found existing News collection")
    except Exception as e:
        print(f"News collection not found: {e}")
        print("Creating News collection without vectorizer...")
        news_collection = client.collections.create(
            name="News",
            properties=[
                Property(name="title", data_type=DataType.TEXT),
                Property(name="content", data_type=DataType.TEXT),
                Property(name="url", data_type=DataType.TEXT),
                Property(name="published_date", data_type=DataType.TEXT),
                Property(name="source", data_type=DataType.TEXT)
            ]
        )
        print("Successfully created News collection")
        news = client.collections.get("News")
    
    # Query for news articles
    print("\nQuerying for news articles...")
    
    # Perform a simple fetch to see what's in the collection
    response = news.query.fetch_objects(limit=5)
    
    print(f"Found {len(response.objects)} articles in the collection")
    
    if response.objects:
        for i, article in enumerate(response.objects, 1):
            print(f"\nArticle {i}:")
            print(f"Title: {article.properties.get('title', 'N/A')}")
            print(f"Source: {article.properties.get('source', 'N/A')}")
            print(f"URL: {article.properties.get('url', 'N/A')}")
            print(f"Published: {article.properties.get('published_date', 'N/A')}")
            content = article.properties.get('content', 'N/A')
            print(f"Content: {content[:200]}..." if len(content) > 200 else f"Content: {content}")
    else:
        print("No articles found in the collection. The collection might be empty.")
        
        # Let's also check the collection configuration
        print("\nCollection configuration:")
        config = news.config.get()
        print(f"Collection name: {config.name}")
        print(f"Vectorizer: {config.vectorizer_config}")

    # Demonstrate queries using correct v4 syntax
    if response.objects:
        print("\n" + "="*50)
        print("DEMONSTRATING QUERIES WITH CORRECT V4 SYNTAX")
        print("="*50)
        
        # 1. Filter by source using correct v4 syntax
        print("\n1. Filtering by source 'FOX':")
        try:
            fox_articles = news.query.fetch_objects(
                filters=Filter.by_property("source").equal("FOX"),
                limit=5
            )
            print(f"Found {len(fox_articles.objects)} FOX articles")
            for article in fox_articles.objects:
                print(f"- {article.properties.get('title', 'N/A')} (Source: {article.properties.get('source', 'N/A')})")
        except Exception as e:
            print(f"Filter search error: {e}")
        
        # 2. BM25 search for Trump
        print("\n2. BM25 search for 'Trump':")
        try:
            trump_articles = news.query.bm25(
                query="Trump",
                limit=5
            )
            print(f"Found {len(trump_articles.objects)} articles with 'Trump'")
            for article in trump_articles.objects:
                print(f"- {article.properties.get('title', 'N/A')}")
        except Exception as e:
            print(f"BM25 search error: {e}")

        # 3. BM25 search for tariff
        print("\n3. BM25 search for 'tariff':")
        try:
            tariff_articles = news.query.bm25(
                query="tariff",
                limit=5
            )
            print(f"Found {len(tariff_articles.objects)} articles with 'tariff'")
            for article in tariff_articles.objects:
                print(f"- {article.properties.get('title', 'N/A')}")
        except Exception as e:
            print(f"BM25 search error: {e}")

        # 4. BM25 search for European Union
        print("\n4. BM25 search for 'European Union':")
        try:
            eu_articles = news.query.bm25(
                query="European Union",
                limit=5
            )
            print(f"Found {len(eu_articles.objects)} articles about European Union")
            for article in eu_articles.objects:
                print(f"- {article.properties.get('title', 'N/A')}")
        except Exception as e:
            print(f"BM25 search error: {e}")

        # 5. Filter by source Huffington Post using correct v4 syntax
        print("\n5. Filtering by source 'Huffington Post':")
        try:
            huff_articles = news.query.fetch_objects(
                filters=Filter.by_property("source").equal("Huffington Post"),
                limit=5
            )
            print(f"Found {len(huff_articles.objects)} Huffington Post articles")
            for article in huff_articles.objects:
                print(f"- {article.properties.get('title', 'N/A')} (Source: {article.properties.get('source', 'N/A')})")
        except Exception as e:
            print(f"Filter search error: {e}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

finally:
    client.close()