#!/bin/bash

# Set Python virtual environment name
VENV_DIR="$(dirname "$0")/venv"  # Makes sure the venv is inside the 'server' folder
PROJECT_DIR="$(dirname "$0")"  # Gets the directory of the current script

echo "🔄 Setting up Python environment..."

# Create a virtual environment if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    python3 -m venv $VENV_DIR
    echo "✅ Virtual environment created."
fi

# Activate the virtual environment
source "$VENV_DIR/bin/activate"
echo "✅ Virtual environment activated."

# Install dependencies
pip install --upgrade pip
pip install -r "$PROJECT_DIR/requirements.txt"
echo "✅ Dependencies installed."

# Deactivate virtual environment
deactivate
echo "✅ Virtual environment deactivated."

# Build Docker image (correcting path issue)
echo "🚀 Building Docker image..."
docker build -t server "$PROJECT_DIR"  # Ensures it builds inside the correct folder
echo "✅ Docker image 'server' created."

echo "✅ Setup complete. Exiting..."
