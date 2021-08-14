<?php

namespace Sylph\Application\Usecases;

use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\ClanBattle;
use Sylph\Entities\ClanBattleDate;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\ClanBattleId;
use Sylph\VO\Date;
use YaLinqo\Enumerable;

/**
 * クランバトルを追加する
 */
class AddClanBattleUsecase
{
    public function __construct(
        private ClanBattleRepository $clanBattleRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    /**
     * ユースケースを実行する
     */
    public function execute(Date $since, Date $until): JsonSerializable
    {
        if ($since->greaterThan($until)) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_BATTLE_PERIOD_IS_INVALID);
        }

        if (!is_null($this->clanBattleRepository->getInSession())) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_BATTLE_IS_ALREADY_EXISTS);
        }

        $newClanBattle = new ClanBattle(
            new ClanBattleId($this->ulidGenerator->generate()),
            ...Enumerable::from(range(0, $since->calculateDiff($until)))
                ->select(fn (int $dateNumber) => $since->addDays($dateNumber))
                ->select(fn (Date $date) => new ClanBattleDate(
                    new ClanBattleDateId($this->ulidGenerator->generate()),
                    $date
                ))
        );

        $this->clanBattleRepository->save($newClanBattle);

        return $newClanBattle;
    }
}
