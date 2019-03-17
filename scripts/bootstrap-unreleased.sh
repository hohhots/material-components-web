#!/usr/bin/env bash

# create link in node_modules/@mongol for mongol web component developement. 

set -e

packages=(`find packages -name "package.json" | xargs -I '{}' dirname '{}'`)

cd=(`pwd`)
for package in ${packages[@]}; do
  npmname=`node -e "console.log(require(\"${cd}/${package}/package.json\").name)"`
  if [ ! -L ${cd}/node_modules/${npmname} ]; then
    ln -sfv ${cd}/${package} ${cd}/node_modules/${npmname}
  fi
done