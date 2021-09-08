<?php

namespace App\Http\Requests;

use DateTime;
use Sylph\VO\Date;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PostClanBattleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    protected function failedValidation(Validator $validator)
    {
        $res = response()->json(
            $validator->errors()->first()[0],
            400
        );
        throw new HttpResponseException($res);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "since" => ["date", "required"],
            "until" => ["date", "required"],
        ];
    }

    public function getSince(): Date
    {
        return new Date(new DateTime($this->input("since")));
    }

    public function getUntil(): Date
    {
        return new Date(new DateTime($this->input("until")));
    }
}
