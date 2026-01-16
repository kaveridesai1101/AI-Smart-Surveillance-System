import sqlite3

conn = sqlite3.connect('surveillance_system.db')
cursor = conn.cursor()

# Check current cameras
cameras = cursor.execute("SELECT id, name, owner_id FROM cameras").fetchall()
print("Current cameras:")
for cam in cameras:
    print(f"  ID: {cam[0]}, Name: {cam[1]}, Owner: {cam[2]}")

# Update owner_id for operators
cursor.execute("UPDATE cameras SET owner_id = 'operator_001' WHERE id IN (SELECT id FROM cameras LIMIT 2)")
conn.commit()

print("\nUpdated cameras:")
cameras = cursor.execute("SELECT id, name, owner_id FROM cameras").fetchall()
for cam in cameras:
    print(f"  ID: {cam[0]}, Name: {cam[1]}, Owner: {cam[2]}")

conn.close()
