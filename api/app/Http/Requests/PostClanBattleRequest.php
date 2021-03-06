<?php

namespace App\Http\Requests;

use DateTime;
use Sylph\VO\Date;
use Illuminate\Foundation\Http\FormRequest;

class PostClanBattleRequest extends FormRequest
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
            "since" => ["date", "required"],
            "until" => ["date", "required"],
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            'since' => '開始日',
            'until' => '終了日',
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
