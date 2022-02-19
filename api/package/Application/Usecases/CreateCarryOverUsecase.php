<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\CarryOverCreatedEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\CarryOver;
use Sylph\Repositories\CarryOverRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\VO\CarryOverId;

/**
 * 持ち越し登録ユースケース
 */
class CreateCarryOverUsecase
{
    public function __construct(
        private ReportChannelRepository $reportChannelRepository,
        private MemberRepository $memberRepository,
        private ClanBattleRepository $clanBattleRepository,
        private CarryOverRepository $carryOverRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
        private CarryOverCreatedEvent $carryOverCreatedEvent
    ) {
        //
    }

    public function execute(CreateCarryOverInput $input): JsonSerializable
    {
        $clanBattleDate = $this->clanBattleRepository->getInSession();
        if (is_null($clanBattleDate)) {
            $this->errorIgnition->throwValidationError(MessageKey::IN_SESSION_CLAN_BATTLE_IS_NOT_EXISTS);
        }
        $reportChannel = $this->reportChannelRepository->getByDiscordChannelid($input->channelId, $clanBattleDate->getId());
        if (is_null($reportChannel)) {
            $this->errorIgnition->throwValidationError(MessageKey::MESSAGE_DOES_NOT_EXISTS);
        }

        $member = $this->memberRepository->getByClanIdAndDiscordId($reportChannel->getClanId(), $input->userId);
        if (is_null($member)) {
            $this->errorIgnition->throwValidationError(MessageKey::MEMBER_DOES_NOT_EXISTS);
        }

        $existsCarryOver = $this->carryOverRepository->getByMessageId($input->channelId, $input->messageId);
        $carryOver = new CarryOver(
            ($existsCarryOver ? $existsCarryOver->getId() : new CarryOverId($this->ulidGenerator->generate())),
            $input->messageId,
            $input->channelId,
            $input->interactionMessageId,
            $input->userId,
            $input->bossNumber,
            $input->challengedType,
            $input->second,
            $member->getId(),
            $input->comment,
        );

        $this->carryOverRepository->save($carryOver);
        $this->carryOverCreatedEvent->invoke($carryOver, $reportChannel->getClanId());

        return $carryOver;
    }
}
