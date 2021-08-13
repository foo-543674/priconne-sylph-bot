<?php

namespace Sylph\Common;

use ArrayIterator;
use IteratorAggregate;
use Sylph\Errors\DomainValidationException;
use Sylph\VO\Date;
use YaLinqo\Enumerable;

/**
 * DailyActionのコレクション
 */
class DailyActionCollection implements IteratorAggregate
{
    /**
     * @param int $limit アクションの上限
     * @param string $errorMessage 上限を超えた際のエラーメッセージ
     */
    public function __construct(
        private int $limit,
        private string $errorMessage = "Daily action limit is over",
        DailyAction ...$actions
    ) {
        if (Enumerable::from($actions)
            ->groupBy(fn (DailyAction $action) => $action->getActedAt()->__toString())
            ->any(fn ($group) => count($group) > $limit)
        ) {
            throw new DomainValidationException($errorMessage);
        }

        $this->actions = $actions;
    }

    /** @var array */
    private $actions;

    /** {@inheritdoc} */
    public function getIterator()
    {
        return new ArrayIterator($this->actions);
    }

    /**
     * アクションを追加する
     */
    public function addAction(DailyAction $newAction): void
    {
        $actionCountInAddingDay = Enumerable::from($this->actions)
            ->count(fn (DailyAction $action) => $action->getActedAt() == $newAction->getActedAt());

        if ($actionCountInAddingDay >= $this->limit) {
            throw new DomainValidationException($this->errorMessage);
        }

        $this->actions[] = $newAction;
    }

    /**
     * 指定した日付の行動回数を取得する
     */
    public function getCountOfActedAt(Date $date): int
    {
        return Enumerable::from($this->actions)->count(fn (DailyAction $action) => $action->isActedAt($date));
    }

    /**
     * 指定した日付に行動したのか取得する
     */
    public function isActedAt(Date $date): bool
    {
        return Enumerable::from($this->actions)->any(fn (DailyAction $action) => $action->isActedAt($date));
    }
}
