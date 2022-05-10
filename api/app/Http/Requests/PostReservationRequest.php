<?php

namespace App\Http\Requests;

use App\Rules\Ulid as RulesUlid;
use Illuminate\Foundation\Http\FormRequest;
use Sylph\Application\Usecases\AddReservationInput;
use Sylph\VO\BossNumber;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Ulid\Ulid;

class PostReservationRequest extends FormRequest
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
            "clanId" => ["required", "string", new RulesUlid()],
            "discordUserId" => ["required", "string"],
            "bossNumber" => ["required", "numeric", "between:1,5"],
        ];
    }

    /** {@inheritdoc} */
    public function attributes()
    {
        return [
            "clanId" => "クランID",
            "discordUserId" => 'DiscordのユーザーID',
            "bossNumber" => 'ボス番号',
        ];
    }

    public function createInput(): AddReservationInput
    {
        return new AddReservationInput(
            new ClanId(Ulid::fromString($this->input("clanId"))),
            new DiscordUserId($this->input("discordUserId")),
            new BossNumber($this->input("bossNumber")),
        );
    }
}
