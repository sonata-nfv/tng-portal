#!/bin/bash
set -e
docker build --no-cache -f Dockerfile-sdk-portal-backend -t sonatanfv/sdk-portal-backend .
