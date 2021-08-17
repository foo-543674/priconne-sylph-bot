<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClanBattlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clan_battles', function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->timestamps();
        });

        Schema::create("clan_battle_dates", function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->date("date_value");
            $table->string("clan_battle_id");
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
        Schema::dropIfExists('clan_battle_dates');
        Schema::dropIfExists('clan_battles');
    }
}
