#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Create virtual environment if it doesn't already exist
if [ ! -d "virtual" ]; then
    echo "Creating virtual environment..."
    python3 -m venv virtual
else
    echo "Virtual environment already exists. Skipping creation."
fi

# Acivate the Virtual Environment based on the OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    .\virtual\Scripts\activate
else
    source virtual/bin/activate
fi

# Installing the Project Dependencies
echo "Installing project dependencies..."
python3 -m pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Warning: .env file not found. Make sure environment variables are set."
fi

echo "Build completed successfully!"