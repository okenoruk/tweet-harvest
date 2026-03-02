import csv
import os
import shutil

# Expected Header Definitions (Current Version 4.1.0)
TWEET_HEADERS = [
    "created_at", "id_str", "full_text", "quote_count", "reply_count",
    "retweet_count", "favorite_count", "bookmark_count", "lang",
    "user_id_str", "conversation_id_str", "username", "tweet_url",
    "image_url", "location", "views_count"
]

USER_HEADERS = [
    "id", "created_at", "description", "followers_count", "friends_count",
    "name", "profile_image_url_https", "screen_name", "statuses_count",
    "is_blue_verified", "profile_description_language", "favourites_count"
]

DATA_FOLDER = "tweets-data"

def fix_tweet_row(row):
    """
    Previously, tweet_url and image_url were added after location if missing from pick().
    Old Row: [0..11], location, tweet_url, image_url, views_count
    New Header: [0..11], tweet_url, image_url, location, views_count
    """
    if len(row) < 16:
        row = row + [""] * (16 - len(row))
    
    val_12 = row[12].strip()
    val_13 = row[13].strip()
    val_14 = row[14].strip()
    
    # Detection: if index 13 looks like a tweet URL but index 12 doesn't
    if val_13.startswith("https://twitter.com/") and not val_12.startswith("https://"):
        # Reorder to match current header
        # New[12]=Old[13], New[13]=Old[14], New[14]=Old[12]
        return row[:12] + [row[13], row[14], row[12]] + row[15:16]
    
    return row[:16]

def fix_user_row(row):
    """
    Handle various old user profile versions.
    Version 6-col: id, description, followers, friends, statuses, name
    Version 9-col: id, created_at, description, followers, friends, name, img, screen_name, statuses
    """
    if len(row) == 6:
        new_row = [""] * 12
        new_row[0] = row[0] # id
        new_row[2] = row[1] # description
        new_row[3] = row[2] # followers
        new_row[4] = row[3] # friends
        new_row[8] = row[4] # statuses
        new_row[5] = row[5] # name
        return new_row
    
    if len(row) == 9:
        # Format: id, created_at, description, followers, friends, name, profile_image_url_https, screen_name, statuses_count
        new_row = [""] * 12
        new_row[0:8] = row[0:8]
        new_row[8] = row[8] # statuses_count
        return new_row

    # Pad/Trim to 12
    if len(row) < 12:
        return row + [""] * (12 - len(row))
    return row[:12]

def process_file(file_path, file_type):
    print(f"Processing {file_type}: {file_path}")
    
    backup_path = file_path + ".bak"
    shutil.copy2(file_path, backup_path)
    
    expected_headers = TWEET_HEADERS if file_type in ["tweets", "replies", "quotes"] else USER_HEADERS
    fix_func = fix_tweet_row if file_type in ["tweets", "replies", "quotes"] else fix_user_row
    
    try:
        rows_to_write = []
        with open(file_path, mode='r', encoding='utf-8', newline='') as csvfile:
            # We use a raw reader because the header itself might be misleading or mismatched
            reader = csv.reader(csvfile)
            first_row = next(reader, None)
            
            if not first_row:
                print("  Empty file.")
                os.remove(backup_path)
                return

            # Skip header if it contains recognized field names
            if "id" in first_row or "created_at" in first_row:
                pass 
            else:
                # If first row is data, process it
                rows_to_write.append(fix_func(first_row))

            for row in reader:
                rows_to_write.append(fix_func(row))

        with open(file_path, mode='w', encoding='utf-8', newline='') as csvfile:
            writer = csv.writer(csvfile, quoting=csv.QUOTE_ALL)
            writer.writerow(expected_headers)
            writer.writerows(rows_to_write)
            
        print(f"  Fixed {len(rows_to_write)} rows.")
        os.remove(backup_path)
    except Exception as e:
        print(f"  Error: {e}")
        shutil.move(backup_path, file_path)

def main():
    if not os.path.exists(DATA_FOLDER):
        print(f"Folder {DATA_FOLDER} not found.")
        return

    prefixes = {
        "quotes_": "quotes",
        "replies_": "replies",
        "sumatra_flood_": "tweets",
        "retweet_": "retweets",
        "miftah": "tweets", # Added based on dev.ts and list_dir
        "gibran": "retweets",
        "mbg": "tweets",
        "test_retweets": "retweets",
        "kemensos": "tweets",
        "bmkg": "tweets"
    }

    files = os.listdir(DATA_FOLDER)
    for filename in files:
        if not filename.endswith(".csv") or filename.endswith(".old.csv"):
            continue
            
        file_path = os.path.join(DATA_FOLDER, filename)
        file_type = None
        
        for prefix, ftype in prefixes.items():
            if filename.startswith(prefix):
                file_type = ftype
                break
        
        if file_type:
            process_file(file_path, file_type)
        else:
            # Heuristic for unknown filenames
            print(f"Skipping unknown file: {filename}")

if __name__ == "__main__":
    main()
