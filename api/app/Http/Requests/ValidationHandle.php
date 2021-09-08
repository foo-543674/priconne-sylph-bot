<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * バリデーションの処理モジュール
 */
trait ValidationHandle
{
    /**
     * {@inheritdoc}
     */
    protected function failedValidation(Validator $validator)
    {
        $res = response()->json(
            $validator->errors()->first(),
            400,
            options: JSON_UNESCAPED_UNICODE
        );
        throw new HttpResponseException($res);
    }
}