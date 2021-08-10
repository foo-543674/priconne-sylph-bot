<?php

namespace Tests;

/**
 * 処理がエラーにならないことを表明するためのアサーションを提供する
 */
trait AssertNotThrow
{
    /**
     * 処理がエラーにならないことを表明し、処理結果を返り値として返す
     *
     * @param callable $func
     * @return mixed
     */
    public function assertNotThrow(callable $func): mixed
    {
        try {
            $result = $func;

            //NOTE: アサーションが一個もありません警告を回避
            $this->assertTrue(true);

            return $result;
        } catch (\Throwable $th) {
            $this->fail("Failed process which should not throw exception.");
        }
    }
}
