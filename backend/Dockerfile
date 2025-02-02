
        #  Use a lightweight base image
FROM python:3.9-slim

WORKDIR /app

#  Copy only requirements first (for caching)
COPY requirements.txt .

RUN touch /app/queries.ttl && chmod 666 /app/queries.ttl
RUN pip install --no-cache-dir -r requirements.txt

#  Install PyTorch efficiently
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

#  Download Spacy model once (cached in Docker layer)
RUN python -m spacy download en_core_web_sm
RUN pip install googletrans==4.0.0-rc1
RUN pip install langdetect

#  Copy all application files (AFTER installing dependencies)
COPY . .

#  Default command to run FastAPI (change for Flask if needed)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
        