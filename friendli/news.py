import os
import requests
from textblob import TextBlob

def fetch_nyt_articles(api_key):
    url = f'https://api.nytimes.com/svc/topstories/v2/home.json?api-key={api_key}'
    response = requests.get(url)
    if response.status_code == 200:
        articles = response.json().get('results', [])
        if articles:
            latest_article = articles[0]
            neutral_content = str(TextBlob(latest_article['abstract']).correct())
            return [
                {
                    'title': latest_article['title'],
                    'abstract': neutral_content,
                    'url': latest_article['url'],
                    'source': 'New York Times'
                }
            ]
    else:
        print(f"Error fetching NYT articles: {response.status_code}")
        return []

def fetch_bbc_articles(api_key):
    url = f'https://newsapi.org/v2/everything?q=bbc&apiKey={api_key}'
    response = requests.get(url)
    if response.status_code == 200:
        articles = response.json().get('articles', [])
        return [
            {
                'title': article['title'],
                'abstract': article['description'],
                'url': article['url'],
                'source': 'BBC'
            }
            for article in articles
        ]
    else:
        print(f"Error fetching BBC articles: {response.status_code}")
        return []

def main():
    nyt_api_key = "ptp6OUSAz7TAO9RXFECIqq9zwvqaIhHB" # Set your NYT API key in the environment
    # bbc_api_key = os.getenv("BBC_API_KEY")  # Set your BBC API key in the environment

    # Fetch articles from both sources
    nyt_articles = fetch_nyt_articles(nyt_api_key)
    # bbc_articles = fetch_bbc_articles(bbc_api_key)

    # Combine articles
    all_articles = nyt_articles

    # Display articles
    for article in all_articles:
        print(f"Source: {article['source']}")
        print(f"Title: {article['title']}")
        print(f"Abstract: {article['abstract']}")
        print(f"URL: {article['url']}\n")

if __name__ == "__main__":
    main()