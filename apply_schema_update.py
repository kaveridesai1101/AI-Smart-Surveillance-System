import sqlite3
import os

db_path = "surveillance_system.db"

if os.path.exists(db_path):
    print(f"Checking schema for {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if status column exists
    cursor.execute("PRAGMA table_info(incidents)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if "status" not in columns:
        print("Adding 'status' column to 'incidents' table...")
        cursor.execute("ALTER TABLE incidents ADD COLUMN status TEXT DEFAULT 'Active'")
        conn.commit()
        print("Schema updated successfully.")
    else:
        print("'status' column already exists.")
    
    conn.close()
else:
    print(f"Database {db_path} not found. It will be created on start.")
