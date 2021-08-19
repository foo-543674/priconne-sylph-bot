<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClanBattleFinishTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clan_battle_finishes', function (Blueprint $table) {
            $table->string("clan_battle_id", 100)->primary();
            $table->timestamps();

            $table
                ->foreign("clan_battle_id")
                ->references("id")
                ->on("clan_battles")
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clan_battle_finishes');
    }
}
