FROM python:3.9.18-alpine3.18
COPY . /app/
WORKDIR /app
ENV DUOLINSHENG_DATA_DIR=/app/data

RUN apk add --no-cache libstdc++ libffi \
    && apk add --no-cache --virtual .build-deps build-base libffi-dev \
    && pip install --no-cache-dir -r requirements.txt \
    && apk del .build-deps \
    && mkdir -p /app/data
    
CMD ["python", "run.py"]
