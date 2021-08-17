<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReportChannelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('report_channels', function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->string("clan_id", 100);
            $table->string("clan_battle_id", 100);
            $table->string("discord_channel_id", 100);
            $table->timestamps();

            $table->foreign("clan_id")->references("id")->on("clans")->cascadeOnDelete();
            $table->foreign("clan_battle_id")->references("id")->on("clan_battles")->cascadeOnDelete();
            $table->index("discord_channel_id");
        });

        Schema::create("report_messages", function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->string("report_channel_id", 100);
            $table->string("date_id", 100);
            $table->string("discord_message_id", 100);
            $table->timestamps();

            $table->foreign("report_channel_id")->references("id")->on("report_channels")->cascadeOnDelete();
            $table->foreign("date_id")->references("id")->on("clan_battle_dates")->cascadeOnDelete();
            $table->index("discord_message_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('report_messages');
        Schema::dropIfExists('report_channels');
    }
}
