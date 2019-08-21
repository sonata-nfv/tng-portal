#!/bin/bash
set -e
docker build --no-cache -f Dockerfile_sdkportal_backend -t sonatanfv/sdk-portal-backend .
