<?php

namespace Tests\Unit\Package\Entities;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Sylph\Entities\TaskKill;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\MemberId;
use Tests\Common\BlankUlid;
use Ulid\Ulid;

/**
 * @group domain
 */
class TaskKillTest extends \PHPUnit\Framework\TestCase
{
    use MockeryPHPUnitIntegration;

    /**
     * @test
     */
    public function canAddWhenTaskKillByMemberAndByDateExists(): void
    {
        $memberIdStub = new MemberId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));
        $dateIdStub = new ClanBattleDateId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));

        $target = new TaskKill(
            new ActivityId(BlankUlid::get()),
            $memberIdStub,
            $dateIdStub,
        );

        $activitiesStub = [
            new TaskKill(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateId(BlankUlid::get()),
            ),
        ];

        $this->assertTrue($target->canAct(...$activitiesStub));
    }

    /**
     * @test
     */
    public function canNotAddWhenTaskKillByMemberAndByDateIsNotExists(): void
    {
        $memberIdStub = new MemberId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));
        $dateIdStub = new ClanBattleDateId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));

        $target = new TaskKill(
            new ActivityId(BlankUlid::get()),
            $memberIdStub,
            $dateIdStub,
        );

        $activitiesStub = [
            new TaskKill(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateId(BlankUlid::get()),
            ),
            new TaskKill(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
        ];

        $this->assertFalse($target->canAct(...$activitiesStub));
    }
}
