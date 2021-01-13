#/bin/bash
rm -rf ./dist
cp -r ../dist ./dist 
docker build . -t dezhishen/listen-music-web:`git rev-parse --short HEAD`