#!/bin/sh
# Prüft Aufgaben (Zufallsgeneratoren, Lösungen, Geometrie), Merkzettel, Sprache, Oberfläche und Generalprobe.
cd "$(dirname "$0")"
sed -n '/<script>/,/<\/script>/p' ../index.html | sed '1d;$d' > /tmp/lw_check.js
node --check /tmp/lw_check.js && node run2.js /tmp/lw_check.js && node merkcheck.js /tmp/lw_check.js && node textcheck.js /tmp/lw_check.js && node ui.js ../index.html | grep -v '^OK' && node ui_generalprobe.js ../index.html | grep -v '^OK' && node ui_darstellung.js ../index.html | grep -v '^OK' && node ui_uebungszeit.js ../index.html | grep -v '^OK'
