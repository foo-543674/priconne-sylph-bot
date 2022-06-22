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
use Sylph\VO\BossNumber;
use Sylph\VO\ClanId;
use Sylph\VO\DiscordUserId;
use Sylph\VO\ReservationId;
use YaLinqo\Enumerable;

/**
 * ボス予約を追加する
 */
class DeleteReservationUsecase
{
    public function __construct(
        private ReservationRepository $reservationRepository,
        private MemberRepository $memberRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(ClanId $clanId, DiscordUserId $discordUserId, BossNumber $bossNumber): void
    {
        $member = $this->memberRepository->getByClanIdAndDiscordId($clanId, $discordUserId);
        if (is_null($member)) {
            $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
        }

        /** @var null|Reservation $target */
        $target = Enumerable::from($this->reservationRepository->getByClanId($clanId))
            ->where(fn(Reservation $reservation) => $reservation->matchTo($member->getId(), $bossNumber))
            ->firstOrDefault();

        if (is_null($target)) {
            //NOTE: あくまで一時データなので、勝手に消えてても問題ない。
            return;
        }

        $this->reservationRepository->delete($target);
    }
}
