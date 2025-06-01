import weaviate
import json, os

# Load environment variables
weaviate_url = os.getenv("WEAVIATE_URL")
weaviate_api_key = os.getenv("WEAVIATE_API_KEY")

if not weaviate_url or not weaviate_api_key:
    raise ValueError("Please set WEAVIATE_URL and WEAVIATE_API_KEY environment variables")

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=weaviate_url,
    auth_credentials=weaviate.auth.AuthApiKey(api_key=weaviate_api_key)
)

try:
    # Load data with proper file handling
    with open("to_json_Sheet1.json", "r") as f:
        data = json.load(f)

    news = client.collections.get("News")

    print(f"Uploading {len(data)} articles to the News collection...")

    with news.batch.fixed_size(batch_size=200) as batch:
        for d in data:
            # Map the JSON fields to our collection properties
            batch.add_object(
                {
                    "title": d.get("Title", ""),
                    "content": d.get("Article", ""),
                    "source": d.get("News Source", ""),
                    "published_date": d.get("Date", ""),  # Assuming there might be a Date field
                    "url": d.get("URL", "")  # Assuming there might be a URL field
                }
            )
            if batch.number_errors > 10:
                print("Batch import stopped due to excessive errors.")
                break

    failed_objects = news.batch.failed_objects
    if failed_objects:
        print(f"Number of failed imports: {len(failed_objects)}")
        print(f"First failed object: {failed_objects[0]}")
    else:
        print("All articles uploaded successfully!")

    # Check how many objects were uploaded
    count = news.aggregate.over_all(total_count=True)
    print(f"Total objects in News collection: {count.total_count}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

finally:
    client.close()