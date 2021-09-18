<?php

namespace App\Http\Middleware;

use Closure;
use Ejarnutowski\LaravelApiKey\Models\ApiKey;
use Illuminate\Http\Request;
use Psr\Log\LoggerInterface;

class AuthorizeApiKey
{
    public function __construct(private LoggerInterface $logger)
    {
        //
    }

    const AUTH_HEADER = 'X-Authorization';

    /**
     * Handle the incoming request
     *
     * @param Request $request
     * @param Closure $next
     * @return \Illuminate\Contracts\Routing\ResponseFactory|mixed|\Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $header = $request->header(self::AUTH_HEADER);
        $apiKey = ApiKey::getByKey($header);

        if ($apiKey instanceof ApiKey) {
            $this->logAccessEvent($request, $apiKey);
            return $next($request);
        }

        return response([
            'errors' => [[
                'message' => 'Unauthorized'
            ]]
        ], 401);
    }

    /**
     * Log an API key access event
     *
     * @param Request $request
     * @param ApiKey  $apiKey
     */
    protected function logAccessEvent(Request $request, ApiKey $apiKey)
    {
        $this->logger->info(json_encode([
            "apiKeyId" => $apiKey->id,
            "ipAddress" => $request->ip(),
            "url" => $request->fullUrl(),
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
}
