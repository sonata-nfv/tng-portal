#!/bin/bash
set -e
docker build -f Dockerfile_sdkportal_backend -t sonatanfv/sdk-portal-backend .
