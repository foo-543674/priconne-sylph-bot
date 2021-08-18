<?php

namespace App\Support;

use Sylph\Application\Support\UlidGenerator as UlidGeneratorInterface;
use Ulid\Ulid;

class UlidGenerator implements UlidGeneratorInterface
{
    /** {@inheritdoc} */
    public function generate(): Ulid
    {
        return Ulid::generate();
    }
}
