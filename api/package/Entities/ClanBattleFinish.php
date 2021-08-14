<?php

namespace Sylph\Entities;

use Sylph\VO\ClanBattleId;

/**
 * クランバトル終了イベント
 */
class ClanBattleFinish
{
    public function __construct(private ClanBattleId $clanBattleId)
    {
        //
    }

    public function getClanBattleId(): ClanBattleId
    {
        return $this->clanBattleId;
    }
}
