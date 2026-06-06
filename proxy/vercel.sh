#!/bin/bash

# Exit on any failure
set -e

# Installing Project Dependecies
echo "Installing Project Dependencies..."
npm install

# Starting the Server
echo "Starting the application..."
npm start

echo "Build Completed!"