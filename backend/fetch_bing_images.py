import os
import time
import requests
import re
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/vendorverse"

def get_bing_image(query):
    url = f"https://www.bing.com/images/search?q={query}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    try:
        res = requests.get(url, headers=headers, timeout=10)
        # Look for the first actual image URL returned in the murl field
        match = re.search(r'murl&quot;:&quot;(.*?)&quot;', res.text)
        if match:
            # Clean up the URL in case it has HTML encoding
            raw_url = match.group(1).replace('\\/', '/')
            return raw_url
    except Exception as e:
        print(f"Error fetching {query}: {e}")
    return None

def update_images():
    print(f"Connecting to MongoDB: {MONGO_URI}")
    client = MongoClient(MONGO_URI)
    db = client.get_database()
    products = db.products

    all_products = list(products.find({}))
    total = len(all_products)
    print(f"Found {total} products to upgrade with real exact pictures via Bing.")

    session = requests.Session()
    
    success_count = 0
    
    for i, p in enumerate(all_products):
        name = p.get('name', '')
        if not name:
            continue
            
        print(f"[{i+1}/{total}] Fetching real image for: {name}")
        
        # Adding a term like "product" helps filter out non-product results
        search_query = f"{name} high quality"
        
        image_url = get_bing_image(search_query)
        
        if image_url:
            try:
                products.update_one(
                    {'_id': p['_id']},
                    {'$set': {'images': [image_url]}}
                )
                print(f"  -> Linked: {image_url}")
                success_count += 1
            except Exception as e:
                print(f"  -> DB Error: {e}")
        else:
            print("  -> Could not find an image, keeping current one.")
            
        # Add a delay to prevent getting temporarily blocked by Bing
        time.sleep(1)
            
    print(f"\\n✅ Successfully fetched and updated {success_count} real product images!")

if __name__ == "__main__":
    update_images()
