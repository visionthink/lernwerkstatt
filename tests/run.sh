#!/bin/sh
# Prüft alle Aufgaben (Zufallsgeneratoren, Lösungen, Geometrie) und den Merkzettel.
cd "$(dirname "$0")"
sed -n '/<script>/,/<\/script>/p' ../index.html | sed '1d;$d' > /tmp/lw_check.js
node --check /tmp/lw_check.js && node run2.js /tmp/lw_check.js && node merkcheck.js /tmp/lw_check.js
node ui.js | grep -v "^OK" 
