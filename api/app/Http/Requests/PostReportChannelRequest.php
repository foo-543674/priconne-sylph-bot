<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordMessageId;
use YaLinqo\Enumerable;

class PostReportChannelRequest extends FormRequest
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
            "discordChannelId" => ["required", "string"],
            "discordMessageIds" => ["required", "array"],
            "discordMessageIds.*" => ["string"],
        ];
    }

    public function getClanName(): string
    {
        return $this->input("clanName");
    }

    public function getDiscordChannelId(): DiscordChannelId
    {
        return new DiscordChannelId($this->input("discordChannelId"));
    }

    /**
     * @return DiscordMessageId[]
     */
    public function getDiscordMessageIds()
    {
        return Enumerable::from($this->input("discordMessageIds"))
            ->select(fn (string $messageId) => new DiscordMessageId($messageId))
            ->toList();
    }
}
