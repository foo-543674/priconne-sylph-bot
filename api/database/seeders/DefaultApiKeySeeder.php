<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DefaultApiKeySeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table("api_keys")->insert([
            'name' => 'devenv',
            'key' => config('local.DEFAULT_API_KEY'),
        ]);
    }
}
