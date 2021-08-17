<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Sylph\Entities\ReportMessage as EntitiesReportMessage;
use Sylph\VO\ClanBattleDateId;
use Sylph\VO\DiscordMessageId;
use Sylph\VO\ReportMessageId;
use Ulid\Ulid;

/**
 * @property string $id
 * @property string $report_channel_id
 * @property string $date_id
 * @property string $discord_message_id
 * @property ClanBattleDate $date
 * @property ReportChannel $reportChannel
 */
class ReportMessage extends Model
{
    use HasFactory;

    public bool $incrementing = false;
    protected string $keyType = "string";

    protected array $fillable = [
        "id",
        "report_channel_id",
        "date_id",
        "discord_message_id",
    ];

    public function date(): BelongsTo
    {
        return $this->belongsTo(ClanBattleDate::class, "date_id", "id");
    }

    public function reportChannel(): BelongsTo
    {
        return $this->belongsTo(ReportChannel::class);
    }

    /**
     * ドメインエンティティに変換する
     */
    public function toEntity(): EntitiesReportMessage
    {
        return new EntitiesReportMessage(
            new ReportMessageId(Ulid::fromString($this->id)),
            new ClanBattleDateId(Ulid::fromString($this->date_id)),
            new DiscordMessageId($this->discord_message_id),
        );
    }
}
