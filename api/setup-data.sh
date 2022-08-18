php artisan migrate
KEY_NAME=api
GENERATE_KEY_RESULT=`php artisan apikey:generate $KEY_NAME`
KEY=`echo $GENERATE_KEY_RESULT | sed -r "s/API key created Name: .+ Key: (.+)/\1/"`
echo $KEY
echo "export API_KEY=$KEY" >> ~/.bashrc
