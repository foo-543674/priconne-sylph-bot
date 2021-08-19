<?php

namespace App\Http\Requests;

use GuzzleHttp\Psr7\Uri;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;

class PostWebHookRequest extends FormRequest
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
     * 勝手にリダイレクトさせない
     */
    protected function failedValidation(Validator $validator)
    {
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "clanName" => ["required", "string"],
            "destination" => ["required", "url"],
        ];
    }

    public function getClanName(): string
    {
        return $this->input("clanName");
    }

    public function getDestination(): Uri
    {
        return new Uri($this->input("destination"));
    }
}
