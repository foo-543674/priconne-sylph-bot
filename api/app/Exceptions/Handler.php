<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Response;
use Sylph\Application\Errors\ValidationException;
use Sylph\Errors\DomainValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (ValidationException $e) {
            return response($e->getMessage(), Response::HTTP_BAD_REQUEST);
        });

        $this->renderable(function (DomainValidationException $e) {
            return response("Unexpected error occured", Response::HTTP_INTERNAL_SERVER_ERROR);
        });

        $this->renderable(function (InvalidDbStateException $e) {
            return response("Unexpected error occured", Response::HTTP_INTERNAL_SERVER_ERROR);
        });
    }
}
