<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostClanRequest extends FormRequest
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
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            'clanName' => 'クラン名',
        ];
    }

    public function getClanName(): string
    {
        return $this->input("clanName");
    }
}
