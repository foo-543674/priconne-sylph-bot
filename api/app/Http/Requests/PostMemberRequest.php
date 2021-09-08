<?php

namespace App\Http\Requests;

use YaLinqo\Enumerable;
use Sylph\VO\DiscordUserId;
use Sylph\Domain\DiscordUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

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
     * {@inheritdoc}
     */
    protected function failedValidation(Validator $validator)
    {
        $res = response()->json(
            $validator->errors()->first()[0],
            400
        );
        throw new HttpResponseException($res);
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
