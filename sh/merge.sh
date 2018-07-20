git checkout master
git pull imofish develop master
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m pull develop branch fail!"
  exit 1
fi
echo "pull develop branch success"
git push imofish master
if [ "$?" -ne 0 ]; then
  echo -e "\033[31m[Error]\033[0m push master fail!"
  exit 1
fi
echo "push master and merge success"
git checkout develop