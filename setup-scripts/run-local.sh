#!/bin/bash
export CWD=$(pwd)
export BUILD_STAGE=development
export BUILD_SERVICE=master-boilerplate

source $CWD/setup-scripts/variables/$BUILD_STAGE.sh

bash ${CWD}/setup-scripts/deploy.sh
