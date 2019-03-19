#!/usr/bin/env bash

# create link for mongol web component packages. 

set -e

for entry in "packages"/*
do
  if [ -d $entry ]; then
    if [ -f $entry/package.json ]; then
      cd $INIT_CWD/$entry
      npm link --only=development
      cd $INIT_CWD
    fi
  fi
done