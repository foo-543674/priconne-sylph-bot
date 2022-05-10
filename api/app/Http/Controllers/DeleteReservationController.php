<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use OutOfRangeException;
use Sylph\Application\Usecases\DeleteReservationUsecase;
use Sylph\VO\BossNumber;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Ulid\Exception\InvalidUlidStringException;
use Ulid\Ulid;

class DeleteReservationController extends Controller
{
    /**
     * @return JsonResponse|Response
     */
    public function __invoke(
        DeleteReservationUsecase $usecase,
        string $clanId,
        string $discordUserId,
        int $bossNumber,
    ) {
        try {
            $usecase->execute(
                new ClanId(Ulid::fromString($clanId)),
                new DiscordUserId($discordUserId),
                new BossNumber($bossNumber),
            );

            return response()->noContent();
        } catch (InvalidUlidStringException | OutOfRangeException) {
            return response("invalid parameter", Response::HTTP_BAD_REQUEST);
        }
    }
}
