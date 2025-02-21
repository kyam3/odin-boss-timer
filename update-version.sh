#!/bin/bash

# ファイルの最終更新日時を取得
LAST_MODIFIED=$(date -r index.html '+%Y-%m-%d %H:%M:%S')

# index.html内の<!-- LAST_MODIFIED -->を最終更新日時に置き換え
sed -i "s/<!-- LAST_MODIFIED -->/$LAST_MODIFIED/" index.html
