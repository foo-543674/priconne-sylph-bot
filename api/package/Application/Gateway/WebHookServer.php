<?php

namespace Sylph\Application\Gateway;

use Sylph\Application\Events\ActivityChangedEventPayload;
use Sylph\Entities\WebHook;

/**
 * WebHookを送信するサーバー
 */
interface WebHookServer
{
    /**
     * WebHookを送信する
     */
    public function send(WebHook $webHook, ActivityChangedEventPayload $payload): void;
}
