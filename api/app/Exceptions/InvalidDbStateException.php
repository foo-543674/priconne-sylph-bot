<?php

namespace App\Exceptions;

/**
 * DBに永続化された値が想定してない状態のときに発生する例外
 */
class InvalidDbStateException extends \Exception
{
    //
}