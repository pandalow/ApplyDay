FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Downloading spaCy model
RUN python -m spacy download en_core_web_sm

COPY applyday /app

# Use gunicorn with configuration file
CMD ["gunicorn", "--config", "gunicorn.conf.py", "applyday.wsgi:application"]

EXPOSE 8000