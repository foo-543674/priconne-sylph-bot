<?php

namespace Sylph\Application\Usecases;

use GuzzleHttp\Psr7\Uri;
use JsonSerializable;
use Sylph\Application\Support\ErrorIgnition;
use Sylph\Application\Support\MessageKey;
use Sylph\Application\Support\UlidGenerator;
use Sylph\Entities\WebHook;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\WebHookRepository;
use Sylph\VO\WebHookId;

/**
 * WebHook通知先を作成する
 */
class AddWebHookUsecase
{
    public function __construct(
        private WebHookRepository $webHookRepository,
        private ClanRepository $clanRepository,
        private ErrorIgnition $errorIgnition,
        private UlidGenerator $ulidGenerator,
    ) {
        //
    }

    public function execute(string $clanName, Uri $uri): JsonSerializable
    {
        $clan = $this->clanRepository->getByName($clanName);

        if (is_null($clan)) {
            $this->errorIgnition->throwValidationError(MessageKey::CLAN_IS_NOT_EXISTS, $clanName);
        }

        $newWebHook = new WebHook(
            new WebHookId($this->ulidGenerator->generate()),
            $uri,
            $clan->getId(),
        );

        $this->webHookRepository->save($newWebHook);

        return $newWebHook;
    }
}
