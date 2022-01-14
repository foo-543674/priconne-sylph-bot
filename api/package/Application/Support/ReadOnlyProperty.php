<?php

namespace Sylph\Application\Support;

trait ReadOnlyProperty
{
    public function __get($name)
    {
        return $this->$name;
    }
}
