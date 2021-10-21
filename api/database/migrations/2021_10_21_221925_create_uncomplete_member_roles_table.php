<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUncompleteMemberRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('uncomplete_member_roles', function (Blueprint $table) {
            $table->string("id", 100)->primary();
            $table->string("discord_role_id", 200)->unique("uncomplete_member_roles_role_id_uk");
            $table->string("role_name", 100);
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
        Schema::dropIfExists('uncomplete_member_roles');
    }
}
