<?php

namespace App\Http\Requests;

use Sylph\VO\DiscordChannelId;
use Illuminate\Foundation\Http\FormRequest;
use Sylph\VO\BossNumber;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\DiscordUserId;

class PostInProcessDamageReportRequest extends FormRequest
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
            "bossNumber" => ["required", "numeric", "between:1,5"],
            "discordUserId" => ["required_without:memberName", "string"],
            "memberName" => ["required_without:discordUserId", "string"],
            "comment" => ["string"]
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            "discordChannelId" => 'DiscordのチャンネルID',
            "discordMessageId" => 'DiscordのメッセージID',
            "bossNumber" => 'ボス番号',
            "discordUserId" => 'DiscordのユーザーID',
            "memberName" => 'メンバー名',
            "comment" => 'コメント',
        ];
    }

    public function getDiscordChannelId(): DiscordChannelId
    {
        return new DiscordChannelId($this->input("discordChannelId"));
    }

    public function getDiscordMessageId(): DiscordMessageId
    {
        return new DiscordMessageId($this->input("discordMessageId"));
    }

    public function getBossNumber(): BossNumber
    {
        return new BossNumber($this->input("bossNumber"));
    }

    public function getDiscordUserId(): ?DiscordUserId
    {
        return (!$this->hasMemberName() && $this->has("discordUserId") && $this->filled("discordUserId"))
            ? new DiscordUserId($this->input("discordUserId"))
            : null;
    }

    public function hasMemberName(): bool
    {
        return ($this->has("memberName") && $this->filled("memberName"));
    }

    public function getMemberName(): ?string
    {
        return $this->hasMemberName()
            ? $this->input("memberName")
            : null;
    }

    public function getComment(): string
    {
        return $this->input("comment");
    }
}
