<?php

namespace App\Infrastructure;

use Illuminate\Http\Client\Factory;
use JsonSerializable;
use Psr\Log\LoggerInterface;
use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\WebHook;

class LaravelWebHookServer implements WebHookServer
{
    public function __construct(private Factory $clientFactory, private LoggerInterface $logger)
    {
        //
    }

    private const TIMEOUT_SECONDS = 60 * 3;

    /** {@inheritdoc} */
    public function send(WebHook $webHook, JsonSerializable $payload): void
    {
        $this->logger->info("Sending webhook to " . $webHook->getDestination()->__toString());
        $this->logger->info("payload: " . json_encode($payload, JSON_UNESCAPED_UNICODE));

        $this->clientFactory
            ->timeout(self::TIMEOUT_SECONDS)
            ->post($webHook->getDestination()->__toString(), $payload->jsonSerialize());
    }
}
