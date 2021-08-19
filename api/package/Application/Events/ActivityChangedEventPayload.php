<?php

namespace Sylph\Application\Events;

use JsonSerializable;
use Sylph\Entities\Activity;
use Sylph\Entities\CarryOver;
use Sylph\Entities\Challenge;
use Sylph\Entities\Clan;
use Sylph\Entities\ClanBattleDate;
use Sylph\Entities\Member;
use Sylph\Entities\TaskKill;
use YaLinqo\Enumerable;

/**
 * クランバトルで何らかの行動がされた時に発生するイベントの通知内容
 */
class ActivityChangedEventPayload implements JsonSerializable
{
    /**
     * @param Clan $clan
     * @param Member[] $members
     * @param ClanBattleDate[] $dates
     * @param Activity[] $activities
     */
    public function __construct(
        private Clan $clan,
        private $members,
        private $dates,
        private $activities,
    ) {
        //
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "name" => $this->clan->getName(),
            "members" => Enumerable::from($this->members)
                ->select(fn (Member $member) => $member->getName())
                ->toList(),
            "activities" => Enumerable::from($this->dates)
                ->select(fn (ClanBattleDate $date) => [
                    "date" => $date->getDate()->__toString(),
                    "members" => Enumerable::from($this->members)
                        ->select(fn (Member $member) => [
                            "name" => $member->getName(),
                            "challenged" => Enumerable::from($this->activities)
                                ->where(fn (Activity $activity) => ($activity instanceof Challenge
                                    && $activity->getActedMemberId() == $member->getId()
                                    && $activity->getActedDateId() == $date->getId()))->count(),
                            "carryOvered" => Enumerable::from($this->activities)
                                ->where(fn (Activity $activity) => ($activity instanceof CarryOver
                                    && $activity->getActedMemberId() == $member->getId()
                                    && $activity->getActedDateId() == $date->getId()))->count(),
                            "taskKilled" => Enumerable::from($this->activities)
                                ->where(fn (Activity $activity) => ($activity instanceof TaskKill
                                    && $activity->getActedMemberId() == $member->getId()
                                    && $activity->getActedDateId() == $date->getId()))->any(),
                        ])->toList()
                ])->toList()
        ];
    }
}
