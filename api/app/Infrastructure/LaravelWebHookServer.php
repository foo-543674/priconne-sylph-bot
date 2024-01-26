<?php

namespace App\Infrastructure;

use Illuminate\Http\Client\Factory;
use JsonSerializable;
use Psr\Log\LoggerInterface;
use GuzzleHttp\Client;
use Sylph\Application\Gateway\WebHookServer;
use Sylph\Entities\WebHook;

class LaravelWebHookServer implements WebHookServer
{
    public function __construct(private LoggerInterface $logger)
    {
        //
    }

    private const TIMEOUT_SECONDS = 60 * 3;

    /** {@inheritdoc} */
    public function send(WebHook $webHook, JsonSerializable $payload): void
    {
        $this->logger->debug("Sending webhook to " . $webHook->getDestination()->__toString());
        $this->logger->debug("payload: " . json_encode($payload, JSON_UNESCAPED_UNICODE));

        $client = new Client(['timeout' => self::TIMEOUT_SECONDS]);
        $client->postAsync($webHook->getDestination()->__toString(), [
            'json' => $payload->jsonSerialize()
        ])->then();
    }
}
