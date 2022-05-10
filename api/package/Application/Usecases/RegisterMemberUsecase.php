<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\MemberRegisteredEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Domain\DiscordUser;
use Sylph\Domain\MemberSynchronizeResult;
use Sylph\Entities\Member;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\VO\ClanId;
use Sylph\VO\MemberId;
use YaLinqo\Enumerable;

/**
 * メンバー登録ユースケース
 */
class RegisterMemberUsecase
{
    public function __construct(
        private MemberRepository $memberRepository,
        private ClanRepository $clanRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
        private MemberRegisteredEvent $memberRegisteredEvent,
    ) {
        //
    }

    /**
     * NOTE: arrayがJsonSerializableと認識されないので
     * @return Member[]
     */
    public function execute(string $clanName, DiscordUser ...$users)
    {
        $clan = $this->clanRepository->getByName($clanName);

        if (is_null($clan)) {
            $this->errorIgnition->throwValidationError(MessageKey::UNLNOWN_CLAN_NAME, $clanName);
        }

        $currentMembers = $this->memberRepository->getByClanId($clan->getId());
        $syncResult = new MemberSynchronizeResult($users, $currentMembers);
        $newMembers = Enumerable::from($syncResult->getNewMembers())
            ->select(fn (DiscordUser $user) => new Member(
                new MemberId($this->ulidGenerator->generate()),
                $user->getName(),
                $user->getId(),
                $clan->getId(),
            ))
            ->toList();

        foreach ($newMembers as $member) {
            $this->memberRepository->save($member);
        }
        foreach ($syncResult->getLeftMembers() as $member) {
            $this->memberRepository->delete($member);
        }

        $updatedMembers = array_merge($syncResult->getContinuationMembers(), $newMembers);
        $this->memberRegisteredEvent->invoke($clan, ...$updatedMembers);

        return $updatedMembers;
    }
}
