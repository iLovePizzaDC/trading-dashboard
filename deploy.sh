#!/bin/bash
set -e

npm run build

rsync -r --delete --exclude='data/' dist/ nicob@luna:/var/www/trading/
