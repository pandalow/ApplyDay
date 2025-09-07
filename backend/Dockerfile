FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Downloading spaCy model
RUN python -m spacy download en_core_web_sm

COPY applyday /app

CMD ["gunicorn", "applyday.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]

EXPOSE 8000