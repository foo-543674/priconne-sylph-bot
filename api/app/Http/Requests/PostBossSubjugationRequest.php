<?php

namespace App\Http\Requests;

use Sylph\VO\BossNumber;
use Sylph\VO\DiscordChannelId;
use Illuminate\Foundation\Http\FormRequest;

class PostBossSubjugationRequest extends FormRequest
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
            "bossNumber" => ["required", "numeric", "between:1,5"],
            "discordChannelId" => ["required", "string"],
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            "bossNumber" => 'ボス番号',
            "discordChannelId" => 'DiscordのチャンネルID',
        ];
    }

    public function getBossNumber(): BossNumber
    {
        return new BossNumber($this->input("bossNumber"));
    }

    public function getDiscordChannelId(): DiscordChannelId
    {
        return new DiscordChannelId($this->input("discordChannelId"));
    }
}
