# pip install friendli

import os
from friendli import SyncFriendli
from news import fetch_nyt_articles

with SyncFriendli(
    token="flp_ArMJgJO4J4M0BUPegBFBgLfRhvuwNhRqKtYfZApOP7285",
) as friendli:
    res = friendli.serverless.chat.complete(
        model="meta-llama-3.3-70b-instruct",
        messages=[
            {
                "role": "user",
                "content": "Tell me how to make a delicious pancake"
            },
        ],
    )

print(res)
print("----------------------------------------------------------")

nyt_api_key = "ptp6OUSAz7TAO9RXFECIqq9zwvqaIhHB"  # Set your NYT API key in the environment
    # bbc_api_key = os.getenv("BBC_API_KEY")  # Set your BBC API key in the environment

with SyncFriendli(
    token="flp_ArMJgJO4J4M0BUPegBFBgLfRhvuwNhRqKtYfZApOP7285",
) as friendli:
    # Fetch articles from NYT using the SyncFriendli instance
    nyt_articles = fetch_nyt_articles(nyt_api_key)  # Pass the API key
    res = friendli.serverless.chat.complete(
        model="meta-llama-3.3-70b-instruct",
        messages=[
            {
                "role": "user",
                "content": f"Summarize this news article to be neutral + {nyt_articles}"
            },
        ],
    )
    
print(res)
