<?php

namespace Sylph\Entities;

use GuzzleHttp\Psr7\Uri;
use Sylph\VO\WebHookId;

/**
 * 更新時の通知先
 */
class WebHook
{
    public function __construct(
        private WebHookId $id,
        private Uri $destination,
    ) {
        //
    }

    public function getId(): WebHookId
    {
        return $this->id;
    }

    public function getDestination(): Uri
    {
        return $this->destination;
    }
}
