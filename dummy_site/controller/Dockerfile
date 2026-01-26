FROM python:3.9-slim

WORKDIR /app
COPY main.py .
RUN pip install kubernetes

CMD ["python", "-u", "main.py"]
