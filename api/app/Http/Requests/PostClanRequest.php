<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Sylph\VO\DiscordGuildId;

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
            "discordGuildId" => ["required", "string"],
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            'clanName' => 'クラン名',
            'discordGuildId' => 'DiscordのサーバーID',
        ];
    }

    public function getClanName(): string
    {
        return $this->input("clanName");
    }

    public function getDiscordGuildId(): DiscordGuildId
    {
        return new DiscordGuildId($this->input("discordGuildId"));
    }
}
