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
 * クランバトルを終了する
 */
class FinishClanBattleUsecase
{
    public function __construct(
        private ClanBattleRepository $clanBattleRepository,
        private ErrorIgnition $errorIgnition,
    ) {
        //
    }

    /**
     * ユースケースを実行する
     */
    public function execute(): JsonSerializable
    {
        $inSessionClanBattle = $this->clanBattleRepository->getInSession();

        if (is_null($inSessionClanBattle)) {
            $this->errorIgnition->throwValidationError(MessageKey::IN_SESSION_CLAN_BATTLE_IS_NOT_EXISTS);
        }

        $finishedClanBattle = $inSessionClanBattle->finish();

        $this->clanBattleRepository->save($finishedClanBattle);

        return $finishedClanBattle;
    }
}
