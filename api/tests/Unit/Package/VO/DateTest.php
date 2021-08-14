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
}
