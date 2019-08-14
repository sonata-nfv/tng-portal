#!/bin/bash
set -e
docker run -it --name sdk-portal-backend -p 5098:5098 -p 8888:8888 --rm sonatanfv/sdk-portal-backend
