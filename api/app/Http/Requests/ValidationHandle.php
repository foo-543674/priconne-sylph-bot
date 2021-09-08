<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;
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
            400
        );
        throw new HttpResponseException($res);
    }
}