<?php

namespace Sylph\Application\Support;

/**
 * 各種メッセージを取得する
 */
interface MessageResolver
{
    /**
     * キーに紐づくメッセージを取得する。メッセージにプレースホルダーがある場合はparamsに置換される
     */
    public function get(string $key, string ...$params): string;
}
