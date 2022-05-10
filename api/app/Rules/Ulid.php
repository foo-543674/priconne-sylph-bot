<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Ulid\Exception\InvalidUlidStringException;
use Ulid\Ulid as UlidUlid;

class Ulid implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (strlen($value) !== UlidUlid::TIME_LENGTH + UlidUlid::RANDOM_LENGTH) {
            return false;
        }

        //NOTE: 正規表現を単純化するために大文字化
        $upperValue = strtoupper($value);

        if (!preg_match(sprintf('!^[%s]{%d}$!', UlidUlid::ENCODING_CHARS, UlidUlid::TIME_LENGTH + UlidUlid::RANDOM_LENGTH), $upperValue)) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.ulid');
    }
}
