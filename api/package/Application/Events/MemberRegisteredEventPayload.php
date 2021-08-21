<?php

namespace Sylph\Application\Events;

use JsonSerializable;
use Sylph\Entities\Activity;
use Sylph\Entities\Clan;
use Sylph\Entities\Member;
use YaLinqo\Enumerable;

/**
 * クランのメンバーが登録された時の通知内容
 */
class MemberRegisteredEventPayload implements JsonSerializable
{
    /**
     * @param Clan $clan
     * @param Member[] $members
     */
    public function __construct(
        private Clan $clan,
        private $members,
    ) {
        //
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "type" => "MEMBER_REGISTERED",
            "name" => $this->clan->getName(),
            "members" => Enumerable::from($this->members)
                ->select(fn (Member $member) => [
                    "id" => $member->getId(),
                    "name" => $member->getName()
                ])
                ->toList(),
        ];
    }
}
