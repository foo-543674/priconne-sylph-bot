<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Sylph\Domain\DiscordUser;
use Sylph\VO\DiscordUserId;
use YaLinqo\Enumerable;

class PostMemberRequest extends FormRequest
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
     * @Override
     * 勝手にリダイレクトさせない
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
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
            "users" => ["required", "array"],
            "users.*.discordId" => ["required", "string"],
            "users.*.name" => ["required", "string"],
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
