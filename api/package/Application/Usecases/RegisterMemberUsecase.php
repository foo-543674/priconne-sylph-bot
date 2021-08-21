<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Events\MemberRegisteredEvent;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Domain\DiscordUser;
use Sylph\Entities\Member;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
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
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_IS_NOT_EXISTS, $clanName);
        }

        $newMembers = Enumerable::from($users)
            ->where(fn (DiscordUser $user) => is_null($this->memberRepository->getByClanIdAndDiscordId(
                $clan->getId(),
                $user->getId()
            )))
            ->select(fn (DiscordUser $user) => new Member(
                new MemberId($this->ulidGenerator->generate()),
                $user->getName(),
                $user->getId(),
                $clan->getId(),
            ))
            ->toList();
        foreach ($newMembers as $newMember) {
            $this->memberRepository->save($newMember);
        }

        $this->memberRegisteredEvent->invoke(...$newMember);

        return $newMembers;
    }
}
