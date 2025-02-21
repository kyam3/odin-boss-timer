#!/bin/bash

# ファイルの最終更新日時を取得
LAST_MODIFIED=$(stat --format='%y' index.html | cut -d'.' -f1)

# index.html内の<!-- LAST_MODIFIED -->を最終更新日時に置き換え
sed "s/<!-- LAST_MODIFIED -->/$LAST_MODIFIED/" index.html > temp.html && mv temp.html index.html
