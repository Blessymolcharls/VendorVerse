import os
import time
from pymongo import MongoClient
from duckduckgo_search import DDGS

MONGO_URI = "mongodb://localhost:27017/vendorverse"  # Assuming default local config, or read from .env if needed
# Better to read from env
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('MONGO_URI='):
            MONGO_URI = line.strip().split('=', 1)[1]

def update_images():
    print(f"Connecting to MongoDB: {MONGO_URI}")
    client = MongoClient(MONGO_URI)
    db = client.get_database() # gets default from URI
    products = db.products

    print("Fetching all products...")
    all_products = list(products.find({}))
    total = len(all_products)
    print(f"Found {total} products to update.")

    ddgs = DDGS()
    
    for i, p in enumerate(all_products):
        name = p.get('name', '')
        if not name:
            continue
            
        print(f"[{i+1}/{total}] Searching for image: {name}")
        try:
            # Add 'product high quality' to prompt for better results
            query = f"{name} product high quality"
            results = list(ddgs.images(query, max_results=1))
            
            if results and len(results) > 0:
                image_url = results[0]['image']
                print(f"  -> Found: {image_url}")
                
                # Update database
                products.update_one(
                    {'_id': p['_id']},
                    {'$set': {'images': [image_url]}}
                )
            else:
                print("  -> No image found.")
            
        except Exception as e:
            print(f"  -> Error: {e}")
            
        # Small delay to prevent rate limiting
        time.sleep(1.5)

    print("\n✅ All product images successfully updated from the web!")

if __name__ == "__main__":
    update_images()
