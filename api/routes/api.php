<?php

use App\Http\Controllers\DeleteCarryOverController;
use App\Http\Controllers\DeleteChallengeController;
use App\Http\Controllers\DeleteDamageReportController;
use App\Http\Controllers\DeleteTaskKillController;
use App\Http\Controllers\GetClanBattleController;
use App\Http\Controllers\GetClanController;
use App\Http\Controllers\GetCooperateChannelController;
use App\Http\Controllers\GetDamageReportChannelController;
use App\Http\Controllers\GetDamageReportChannelListController;
use App\Http\Controllers\GetMemberController;
use App\Http\Controllers\GetReportMessageController;
use App\Http\Controllers\PatchClanBattleStatusController;
use App\Http\Controllers\PostCarryOverController;
use App\Http\Controllers\PostChallengeController;
use App\Http\Controllers\PostClanBattleController;
use App\Http\Controllers\PostClanController;
use App\Http\Controllers\PostCooperateChannelController;
use App\Http\Controllers\PostDamageReportChannelController;
use App\Http\Controllers\PostFinishedDamageReportController;
use App\Http\Controllers\PostInProcessDamageReportController;
use App\Http\Controllers\PostMemberController;
use App\Http\Controllers\PostReportChannelController;
use App\Http\Controllers\PostTaskKillController;
use App\Http\Controllers\PostWebHookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware("auth.apikey")->group(function () {
    Route::prefix("/clans")->group(function () {
        Route::post("/", PostClanController::class)->name("post.clans");
        Route::get("/", GetClanController::class)->name("get.clans");
        Route::prefix("/{clanId}")->group(function () {
            Route::get("/members", GetMemberController::class)->name("get.members");
        });
    });
    Route::prefix("/clan_battles")->group(function () {
        Route::get("/", GetClanBattleController::class)->name("get.clan_battles");
        Route::post("/", PostClanBattleController::class)->name("post.clan_battles");
        Route::patch("/status", PatchClanBattleStatusController::class)->name("patch.clan_battle_status");
    });
    Route::prefix("/members")->group(function () {
        Route::post("/", PostMemberController::class)->name("post.members");
    });
    Route::prefix("/report_channels")->group(function () {
        Route::post("/", PostReportChannelController::class)->name("post.report_channels");
    });
    Route::prefix("/report_messages")->group(function () {
        Route::get("/{discordMessageId}", GetReportMessageController::class)->name("get.report_messages");
    });
    Route::prefix("/damage_report_channels")->group(function () {
        Route::post("/", PostDamageReportChannelController::class)->name("post.damage_report_channels");
        Route::get("/", GetDamageReportChannelListController::class)->name("get.damage_report_channels_list");
        Route::get("/{discordChannelId}", GetDamageReportChannelController::class)->name("get.damage_report_channels");
    });
    Route::prefix("/cooperate_channels")->group(function () {
        Route::post("/", PostCooperateChannelController::class)->name("post.cooperate_channels");
        Route::get("/{discordChannelId}", GetCooperateChannelController::class)->name("get.cooperate_channels");
    });
    Route::prefix("/damage_reports")->group(function () {
        Route::post("/in_process", PostInProcessDamageReportController::class)->name("post.in_process_damage_reports");
        Route::post("/finished", PostFinishedDamageReportController::class)->name("post.finished_damage_reports");
        Route::delete("/{discordChannelId}/{discordMessageId}", DeleteDamageReportController::class)->name("delete.damage_reports");
    });
    Route::prefix("/webhooks")->group(function () {
        Route::post("/", PostWebHookController::class)->name("post.webhooks");
    });
    Route::prefix("/challenges/messages/{discordMessageId}/users/{discordUserId}")->group(function () {
        Route::post("/", PostChallengeController::class)->name("post.challenges");
        Route::delete("/", DeleteChallengeController::class)->name("delete.challenges");
    });
    Route::prefix("/carry_overs/messages/{discordMessageId}/users/{discordUserId}")->group(function () {
        Route::post("/", PostCarryOverController::class)->name("post.carry_overs");
        Route::delete("/", DeleteCarryOverController::class)->name("delete.carry_overs");
    });
    Route::prefix("/task_kills/messages/{discordMessageId}/users/{discordUserId}")->group(function () {
        Route::post("/", PostTaskKillController::class)->name("post.task_kills");
        Route::delete("/", DeleteTaskKillController::class)->name("delete.task_kills");
    });
});
