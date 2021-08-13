<?php

namespace Tests\Unit\Package\Entities;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Sylph\Entities\Member;
use Sylph\Errors\DomainValidationException;
use Sylph\VO\CarryOverId;
use Sylph\VO\ChallengeId;
use Sylph\VO\Date;
use Sylph\VO\MemberId;
use Sylph\VO\TaskKillId;
use Tests\AssertNotThrow;
use Ulid\Ulid;

/**
 * @group domain
 */
class MemberTest extends \PHPUnit\Framework\TestCase
{
    use MockeryPHPUnitIntegration;
    use AssertNotThrow;

    /**
     * @test
     */
    public function shouldAbleToAddThreeChallengesByDay(): void
    {
        $this->assertNotThrow(function () {
            $target = new Member(new MemberId("id"), "name");

            $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
            $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
            $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
            $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-13"));
            $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-13"));
        });
    }

    /**
     * @test
     */
    public function shouldBeErrorWhenFourthChallengeAddedByTheDay(): void
    {
        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage("Member can challenge only 3 times by day");

        $target = new Member(new MemberId("id"), "name");

        $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
        $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
        $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
        $target->addChallenge(new ChallengeId(Ulid::generate()), new Date("2021-08-12"));
    }

    /**
     * @test
     */
    public function shouldAbleToAddTowCarryOversByDay(): void
    {
        $this->assertNotThrow(function () {
            $target = new Member(new MemberId("id"), "name");

            $target->addCarryOver(new CarryOverId(Ulid::generate()), new Date("2021-08-12"));
            $target->addCarryOver(new CarryOverId(Ulid::generate()), new Date("2021-08-12"));
            $target->addCarryOver(new CarryOverId(Ulid::generate()), new Date("2021-08-13"));
        });
    }

    /**
     * @test
     */
    public function shouldBeErrorWhenThirdCarryOverAddedByTheDay(): void
    {
        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage("Member can has only 2 carry overs by day");

        $target = new Member(new MemberId("id"), "name");

        $target->addCarryOver(new CarryOverId(Ulid::generate()), new Date("2021-08-12"));
        $target->addCarryOver(new CarryOverId(Ulid::generate()), new Date("2021-08-12"));
        $target->addCarryOver(new CarryOverId(Ulid::generate()), new Date("2021-08-12"));
    }

    /**
     * @test
     */
    public function shouldAbleToAddOneTaskKillByDay(): void
    {
        $this->assertNotThrow(function () {
            $target = new Member(new MemberId("id"), "name");

            $target->addTaskKill(new TaskKillId(Ulid::generate()), new Date("2021-08-12"));
            $target->addTaskKill(new TaskKillId(Ulid::generate()), new Date("2021-08-13"));
        });
    }

    /**
     * @test
     */
    public function shouldBeErrorWhenSecondTaskKillAddedByTheDay(): void
    {
        $this->expectException(DomainValidationException::class);
        $this->expectExceptionMessage("Member can uses task kill only 1 time by day");

        $target = new Member(new MemberId("id"), "name");

        $target->addTaskKill(new TaskKillId(Ulid::generate()), new Date("2021-08-12"));
        $target->addTaskKill(new TaskKillId(Ulid::generate()), new Date("2021-08-12"));
    }

    /**
     * @test
     */
    public function shouldAbleToSerializeToJson(): void
    {
        $target = new Member(new MemberId("id_1111"), "name_foo");

        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCX9KJQCKEBZ59ZEMR0ZDDA3")), new Date("2021-08-12"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCX9MFSMWNCQ10AWECPZG5FG")), new Date("2021-08-12"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCXA2F1P9PZQCF3W352F12V2")), new Date("2021-08-12"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCX9MZ34QJKVMDT7BSE0KBT8")), new Date("2021-08-13"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCX9NMSFDCRYKC5H8HH7G4T1")), new Date("2021-08-13"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCX9NX9011H3QMYFS0902804")), new Date("2021-08-13"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCXA2RQQWGX3VNMV74XSR3R1")), new Date("2021-08-14"));
        $target->addChallenge(new ChallengeId(Ulid::fromString("01FCXA2ZAET17133SFX1EQSEYE")), new Date("2021-08-14"));

        $target->addCarryOver(new CarryOverId(Ulid::fromString("01FCXA1A80Y0ARWY9HA5YMJR7F")), new Date("2021-08-12"));
        $target->addCarryOver(new CarryOverId(Ulid::fromString("01FCXA1HMKWG39RRP03T71RMPR")), new Date("2021-08-12"));
        $target->addCarryOver(new CarryOverId(Ulid::fromString("01FCXA3NH8ENS1QP3Z83HN65TR")), new Date("2021-08-14"));

        $target->addTaskKill(new TaskKillId(Ulid::fromString("01FCXA53ZHAFSNDR6W98ZBQQH3")), new Date("2021-08-13"));
        $target->addTaskKill(new TaskKillId(Ulid::fromString("01FCXA5B8MBY5N8JBWT0A6J0T5")), new Date("2021-08-14"));

        $expectation = [
            "id" => "id_1111",
            "name" => "name_foo",
            "activities" => [
                [
                    "date" => "2021-08-12",
                    "challenged_count" => 3,
                    "carried_over_count" => 2,
                    "used_task_kill" => false,
                ],
                [
                    "date" => "2021-08-13",
                    "challenged_count" => 3,
                    "carried_over_count" => 0,
                    "used_task_kill" => true,
                ],
                [
                    "date" => "2021-08-14",
                    "challenged_count" => 2,
                    "carried_over_count" => 1,
                    "used_task_kill" => true,
                ],
            ]
        ];

        $this->assertSame(json_encode($expectation), json_encode($target));
    }
}
