<?php

namespace Sylph\Entities;

use GuzzleHttp\Psr7\Uri;
use JsonSerializable;
use Sylph\VO\ClanId;
use Sylph\VO\WebHookId;

/**
 * 更新時の通知先
 */
class WebHook implements JsonSerializable
{
    public function __construct(
        private WebHookId $id,
        private Uri $destination,
        private ClanId $clanId
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

    public function getClanId(): ClanId
    {
        return $this->clanId;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "destination" => $this->destination->__toString(),
            "clanId" => $this->clanId->__toString(),
        ];
    }
}
