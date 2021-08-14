<?php

namespace Tests\Unit\Package\Entities;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Sylph\Entities\Challenge;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateid;
use Sylph\VO\MemberId;
use Tests\Common\BlankUlid;
use Ulid\Ulid;

/**
 * @group domain
 */
class ChallengeTest extends \PHPUnit\Framework\TestCase
{
    use MockeryPHPUnitIntegration;

    /**
     * @test
     */
    public function canAddWhenCountByMemberAndByDateIsLessThen3(): void
    {
        $memberIdStub = new MemberId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));
        $dateIdStub = new ClanBattleDateid(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));

        $target = new Challenge(
            new ActivityId(BlankUlid::get()),
            $memberIdStub,
            $dateIdStub,
        );

        $activitiesStub = [
            new Challenge(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateid(BlankUlid::get()),
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateid(BlankUlid::get()),
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateid(BlankUlid::get()),
            ),
        ];

        $this->assertTrue($target->canAct(...$activitiesStub));
    }

    /**
     * @test
     */
    public function canNotAddWhenCountByMemberAndByDateIsOverOrEqualsThen3(): void
    {
        $memberIdStub = new MemberId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));
        $dateIdStub = new ClanBattleDateid(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));

        $target = new Challenge(
            new ActivityId(BlankUlid::get()),
            $memberIdStub,
            $dateIdStub,
        );

        $activitiesStub = [
            new Challenge(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateid(BlankUlid::get()),
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateid(BlankUlid::get()),
            ),
            new Challenge(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
        ];

        $this->assertFalse($target->canAct(...$activitiesStub));
    }
}
