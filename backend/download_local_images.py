import os
import time
import requests
import re
import random
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017/vendorverse"
FRONTEND_IMAGES_DIR = "../frontend/public/images"

# Ensure directory exists
if not os.path.exists(FRONTEND_IMAGES_DIR):
    os.makedirs(FRONTEND_IMAGES_DIR)

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
]

def get_bing_image(query, attempt=1):
    url = f"https://www.bing.com/images/search?q={query}"
    headers = {
        'User-Agent': random.choice(USER_AGENTS)
    }
    try:
        res = requests.get(url, headers=headers, timeout=10)
        # We find ALL matches and try to get the 1st or 2nd one to avoid bad links
        matches = re.findall(r'murl&quot;:&quot;(.*?)&quot;', res.text)
        if matches:
            # If attempt > 1, maybe the first match was broken, so we try the next one
            index = min(attempt - 1, len(matches) - 1)
            raw_url = matches[index].replace('\\/', '/')
            return raw_url
    except Exception as e:
        print(f"Error fetching {query}: {e}")
    return None

def update_images():
    print(f"Connecting to MongoDB: {MONGO_URI}")
    client = MongoClient(MONGO_URI)
    db = client.get_database()
    products = db.products

    # Find ONLY products that currently have the fallback picsum image
    all_products = list(products.find({
        "images": {
            "$elemMatch": {
                "$regex": "picsum"
            }
        }
    }))
    
    total = len(all_products)
    print(f"Found {total} products that failed the first pass and need rescraping without fallbacks.")

    if total == 0:
        print("No placeholder images found! Everything is authentic.")
        return

    success_count = 0
    
    for i, p in enumerate(all_products):
        name = p.get('name', '')
        if not name:
            continue
            
        print(f"\\n[{i+1}/{total}] Aggressive Scrape for: {name}")
        
        # We will try multiple query styles to guarantee a hit
        queries = [
            f"{name} amazon product",
            f"{name} stock photo white background",
            f"{name}"
        ]
        
        saved_local_path = None
        
        for attempt_query in queries:
            if saved_local_path:
                break
                
            for attempt_num in range(1, 4): # Try up to 3 different image results from the same query
                print(f"  -> Try: '{attempt_query}' (Index {attempt_num})")
                image_url = get_bing_image(attempt_query, attempt=attempt_num)
                
                if image_url:
                    print(f"  -> Found URL: {image_url}")
                    try:
                        headers = {'User-Agent': random.choice(USER_AGENTS)}
                        res = requests.get(image_url, headers=headers, timeout=10)
                        
                        # Verify we actually got an image back (not an HTML page block)
                        if res.status_code == 200 and 'image' in res.headers.get('Content-Type', ''):
                            img_data = res.content
                            filepath = os.path.join(FRONTEND_IMAGES_DIR, f"{p['_id']}.jpg")
                            
                            with open(filepath, 'wb') as handler:
                                handler.write(img_data)
                                
                            saved_local_path = f"/images/{p['_id']}.jpg"
                            print(f"  -> SUCCESS! Saved Binary to Disk.")
                            success_count += 1
                            break # Break out of the inner attempt loop
                        else:
                            print(f"  -> FAILED: URL returned status {res.status_code} or non-image content: {res.headers.get('Content-Type')}")
                    except Exception as e:
                        print(f"  -> Could not download binary data, error: {e}")
                
                time.sleep(1.5) # Crucial delay between aggressive scrapes
            
        if saved_local_path:
            try:
                products.update_one(
                    {'_id': p['_id']},
                    {'$set': {'images': [saved_local_path]}}
                )
                print(f"  -> DB Updated: {saved_local_path}")
            except Exception as e:
                print(f"  -> DB Error: {e}")
        else:
            print(f"  -> COMPLETELY FAILED to find an image for {name} after all retries.")
            
    print(f"\\n✅ Successfully aggressively rescued and assigned {success_count} real product images!")

if __name__ == "__main__":
    update_images()
