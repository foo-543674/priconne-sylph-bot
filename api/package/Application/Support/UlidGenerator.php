<?php

namespace Sylph\Application\Support;

use Ulid\Ulid;

/**
 * Ulidを生成する
 */
interface UlidGenerator
{
    /**
     * Ulidを新規作成する
     */
    public function generate(): Ulid;
}
