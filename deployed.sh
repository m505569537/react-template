nginx -s stop
cd /usr/local/nginx/html/react-template
git pull origin master
yarn
yarn build
nginx
nginx -t