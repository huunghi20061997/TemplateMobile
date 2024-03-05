#./sh or sh >> upload-archive.sh FILE_PATH APP_ID VERSION_NAME BUILD_NUMBER BUILD_TYPE URL API_KEY

#!/bin/bash

#The Url form cli argument no 666
# URL='https://betaerp.tgdd.vn/mwg-app-microapp-service/api/micro/uploadapp/internal'
URL='https://erpapp.tgdd.vn/mwg-app-microapp-service/api/micro/uploadapp/internal'
JENKINS_DIR="/Users/nvtuan/Documents/jenkin/SuperSubModule/livestream"

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

APP_NAME=$(cat package.json \
  | grep appName \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

PLATFROM=$(cat package.json \
  | grep platform \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

MODULE_NAME=$(cat package.json \
  | grep moduleName \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

FEATURE_NAME=$(cat package.json \
  | grep featureName \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

ENV=$(cat package.json \
  | grep env \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

FILE_PATH=$(cat package.json \
  | grep patchFile \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

  SECRET_TOKEN=$(cat package.json \
  | grep secret \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo $PACKAGE_VERSION
echo $APP_NAME
echo $PLATFROM
echo $MODULE_NAME
echo $FEATURE_NAME
echo $ENV
echo $FILE_PATH
echo $SECRET_TOKEN
echo $URL

# cd ${JENKINS_DIR}
function parse_git_lastcommit() {
   git log -n 1 --pretty=format:"%cn"
}

GIT_BRANCH=$(parse_git_lastcommit)
#Token upload
# token='aa1c791b-5f69-4599-8371-c77c4d411c00'

echo $FILE_PATH

#Additional params
file_path="${FILE_PATH}"
appName="${APP_NAME}"
versionMain="${PACKAGE_VERSION}"
platform="${PLATFROM}"
moduleName="${MODULE_NAME}"
versionModule="${PACKAGE_VERSION}"
featureName="${FEATURE_NAME}"
activeENV="${ENV}"
secret_token="${SECRET_TOKEN}"
url="${URL}"
mergeUser=${GIT_BRANCH}



echo $mergeUser
#The request
# STATUS_CODE=$(curl --location --request POST "${URL}" \
# --header "Authorization: Bearer ${token}" \
# --form "file=@${file_path}" \
# --form "appName=${appName}" \
# --form "versionMain=${versionMain}" \
# --form "platform=${platform}" \
# --form "versionModule=${versionModule}" \
# --form "featureName=${featureName}" \
# --form "activeENV=${activeENV}" \
# --form "moduleName=${moduleName}")

STATUS_CODE=$(curl --location --request POST "${URL}" \
--form "file=@${file_path}" \
--form "appName=${appName}" \
--form "versionMain=${versionMain}" \
--form "versionModule=${versionModule}" \
--form "platform=${platform}" \
--form "moduleName=${moduleName}" \
--form "featureName=${featureName}" \
--form "mergeUser=${mergeUser}" \
--form "secret = ${secret_token}")





echo $STATUS_CODE
