import sqlite3

conn = sqlite3.connect('surveillance_system.db')
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE cameras ADD COLUMN owner_id TEXT DEFAULT 'admin'")
    print("Added owner_id to cameras")
except Exception as e:
    print(f"Cameras: {e}")

try:
    cursor.execute("ALTER TABLE incidents ADD COLUMN owner_id TEXT DEFAULT 'admin'")
    print("Added owner_id to incidents")
except Exception as e:
    print(f"Incidents: {e}")

conn.commit()
conn.close()
