#!/bin/bash

# Function to update and upgrade the system
update_system() {
    echo "🔄 Updating and upgrading the system..."
    sudo apt update && sudo apt upgrade -y
    echo "✅ System update and upgrade complete!"
}

# Function to install Docker
install_docker() {
    echo "🔍 Checking for Docker installation..."
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Installing now..."
        
        # Update package info and install dependencies
        sudo apt update
        sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

        # Add Docker’s official GPG key & repository
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

        # Install Docker
        sudo apt update
        sudo apt install -y docker-ce docker-ce-cli containerd.io

        # Enable & start Docker
        sudo systemctl enable docker
        sudo systemctl start docker

        echo "✅ Docker installed successfully!"
    else
        echo "✅ Docker is already installed."
    fi
}

# Function to run the setup.sh inside ./server/ and wait until it finishes
run_server_setup() {
    SERVER_SETUP_PATH="./server/setup.sh"
    
    if [ -f "$SERVER_SETUP_PATH" ]; then
        echo "🔄 Running server setup script: $SERVER_SETUP_PATH"
        
        # Give execution permission if not already
        chmod +x $SERVER_SETUP_PATH
        
        # Run the server setup and wait for it to finish
        $SERVER_SETUP_PATH
        EXIT_CODE=$?

        if [ $EXIT_CODE -eq 0 ]; then
            echo "✅ Server setup script executed successfully!"
        else
            echo "❌ Server setup failed with exit code $EXIT_CODE. Exiting..."
            exit $EXIT_CODE
        fi
    else
        echo "❌ Server setup script not found at $SERVER_SETUP_PATH"
        exit 1
    fi
}

# Function to install Docker Compose
install_docker_compose() {
    echo "🔍 Checking for Docker Compose installation..."
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Installing now..."
        
        # Download and install Docker Compose
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose

        echo "✅ Docker Compose installed successfully!"
    else
        echo "✅ Docker Compose is already installed."
    fi
}

# Function to start Qdrant with animation
start_qdrant() {
    echo "🚀 Starting Qdrant Vector Database..."

    # Run docker-compose
    docker-compose up -d

    # Loading animation
    echo -n "⏳ Loading Qdrant"
    for i in {1..5}; do
        echo -n "."
        sleep 1
    done

    # Check if Qdrant is running
    if docker ps | grep -q "qdrant_db"; then
        echo -e "\n✅ Qdrant is running successfully!"
    else
        echo -e "\n❌ Failed to start Qdrant. Check logs with: docker-compose logs"
    fi
}

build_frontend_image() {
    FRONTEND_PATH="./frontend"
    
    echo "🔧 Building Docker image for frontend..."

    if [ -d "$FRONTEND_PATH" ]; then
        cd "$FRONTEND_PATH"
        docker build -t frontend .
        cd - > /dev/null
        echo "✅ Frontend Docker image built successfully!"
    else
        echo "❌ Frontend directory not found at $FRONTEND_PATH"
        exit 1
    fi
}

# Run system update, install Docker, run server setup, then continue with remaining setup
update_system
install_docker
run_server_setup   # Waits for server/setup.sh to finish before proceeding
install_docker_compose
start_qdrant
build_frontend_image
