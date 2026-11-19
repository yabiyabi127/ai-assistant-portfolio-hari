
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV HF_HOME=/home/appuser/.cache/huggingface

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files
COPY requirements.txt constraints-cpu.txt ./

# Install CPU-only PyTorch first
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir \
       torch==2.15.0 \
       --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies without replacing CPU PyTorch
RUN pip install --no-cache-dir \
    --constraint constraints-cpu.txt \
    -r requirements.txt

# Copy application
COPY . .

# Create application user
RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && mkdir -p /home/appuser/.cache/huggingface \
    && chown -R appuser:appuser /app /home/appuser

USER appuser

EXPOSE 8000

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
