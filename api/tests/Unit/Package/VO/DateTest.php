<?php

namespace Tests\Unit\Package\VO;

use DateTime;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Sylph\VO\Date;

/**
 * @group domain
 */
class DateTest extends \PHPUnit\Framework\TestCase
{
    use MockeryPHPUnitIntegration;

    /**
     * @test
     */
    public function shouldTruncateTime(): void
    {
        $target = new Date(
            new DateTime("2021-08-11 15:38:16"),
        );

        $this->assertEquals(new DateTime("2021-08-11"), $target->getValue());
    }

    /**
     * @test
     * @dataProvider datePeriodProvider
     */
    public function shouldCalculateDateDiff(string $targetValue, string $other, int $expectation): void
    {
        $target = new Date(new DateTime($targetValue));

        $this->assertSame($expectation, $target->calculateDiff(new Date(new DateTime($other))));
    }
    public function datePeriodProvider(): array
    {
        return [
            "less date" => [
                "target" => "2021-08-30",
                "other" => "2021-08-26",
                "expectation" => 4,
            ],
            "greater date" => [
                "target" => "2021-08-25",
                "other" => "2021-08-31",
                "expectation" => 6,
            ],
        ];
    }

    /**
     * @test
     * @dataProvider dateAddTestProvider
     */
    public function shouldAddDays(string $initial, int $addend, string $expectation): void
    {
        $target = new Date(new DateTime($initial));

        $result = $target->addDays($addend);

        $this->assertSame($expectation, $result->__toString());
    }
    public function dateAddTestProvider(): array
    {
        return [
            "positive" => [
                "initial" => "2021-09-20",
                "addend" => 5,
                "expectation" => "2021-09-25",
            ],
            "negative" => [
                "initial" => "2021-09-15",
                "addend" => -3,
                "expectation" => "2021-09-12",
            ],
        ];
    }
}
