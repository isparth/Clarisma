FROM python:3.10-slim
WORKDIR /app

# Copy application files
COPY ./app /app/app
COPY main.py .
COPY requirements.txt .

# Install ffmpeg and LLVM packages
RUN apt-get update && \
    apt-get install -y ffmpeg llvm-15 llvm-15-dev && \
    rm -rf /var/lib/apt/lists/*

# Set LLVM_CONFIG to point to llvm-config-15
ENV LLVM_CONFIG=/usr/bin/llvm-config-15

# Pre-install numpy so that llvmlite/numba build can find it
RUN pip install --no-cache-dir numpy

# Install remaining Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]