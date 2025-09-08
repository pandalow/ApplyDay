FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Downloading spaCy model
RUN python -m spacy download en_core_web_sm

COPY applyday /app
COPY start.sh /app/

# Make start script executable
RUN chmod +x /app/start.sh

# Use the start script instead of direct gunicorn
CMD ["/app/start.sh"]

EXPOSE 8000