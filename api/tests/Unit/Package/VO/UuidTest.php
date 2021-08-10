<?php

namespace Tests\Package\VO;

use InvalidArgumentException;
use PHPUnit\Framework\TestCase;
use Sylph\VO\Uuid;
use Tests\AssertNotThrow;

class UuidTest extends TestCase
{
    use AssertNotThrow;

    /**
     * @test
     */
    public function shouldBeErrorWhenValueDoesNotHaveCampatibleWithUuid(): void
    {
        $this->expectException(InvalidArgumentException::class);

        new Uuid("not uuid string");
    }

    /**
     * @test
     * @dataProvider uuidProvider
     */
    public function shouldAbleToBeInstanceWhenValueHasCompatibleWithUuid(string $value): void
    {
        $this->assertNotThrow(fn () => new Uuid($value));
    }
    public function uuidProvider(): array
    {
        return [
            "all 0" => [
                "value" => "00000000-0000-0000-0000-000000000000"
            ],
            "lower case" => [
                "value" => "03f91900-c615-b685-3441-19303dfb829e"
            ],
            "upper case" => [
                "value" => "8A46D021-B22F-B306-B24A-1C45883DD325"
            ]
        ];
    }

    /**
     * @test
     */
    public function shouldGenerateBlankUuid(): void
    {
        $result = Uuid::createBlank();

        $this->assertTrue($result->isBlank());
    }
}
