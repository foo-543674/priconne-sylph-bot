<?php

namespace Tests\Unit\Package\Entities;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Sylph\Entities\CarryOver;
use Sylph\VO\ActivityId;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\MemberId;
use Tests\Common\BlankUlid;
use Ulid\Ulid;

/**
 * @group domain
 */
class CarryOverest extends \PHPUnit\Framework\TestCase
{
    use MockeryPHPUnitIntegration;

    /**
     * @test
     */
    public function canAddWhenCountByMemberAndByDateIsLessThen2(): void
    {
        $memberIdStub = new MemberId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));
        $dateIdStub = new ClanBattleDateId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));

        $target = new CarryOver(
            new ActivityId(BlankUlid::get()),
            $memberIdStub,
            $dateIdStub,
        );

        $activitiesStub = [
            new CarryOver(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
            new CarryOver(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateId(BlankUlid::get()),
            ),
            new CarryOver(
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
    public function canNotAddWhenCountByMemberAndByDateIsOverOrEqualsThen2(): void
    {
        $memberIdStub = new MemberId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));
        $dateIdStub = new ClanBattleDateId(Ulid::fromString("01FD1QV0VAP86QEAWSRKFN6HQJ"));

        $target = new CarryOver(
            new ActivityId(BlankUlid::get()),
            $memberIdStub,
            $dateIdStub,
        );

        $activitiesStub = [
            new CarryOver(
                new ActivityId(BlankUlid::get()),
                new MemberId(BlankUlid::get()),
                new ClanBattleDateId(BlankUlid::get()),
            ),
            new CarryOver(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
            new CarryOver(
                new ActivityId(BlankUlid::get()),
                $memberIdStub,
                $dateIdStub,
            ),
        ];

        $this->assertFalse($target->canAct(...$activitiesStub));
    }
}
