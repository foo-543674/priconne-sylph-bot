<?php

namespace App\Http\Requests;

use GuzzleHttp\Psr7\Uri;
use Illuminate\Foundation\Http\FormRequest;

class PostWebHookRequest extends FormRequest
{
    use ValidationHandle;

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

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            'clanName' => 'クラン名',
            "destination" => '通知先',
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
