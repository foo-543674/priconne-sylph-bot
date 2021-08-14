<?php

namespace Sylph\Application\Support;

use Sylph\Application\Errors\ValidationException;

/**
 * エラーを発生させる
 */
class ErrorIgnition
{
    public function __construct(private MessageResolver $messageResolver)
    {
        //
    }

    /**
     * ValidationExceptionを投げる
     */
    public function throwValidationError(string $key, string ...$params): void
    {
        throw new ValidationException($this->messageResolver->get($key, ...$params));
    }
}
