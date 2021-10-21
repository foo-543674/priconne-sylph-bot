<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Sylph\Domain\DiscordRole;
use Sylph\VO\DiscordRoleId;

class PostUncompleteMemberRoleRequest extends FormRequest
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
            "discordRoleId" => ["required", "string"],
            "discordRoleName" => ["required", "string"],
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            'clanName' => 'クラン名',
            "discordRoleId" => 'DiscordのロールID',
            "discordRoleName" => 'ロール名',
        ];
    }

    public function getClanName(): string
    {
        return $this->input("clanName");
    }

    public function getRole(): DiscordRole
    {
        return new DiscordRole(
            new DiscordRoleId($this->input('discordRoleId')),
            $this->input('discordRoleName'),
        );
    }
}
