<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCooperateChannelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cooperate_channels', function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->string("discord_channel_id", 200)->unique("cooperate_channels_discord_channel_id_uk");
            $table->string("clan_id", 100);
            $table->timestamps();

            $table->foreign("clan_id")->references("id")->on("clans")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cooperate_channels');
    }
}
