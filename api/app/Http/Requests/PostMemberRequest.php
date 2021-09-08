<?php

namespace App\Http\Requests;

use YaLinqo\Enumerable;
use Sylph\VO\DiscordUserId;
use Sylph\Domain\DiscordUser;
use Illuminate\Foundation\Http\FormRequest;

class PostMemberRequest extends FormRequest
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
            "users" => ["required", "array"],
            "users.*.discordId" => ["required", "string"],
            "users.*.name" => ["required", "string"],
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            'clanName' => 'クラン名',
            'users' => 'クランメンバー',
            'users.*.discordId' => 'メンバーのDiscordID',
            'users.*.name' => 'メンバーのDiscord名',
        ];
    }

    public function getClanName(): string
    {
        return $this->input("clanName");
    }

    /**
     * @return DiscordUser[]
     */
    public function getUsers()
    {
        return Enumerable::from($this->input("users"))
            ->select(fn (array $userData) => new DiscordUser(
                new DiscordUserId($userData["discordId"]),
                $userData["name"]
            ))
            ->toList();
    }
}
