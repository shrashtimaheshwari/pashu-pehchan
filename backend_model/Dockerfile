FROM python:3.10

# Set up a new user named "user" with user ID 1000 for Hugging Face
RUN useradd -m -u 1000 user
USER user

# Set environment paths
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy backend_model files (assuming Docker builds from here)
COPY --chown=user . $HOME/app

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Port 7860 is required by Hugging Face Spaces
EXPOSE 7860

# Start Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
