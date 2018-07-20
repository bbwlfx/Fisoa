git pull --rebase origin master
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m pull code from gitee error!"
  exit 1
fi
echo "-----git pull success!"

rm -rf ./node_modules
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m Finder node_modules is not exist"
fi
echo "-----Finder node_modules delete success"

rm -rf ./assets
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m Finder assets is not exist"
fi
echo "-----Finder assets delete success"

npm install
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m npm install error"
fi
echo "-----npm install success"

npm run buildfe
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m npm run buildfe fail!"
  exit 1
fi
echo "-----buildfe success"

node ./scripts/makeVersionFile.js
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m make versionFile fail!"
  exit 1
fi
echo "-----make versionFile"

pm2 kill
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m pm2 kill Fisoa error!"
  exit 1
fi
npm run build
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m run build error!"
  exit 1
fi
echo "-----process start success!"
