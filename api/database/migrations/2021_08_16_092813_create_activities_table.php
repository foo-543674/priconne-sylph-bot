<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->string("type", 20);
            $table->string("acted_member_id", 100);
            $table->string("acted_date_id", 100);
            $table->timestamps();

            $table->foreign("acted_member_id")->references("id")->on("members")->cascadeOnDelete();
            $table->foreign("acted_date_id")->references("id")->on("clan_battle_dates")->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('activities');
    }
}
