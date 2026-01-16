# IntentSentinel: AI-Based Intent & Escalation Detection

![Project Banner](https://via.placeholder.com/1200x300?text=IntentSentinel+AI+Surveillance)

> **A Proactive Intelligence System for Public Safety**  
> IntentSentinel goes beyond traditional surveillance by analyzing behavioral intent and detecting escalation patterns *before* a threat manifests.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/backend-FastAPI-green.svg)
![React](https://img.shields.io/badge/frontend-React_Vite-blue.svg)
![Status](https://img.shields.io/badge/status-Active_Development-orange.svg)

---

## 📌 Project Overview

**IntentSentinel** is an advanced AI surveillance platform designed to enhance public safety through **predictive intelligence**. Unlike traditional systems that only record incidents, IntentSentinel uses computer vision and temporal behavior analysis to identify "pre-event signatures"—subtle changes in pacing, posture, and proximity that indicate potential aggression or escalation.

### Core Innovation: Proactive vs. Reactive
*   **Traditional Systems**: Detect incidents *after* they happen (e.g., a fight breaks out).
*   **IntentSentinel**: Detects *escalation* (e.g., aggressive posturing, rapid approach) to enable intervention.

---

## 🚀 Key Features

*   **🧠 Temporal Behavior Analysis**: Learns the rhythm of a space to detect anomalies and aggressive motion patterns.
*   **⚡ Real-Time Escalation Scoring**: Assigns a dynamic risk score (0.0 - 1.0) to subjects based on movement intensity and duration.
*   **🛡️ Privacy-First Design**: **Identity Agnostic**. Focuses on posture and intent (behavioral analytics) rather than facial recognition, preserving individual privacy.
*   **📊 Operator Control Room**: A premium, React-based dashboard for real-time monitoring and alert management.
*   **🤖 AI Incident Reporting**: Uses LLMs (Google Gemini) to generate readable, tactical explanations for every alert.

---

## 🛠️ Technology Stack

### Backend (Python)
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance Async API)
*   **Computer Vision**: [OpenCV](https://opencv.org/) & [NumPy](https://numpy.org/)
*   **AI/ML**: [TensorFlow](https://www.tensorflow.org/) (Temporal Models) & [Google Generative AI](https://ai.google.dev/)
*   **Database**: [SQLAlchemy](https://www.sqlalchemy.org/) (SQLite)
*   **Real-Time**: WebSockets for instant alert broadcasting

### Frontend (JavaScript)
*   **Framework**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Networking**: Axios

---

## 💻 Getting Started

### Prerequisites
*   **Node.js** (v18+ recommended)
*   **Python** (v3.10+ recommended)
*   **Webcam** (for live feed testing)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/IntentSentinel.git
    cd IntentSentinel
    ```

2.  **Backend Setup**
    ```bash
    # Create virtual environment
    python -m venv venv
    
    # Activate virtual environment
    # Windows:
    .\venv\Scripts\activate
    # Mac/Linux:
    source venv/bin/activate
    
    # Install dependencies
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    ```

---

## 🏃 Usage

### Quick Start (Windows)
Simply run the automated startup script:
1.  Double-click **`run_system.bat`** in the root directory.
2.  Wait for both terminal windows (Backend & Frontend) to initialize.

### Manual Start
**Backend:**
```bash
python -m backend.main
# Runs on http://localhost:8001
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🔗 API Documentation

Once the backend is running, you can explore the auto-generated API docs:
*   **Swagger UI**: [http://localhost:8001/docs](http://localhost:8001/docs)
*   **ReDoc**: [http://localhost:8001/redoc](http://localhost:8001/redoc)

---

## 🔮 Roadmap
*   [ ] Integration with Edge AI Camera Hardware
*   [ ] Multi-Stream Support (RTSP)
*   [ ] Advanced Audio Anomaly Detection (Glass break, shouting)
*   [ ] Mobile App for Field Responders

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request for any features or bug fixes.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for Public Safety**
