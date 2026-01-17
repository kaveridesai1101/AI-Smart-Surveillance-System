import requests
import time
import json

BASE_URL = "http://localhost:8001"

def test_unified_pipeline():
    print("--- Unified Pipeline Verification ---")
    
    # 1. Check health
    try:
        res = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {res.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return

    # 2. Get initial incidents count
    try:
        res = requests.get(f"{BASE_URL}/incidents/", headers={"X-User-ID": "admin"})
        initial_count = len(res.json())
        print(f"Initial Incidents Count (Admin): {initial_count}")
    except Exception as e:
        print(f"Failed to fetch incidents: {e}")
        return

    # 3. Trigger a status update on an existing incident (if any)
    if initial_count > 0:
        target_id = res.json()[0]['id']
        print(f"Updating status for incident ID {target_id} to 'Escalated'...")
        try:
            res = requests.patch(f"{BASE_URL}/incidents/{target_id}/status", params={"status": "Escalated"})
            print(f"Update Result: {res.json()}")
            
            # Verify update
            res = requests.get(f"{BASE_URL}/incidents/{target_id}")
            updated_status = res.json().get('status')
            print(f"New Status in DB: {updated_status}")
            if updated_status == "Escalated":
                print("✅ Status persistence verified.")
            else:
                print("❌ Status persistence failed.")
        except Exception as e:
            print(f"Update Failed: {e}")
    else:
        print("No existing incidents to test status update. Please trigger one manually via webcam.")

if __name__ == "__main__":
    test_unified_pipeline()
