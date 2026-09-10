import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov"}
MAX_FILE_SIZE = 25 * 1024 * 1024 # 25 MB

async def save_uploaded_evidence(file: UploadFile) -> str:
    """Validate and securely save an uploaded photo or video evidence file."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

    unique_filename = f"evidence_{uuid.uuid4().hex[:12]}{ext}"
    destination_path = os.path.join(UPLOAD_DIR, unique_filename)

    size = 0
    async with aiofiles.open(destination_path, "wb") as out_file:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_FILE_SIZE:
                os.remove(destination_path)
                raise HTTPException(status_code=400, detail="File exceeds maximum size limit of 25MB")
            await out_file.write(chunk)

    return f"/uploads/{unique_filename}"
