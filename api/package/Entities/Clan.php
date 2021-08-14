<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\VO\ClanId;

/**
 * クラン
 */
class Clan implements JsonSerializable
{
    public function __construct(
        private ClanId $id,
        private string $name,
    ) {
        //
    }

    public function getId(): ClanId
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "name" => $this->name,
        ];
    }
}
