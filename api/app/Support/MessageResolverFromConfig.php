<?php

namespace App\Support;

use Illuminate\Config\Repository;
use Sylph\Application\Support\MessageResolver;

class MessageResolverFromConfig implements MessageResolver
{
    public function __construct(private Repository $configRepository)
    {
        //
    }

    private const DEFAULT_ERROR_MESSAGE = "原因不明のエラーが発生したよ";
    private const CONFIG_ROOT = "messages.errors";

    /** {@inheritdoc} */
    public function get(string $key, string ...$params): string
    {
        $message = $this->configRepository->get(self::CONFIG_ROOT . "." . $key, self::DEFAULT_ERROR_MESSAGE);

        return sprintf($message, ...$params);
    }
}
