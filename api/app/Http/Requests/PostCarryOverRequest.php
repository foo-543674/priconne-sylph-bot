<?php

namespace App\Http\Requests;

use Sylph\VO\Damage;
use Sylph\VO\BossNumber;
use Sylph\VO\DiscordUserId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use Illuminate\Foundation\Http\FormRequest;
use Sylph\Application\Usecases\CreateCarryOverInput;
use Sylph\Application\Usecases\ReportDamageInput;
use Sylph\VO\CarryOverSecond;
use Sylph\VO\ChallengedType;

class PostCarryOverRequest extends FormRequest
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
            "interactionMessageId" => ["required", "string"],
            "discordUserId" => ["required", "string"],
            "bossNumber" => ["required", "numeric", "between:1,5"],
            "challengedType" => ["required", "string", "in:b,m"],
            "second" => ["required","numeric", "min:20", "max:90"],
            "comment" => ["string"]
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            "discordChannelId" => 'DiscordのチャンネルID',
            "discordMessageId" => 'DiscordのメッセージID',
            "interactionMessageId" => 'DiscordのInteractionのリプライのメッセージID',
            "discordUserId" => 'DiscordのユーザーID',
            "bossNumber" => 'ボス番号',
            "challengedType" => '凸種類',
            "second" => "秒数",
            "comment" => 'コメント',
        ];
    }


    public function createInput(): CreateCarryOverInput
    {
        return new CreateCarryOverInput(
            new DiscordChannelId($this->input('discordChannelId')),
            new DiscordMessageId($this->input('discordMessageId')),
            new DiscordMessageId($this->input('interactionMessageId')),
            new DiscordUserId($this->input('discordUserId')),
            new BossNumber($this->input('bossNumber')),
            new ChallengedType($this->input("challengedType")),
            new CarryOverSecond($this->input("second")),
            $this->input('comment', ''),
        );
    }
}
