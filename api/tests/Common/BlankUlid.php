<?php

namespace Tests\Common;

use Ulid\Ulid;

class BlankUlid
{
    /**
     * 固定値のULIDを返す
     */
    public static function get(): Ulid
    {
        return Ulid::fromString("0000000000AAAAAAAAAAAAAAAA");
    }
}
