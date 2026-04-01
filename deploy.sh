#!/bin/bash
npm run build
rsync -av --exclude='data/' dist/ nicob@luna:/var/www/trading/
