FROM python:3.12-slim
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Europe/Dublin

# Install timezone data and configure Ireland timezone
RUN apt-get update && \
    apt-get install -y tzdata curl && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy Django project files to the correct location
COPY applyday/ /app/
COPY start.sh /app/

# Make start script executable
RUN chmod +x /app/start.sh

# Use the start script instead of direct gunicorn
CMD ["/app/start.sh"]

EXPOSE 8000