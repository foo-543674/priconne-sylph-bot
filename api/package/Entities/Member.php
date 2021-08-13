<?php

namespace Sylph\Entities;

use JsonSerializable;
use Sylph\Common\DailyActionCollection;
use Sylph\VO\CarryOverId;
use Sylph\VO\ChallengeId;
use Sylph\VO\Date;
use Sylph\VO\MemberId;
use Sylph\VO\TaskKillId;
use YaLinqo\Enumerable;

/**
 * クランメンバー
 */
class Member implements JsonSerializable
{
    private const MAX_CHALLENGES_BY_DAY = 3;
    private const CHALLENGES_LIMIT_OVERED_ERROR_MESSAGE = "Member can challenge only %d times by day";
    private const MAX_CARRY_OVERS_BY_DAY = 2;
    private const CARRY_OVERS_LIMIT_OVERED_ERROR_MESSAGE = "Member can has only %d carry overs by day";
    private const MAX_TASK_KILLS_BY_DAY = 1;
    private const TASK_KILLS_LIMIT_OVERED_ERROR_MESSAGE = "Member can uses task kill only %d time by day";

    public function __construct(
        private MemberId $id,
        private string $name,
    ) {
        $this->challenges = new DailyActionCollection(
            self::MAX_CHALLENGES_BY_DAY,
            sprintf(self::CHALLENGES_LIMIT_OVERED_ERROR_MESSAGE, self::MAX_CHALLENGES_BY_DAY)
        );
        $this->carryOvers = new DailyActionCollection(
            self::MAX_CARRY_OVERS_BY_DAY,
            sprintf(self::CARRY_OVERS_LIMIT_OVERED_ERROR_MESSAGE, self::MAX_CARRY_OVERS_BY_DAY)
        );
        $this->taskKills = new DailyActionCollection(
            self::MAX_TASK_KILLS_BY_DAY,
            sprintf(self::TASK_KILLS_LIMIT_OVERED_ERROR_MESSAGE, self::MAX_TASK_KILLS_BY_DAY)
        );
    }

    /**
     * 状態を復元する
     *
     * @param MemberId $id
     * @param string $name
     * @param Challenge[] $challenges
     * @param CarryOver[] $carryOvers
     * @param TaskKill[] $taskKills
     * @return self
     */
    public static function reconstruct(
        MemberId $id,
        string $name,
        $challenges,
        $carryOvers,
        $taskKills
    ): self {
        $result = new self($id, $name);
        $result->challenges = new DailyActionCollection(
            self::MAX_CHALLENGES_BY_DAY,
            self::CHALLENGES_LIMIT_OVERED_ERROR_MESSAGE,
            ...$challenges
        );
        $result->carryOvers = new DailyActionCollection(
            self::MAX_CARRY_OVERS_BY_DAY,
            self::CARRY_OVERS_LIMIT_OVERED_ERROR_MESSAGE,
            ...$carryOvers
        );
        $result->taskKills = new DailyActionCollection(
            self::MAX_TASK_KILLS_BY_DAY,
            self::TASK_KILLS_LIMIT_OVERED_ERROR_MESSAGE,
            ...$taskKills
        );

        return $result;
    }

    public function getId(): MemberId
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    /** @var DailyActionCollection */
    private $challenges;
    /**
     * @return Challenge[]
     */
    public function getChallenges()
    {
        return iterator_to_array($this->challenges);
    }
    /**
     * 凸を追加する
     */
    public function addChallenge(ChallengeId $id, Date $date): void
    {
        $this->challenges->addAction(new Challenge($id, $date));
    }

    /** @var DailyActionCollection */
    private $carryOvers;
    /**
     * @return CarryOver[]
     */
    public function getCarryOvers()
    {
        return iterator_to_array($this->carryOvers);
    }
    /**
     * 持ち越しを追加する
     */
    public function addCarryOver(CarryOverId $id, Date $date): void
    {
        $this->carryOvers->addAction(new CarryOver($id, $date));
    }

    /** @var DailyActionCollection */
    private $taskKills;
    /**
     * @return TaskKill[]
     */
    public function getTaskKills()
    {
        return iterator_to_array($this->taskKills);
    }
    /**
     * タスキルを追加する
     */
    public function addTaskKill(TaskKillId $id, Date $date): void
    {
        $this->taskKills->addAction(new TaskKill($id, $date));
    }

    /** {@inheritdoc} */
    public function jsonSerialize()
    {
        return [
            "id" => $this->id->__toString(),
            "name" => $this->name,
            "activities" => Enumerable::from($this->challenges)
                ->groupBy(fn (Challenge $challenge) => $challenge->getActedAt()->__toString())
                ->select(
                    fn ($group, $key) =>
                    [
                        "date" => $key,
                        "challenged_count" => count($group),
                        "carried_over_count" => $this->carryOvers->getCountOfActedAt(new Date($key)),
                        "used_task_kill" => $this->taskKills->isActedAt(new Date($key))
                    ]
                )->toList()
        ];
    }
}
