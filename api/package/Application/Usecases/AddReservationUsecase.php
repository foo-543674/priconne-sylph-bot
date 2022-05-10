<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\Reservation;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\ReservationRepository;
use Sylph\VO\ReservationId;

/**
 * ボス予約を追加する
 */
class AddReservationUsecase
{
    public function __construct(
        private ClanRepository $clanRepository,
        private MemberRepository $memberRepository,
        private ReservationRepository $reservationRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(AddReservationInput $input): JsonSerializable
    {
        $clan = $this->clanRepository->getById($input->clanId);
        if (is_null($clan)) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_IS_NOT_EXISTS);
        }

        $member = $this->memberRepository->getByClanIdAndDiscordId($input->clanId, $input->discordUserId);
        if (is_null($member)) {
            $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
        }

        $newReservation = new Reservation(
            new ReservationId($this->ulidGenerator->generate()),
            $clan->getId(),
            $member->getId(),
            $input->bossNumber
        );

        $this->reservationRepository->save($newReservation);

        return $newReservation;
    }
}
