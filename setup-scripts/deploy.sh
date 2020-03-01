#!/bin/bash
export CWD=$(pwd)

export REGION=eu-west-1
export BUILD_STAGE=staging
export BUILD_SERVICE=master-boilerplate

source ${CWD}/setup-scripts/variables/${BUILD_STAGE}.sh

bash ${CWD}/setup-scripts/build.sh

rm -f .terraform/terraform.tfstate

terraform init \
-backend-config="bucket=${S3_TERRAFORM_STATE_BUCKET}" \
-backend-config="key=$S3_TERRAFORM_STATE_KEY_PREFIX/${SERVICE}/${STAGE}.tfstate" \
-backend-config="region=${S3_TERRAFORM_STATE_REGION}" ${CWD}/infrastructure/terraform

terraform apply -no-color -auto-approve ${CWD}/infrastructure/terraform

terraform output \
 -json \
 | jq 'with_entries(.value |= .value)' > infrastructure/terraform-state.json
