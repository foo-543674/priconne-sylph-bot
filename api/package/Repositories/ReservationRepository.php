<?php

namespace Sylph\Repositories;

use Sylph\Entities\DamageReport;
use Sylph\Entities\Reservation;
use Sylph\VO\ClanId;
use Sylph\VO\DamageReportId;
use Sylph\VO\DiscordChannelId;
use Sylph\VO\DiscordInteractionAppId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\ReservationId;

/**
 * ボス予約のリポジトリ
 */
interface ReservationRepository
{
    /**
     * 全てのボス予約を取得する
     *
     * @return Reservation[]
     */
    public function getAll();

    /**
     * ボス予約を取得する
     */
    public function getId(ReservationId $id): ?Reservation;

    /**
     * クランのボス予約を取得する
     *
     * @return Reservation[]
     */
    public function getByClanId(ClanId $clanId);

    /**
     * ボス予約を永続化する
     */
    public function save(Reservation $value): void;

    /**
     * ボス予約を削除する
     */
    public function delete(Reservation $value): void;
}
