<?php

namespace App\Infrastructure;

use Illuminate\Http\Client\Factory;
use Sylph\Application\Events\ActivityChangedEventPayload;
use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\WebHook;

class LaravelWebHookServer implements WebHookServer
{
    public function __construct(private Factory $clientFactory)
    {
        //
    }

    private const TIMEOUT_SECONDS = 60 * 3;

    /** {@inheritdoc} */
    public function send(WebHook $webHook, ActivityChangedEventPayload $payload): void
    {
        $this->clientFactory
            ->timeout(self::TIMEOUT_SECONDS)
            ->post($webHook->getDestination()->__toString(), $payload->jsonSerialize());
    }
}
