docker-compose up -d --remove-orphans --no-recreate
cd ../api
./setup-data.sh
php artisan serve