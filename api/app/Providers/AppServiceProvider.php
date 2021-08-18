<?php

namespace App\Providers;

use App\Infrastructure\LaravelWebHookServer;
use App\Repositories\RdbmsActivityRepository;
use App\Repositories\RdbmsClanBattleRepository;
use App\Repositories\RdbmsClanRepository;
use App\Repositories\RdbmsMemberRepository;
use App\Repositories\RdbmsReportChannelRepository;
use App\Repositories\RdbmsWebHookRepository;
use App\Support\MessageResolverFromConfig;
use App\Support\UlidGenerator;
use Illuminate\Support\ServiceProvider;
use Sylph\Application\Gateway\WebHookServer;
use Sylph\Application\Support\MessageResolver;
use Sylph\Application\Support\UlidGenerator as UlidGeneratorInterface;
use Sylph\Repositories\ActivityRepository;
use Sylph\Repositories\ClanBattleRepository;
use Sylph\Repositories\ClanRepository;
use Sylph\Repositories\MemberRepository;
use Sylph\Repositories\ReportChannelRepository;
use Sylph\Repositories\WebHookRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    public array $bindings = [
        // Repositories
        ClanRepository::class => RdbmsClanRepository::class,
        ClanBattleRepository::class => RdbmsClanBattleRepository::class,
        ReportChannelRepository::class => RdbmsReportChannelRepository::class,
        WebHookRepository::class => RdbmsWebHookRepository::class,
        MemberRepository::class => RdbmsMemberRepository::class,
        ActivityRepository::class => RdbmsActivityRepository::class,

        // Supports
        UlidGeneratorInterface::class => UlidGenerator::class,
        MessageResolver::class => MessageResolverFromConfig::class,
        WebHookServer::class => LaravelWebHookServer::class,
    ];

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
