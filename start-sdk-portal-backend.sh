#!/bin/bash
set -e
# start tng-sdk-project service in background
tng-project -s -v &
# start jupyter notebook and lab (access via /lab endpoint)
jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root --NotebookApp.token=''
