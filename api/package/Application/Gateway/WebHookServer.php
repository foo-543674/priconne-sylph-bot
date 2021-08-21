<?php

namespace Sylph\Application\Gateway;

use JsonSerializable;
use Sylph\Entities\WebHook;

/**
 * WebHookを送信するサーバー
 */
interface WebHookServer
{
    /**
     * WebHookを送信する
     */
    public function send(WebHook $webHook, JsonSerializable $payload): void;
}
