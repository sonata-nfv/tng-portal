#!/bin/sh
case $PLATFORM in
"sp")
mv /usr/share/nginx/html/config-sp.json /usr/share/nginx/html/config.json
;;
"vnv")
mv /usr/share/nginx/html/config-vnv.json /usr/share/nginx/html/config.json 
;;
esac

exec $(which nginx) -c /etc/nginx/nginx.conf -g "daemon off;"