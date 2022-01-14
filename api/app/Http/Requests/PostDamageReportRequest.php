<?php

namespace App\Http\Requests;

use Sylph\VO\Damage;
use Sylph\VO\BossNumber;
use Sylph\VO\DiscordUserId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordInteractionAppId;
use Illuminate\Foundation\Http\FormRequest;
use Sylph\Application\Usecases\ReportDamageInput;

class PostDamageReportRequest extends FormRequest
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
            "discordChannelId" => ["required", "string"],
            "discordMessageId" => ["required", "string"],
            "discordInteractionAppId" => ["required", "string"],
            "bossNumber" => ["required", "numeric", "between:1,5"],
            "discordUserId" => ["required", "string"],
            "damage" => ["numeric", "min:0"],
            "isCarryOver" => ["boolean"],
            "comment" => ["string"]
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            "discordChannelId" => 'DiscordのチャンネルID',
            "discordMessageId" => 'DiscordのメッセージID',
            "discordInteractionAppId" => 'Discordのコマンドの通しID',
            "bossNumber" => 'ボス番号',
            "discordUserId" => 'DiscordのユーザーID',
            "damage" => 'ダメージ',
            "isCarryOver" => "持ち越し凸",
            "comment" => 'コメント',
        ];
    }


    public function createInput(): ReportDamageInput
    {
        return new ReportDamageInput(
            new DiscordChannelId($this->input('discordChannelId')),
            new DiscordMessageId($this->input('discordMessageId')),
            new DiscordInteractionAppId($this->input('discordInteractionAppId')),
            new BossNumber($this->input('bossNumber')),
            $this->has('damage') ? new Damage($this->input('damage')) : null,
            new DiscordUserId($this->input('discordUserId')),
            $this->has("isCarryOver") ? $this->input("isCarryOver") : false,
            $this->input('comment', ''),
        );
    }
}
