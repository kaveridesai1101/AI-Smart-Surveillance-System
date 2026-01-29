**IntentSentinel** is a proactive intelligence system that goes beyond traditional surveillance. It doesn't just watch for incidents—it understands behavioral intent and identifies escalation patterns before a threat manifests as a crisis.

---

## 🚀 Key Features

- **Unified Incident Pipeline**: Operators and Admins share a real-time data source. Alerts triggered by operators are instantly visible to administration.
- **Real-time Synchronization**: High-performance WebSocket integration ensures that status updates (Acknowledge/Escalate) are reflected across all dashboards instantly.
- **Temporal Behavior Analysis**: Uses signal extraction to analyze motion progression and detect sustained anomalies.
- **Privacy-Aware AI**: Focused on posture, movement, and intent without using facial recognition or identity tracking.
- **Enterprise Dashboard**: Two distinct panels:
    - **Operator Panel**: Focuses on private camera management and localized monitoring.
    - **Admin Panel**: Provides a global overview of all system nodes, operator activities, and high-level safety metrics.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: FastAPI, SQLAlchemy (SQLite), Uvicorn.
- **AI/Vision**: OpenCV (Motion Extraction), Custom Temporal Analysis Logic.
- **Real-time**: WebSockets for live alerts and status sync.

---

## 📦 Project Structure

```text
├── backend/            # FastAPI source code, models, and API routes
├── frontend/           # React + Vite application
├── surveillance_system.db # Centralized SQLite database
├── run_system.bat      # Single-click launcher for Windows
└── .gitignore          # Safeguards against committing large dependencies
```

---

## ⚙️ Quick Start

### Prerequisites
- Python 3.8+
- Node.js & npm

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd <project-folder>
   ```

2. **Launcher (Windows)**:
   Simply double-click **`run_system.bat`**. This will:
   - Start the backend API on `http://localhost:8001`
   - Launch the frontend dev server on `http://localhost:5173`

3. **Access the Application**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **API Docs**: [http://localhost:8001/docs](http://localhost:8001/docs)

---

## 🛡️ Security & Privacy
IntentSentinel is built on the principle of **Responsibility by Design**:
- Identity-agnostic analysis.
- Localized data storage.
- Assistive UI (Human-in-the-loop decision-making).

---

Developed as a proactive safety solution for public and private infrastructure.
