import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Fallback or warning
            print("Warning: GEMINI_API_KEY not found in environment.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_incident_report(self, metadata: dict):
        """Generates a human-readable incident report from detection metadata."""
        prompt = f"""
        Act as a professional security analyst. Analyze the following surveillance detection metadata and generate a concise, human-readable incident report.
        Metadata:
        - Timestamp: {metadata.get('timestamp')}
        - Camera ID: {metadata.get('camera_id')}
        - Detections: {metadata.get('detections')}
        - Detected Activity: {metadata.get('activity_type')}
        
        The report should include:
        1. Summary of what happened.
        2. Severity Assessment (Low, Medium, High).
        3. Recommended immediate action for security personnel.
        
        Format the output as a clean, structured report.
        """
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating report: {str(e)}"

gemini_service = GeminiService()
