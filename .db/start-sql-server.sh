#!/bin/bash

# Check if Docker is inactive
if ! systemctl is-active --quiet docker; then
    echo "Docker is down. Starting Docker..."
    # Optionally, you can start Docker here using 'systemctl start docker'

    # Build and start the container in detached mode
    docker compose up --build -d

    echo "Waiting for SQL server to start... (3s)"
    sleep 3
else
    echo "Docker is already running."
fi
