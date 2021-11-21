<?php

namespace Tests\Unit\Package\Domain;

use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Sylph\Domain\DiscordUser;
use Sylph\Domain\MemberSynchronizeResult;
use Sylph\Entities\Member;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\MemberId;
use Ulid\Ulid;

/**
 * @group Domain
 */
class MemberSynchronizeResultTest extends \PHPUnit\Framework\TestCase
{
    use MockeryPHPUnitIntegration;

    public function setUp(): void
    {
        parent::setUp();

        $this->clanId  = new ClanId(Ulid::fromString("01FN0S14ME6S8ZNHVWGW92S4WZ"));
        $this->registerUsers = [
            new DiscordUser(new DiscordUserId("foo"), "foo"),
            new DiscordUser(new DiscordUserId("bar"), "bar"),
            new DiscordUser(new DiscordUserId("baz"), "baz"),
            new DiscordUser(new DiscordUserId("qux"), "qux"),
            new DiscordUser(new DiscordUserId("quux"), "quux"),
            new DiscordUser(new DiscordUserId("corge"), "corge"),
            new DiscordUser(new DiscordUserId("grault"), "grault"),
        ];
        $this->currentMembers = [
            new Member(new MemberId(Ulid::fromString("01FN0RYT9G9FJF9T396HTDW2JK")), "foo", new DiscordUserId("foo"), $this->clanId),
            new Member(new MemberId(Ulid::fromString("01FN0S4TE7XBE2MCYNA651KH7N")), "baz", new DiscordUserId("baz"), $this->clanId),
            new Member(new MemberId(Ulid::fromString("01FN0S5237M0NVQ15QS3XS2Z3P")), "quux", new DiscordUserId("quux"), $this->clanId),
            new Member(new MemberId(Ulid::fromString("01FN0S8598JXRA6ZA0576CGKKN")), "garply", new DiscordUserId("garply"), $this->clanId),
            new Member(new MemberId(Ulid::fromString("01FN0S8CTS95XCV11A24ZQHRFF")), "waldo", new DiscordUserId("waldo"), $this->clanId),
            new Member(new MemberId(Ulid::fromString("01FN0S8P44JGC0Y6C3AVFBJD0S")), "fred", new DiscordUserId("fred"), $this->clanId),
        ];
    }

    /** @var ClanId */
    private $clanId;

    /** @var DiscordUser[] $registerUsers */
    private $registerUsers;

    /** @var Member[] $currentMembers */
    private $currentMembers;

    /**
     * @test
     */
    public function getNewMembersTest(): void
    {
        $target = new MemberSynchronizeResult($this->registerUsers, $this->currentMembers);

        $this->assertEquals([
            $this->registerUsers[1],
            $this->registerUsers[3],
            $this->registerUsers[5],
            $this->registerUsers[6],
        ], $target->getNewMembers());
    }

    /**
     * @test
     */
    public function getLeftMembersTest(): void
    {
        $target = new MemberSynchronizeResult($this->registerUsers, $this->currentMembers);

        $this->assertEquals([
            $this->currentMembers[3],
            $this->currentMembers[4],
            $this->currentMembers[5],
        ], $target->getLeftMembers());
    }

    /**
     * @test
     */
    public function getContinuationMembersTest(): void
    {
        $target = new MemberSynchronizeResult($this->registerUsers, $this->currentMembers);

        $this->assertEquals([
            $this->currentMembers[0],
            $this->currentMembers[1],
            $this->currentMembers[2],
        ], $target->getContinuationMembers());
    }
}
