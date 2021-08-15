<?php

namespace Sylph\Repositories;

use Sylph\Entities\WebHook;
use Sylph\VO\ClanId;
use Sylph\VO\WebHookId;

/**
 * WebHookのリポジトリ
 */
interface WebHookRepository
{
    /**
     * 全てのWebHookを取得する
     *
     * @return WebHook[]
     */
    public function getAll();

    /**
     * IDで指定したWebHookを取得する
     */
    public function getById(WebHookId $id): ?WebHook;

    /**
     * クランIDで指定したWebHookを取得する
     *
     * @return WebHook[]
     */
    public function getByClanId(ClanId $id);

    /**
     * WebHookを永続化する
     */
    public function save(WebHook $webHook): void;
}
