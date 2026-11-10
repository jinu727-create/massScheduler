#!/bin/sh
cd "$(dirname "$0")"
python3 -c "open('index.html','w').write(open('index.src.html').read().replace('/*LOGIC*/', open('logic.js').read()))"
