FROM python:3.9.18-alpine3.18
COPY . /app/
WORKDIR /app
ENV DUOLINSHENG_DATA_DIR=/app/data

RUN pip install --no-cache-dir -r requirements.txt && mkdir -p /app/data
    
CMD ["python", "run.py"]
