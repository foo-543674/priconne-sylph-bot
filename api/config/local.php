
<?php

if (env('APP_ENV', 'production') === 'local') {
    return [
        'DEFAULT_API_KEY' => env('API_KEY', ''),
    ];
}

return [];