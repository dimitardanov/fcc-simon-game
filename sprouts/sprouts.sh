#!/bin/bash

# install prompt package
npm install prompt --save-dev;

# modify package.json
node sprouts/modify-package-json.js;

# install node packages
npm install;

# copy Bootstrap SCSS files
cp -r node_modules/bootstrap-sass/assets/stylesheets/bootstrap/ src/scss/vendors/;
cp node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss src/scss/vendors;

# copy Bootstrap fonts
cp -r node_modules/bootstrap-sass/assets/fonts/bootstrap src/fonts/;


# replace .gitignore
cp sprouts/.gitignore .gitignore

# remove .git directory
rm -rf .git

# replace README.md
cp sprouts/README.md README.md

# remove license info
rm LICENSE

# check for package updates
npm run ncu
