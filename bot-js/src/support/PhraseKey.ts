import { BossNumber } from "../entities/BossNumber";
import { ChallengedType } from "../entities/ChallengedType";

export class PhraseKey {
    private constructor(private value: string) {}

    public static botName() {
        return new PhraseKey("bot_name");
    }

    public static help() {
        return new PhraseKey("help");
    }

    public static registerClan() {
        return new PhraseKey("register_clan");
    }

    public static registerMembers() {
        return new PhraseKey("register_members");
    }

    public static createChallengeReport() {
        return new PhraseKey("create_challenge_report");
    }

    public static registerWebhook() {
        return new PhraseKey("register_webhook");
    }

    public static createBossQuestionnaire() {
        return new PhraseKey("create_boss_questionnaire");
    }

    public static getBossQuestionnaireResult() {
        return new PhraseKey("get_boss_questionnaire_result");
    }

    public static bossNotificationBossList() {
        return new PhraseKey("boss_notify_message_boss_list");
    }

    public static bossNotification() {
        return new PhraseKey("boss_notification");
    }

    public static createDamageReport() {
        return new PhraseKey("create_damage_report");
    }

    public static registerCooperateChannel() {
        return new PhraseKey("register_cooperate_channel");
    }

    public static challengeReportGuide() {
        return new PhraseKey("challenge_report_guide");
    }

    public static noMemberForRegisterMessage() {
        return new PhraseKey("no_member_for_register_message");
    }

    public static helpMessageBasic() {
        return new PhraseKey("help_message_basic");
    }

    public static helpMessageRegisterClan() {
        return new PhraseKey("help_message_register_clan");
    }

    public static helpMessageRegisterMembers() {
        return new PhraseKey("help_message_register_members");
    }

    public static helpMessageRegisterWebhook() {
        return new PhraseKey("help_message_register_webhook");
    }

    public static helpMessageRegisterCreateReport() {
        return new PhraseKey("help_message_register_create_report");
    }

    public static helpMessageCreateBossQuestionaire() {
        return new PhraseKey("help_message_create_boss_questionaire");
    }

    public static helpMessageNotifyBossQuestionaire() {
        return new PhraseKey("help_message_notify_boss_questionaire");
    }

    public static helpMessageGetResultBossQuestionaire() {
        return new PhraseKey("help_message_get_result_boss_questionaire");
    }

    public static helpMessageRegisterDamageReportChannel() {
        return new PhraseKey("help_message_register_damage_report_channel");
    }

    public static helpMessageRegisterCoopreateChannel() {
        return new PhraseKey("help_message_register_coopreate_channel");
    }

    public static daysUnit() {
        return new PhraseKey("days_unit");
    }

    public static bossQuestionnaireMessage() {
        return new PhraseKey("boss_questionnaire_message");
    }

    public static bossNotifyMessage() {
        return new PhraseKey("boss_notify_message");
    }

    public static cannotFindBossQuestionnaireMessage() {
        return new PhraseKey("cannot_find_boss_questionnaire_message");
    }

    public static cannotFindBossNumberMessage() {
        return new PhraseKey("cannot_find_boss_number_message");
    }

    public static noInSessionClanBattleMessage() {
        return new PhraseKey("no_in_session_clan_battle_message");
    }

    public static noDamageReportChannelsMessage() {
        return new PhraseKey("no_damage_report_channels_message");
    }

    public static specificBossWord() {
        return new PhraseKey("specific_boss_word");
    }

    public static createDamageReportMessage() {
        return new PhraseKey("create_damage_report_message");
    }

    public static firstChallengeStamp() {
        return new PhraseKey("first_challenge_stamp");
    }

    public static secondChallengeStamp() {
        return new PhraseKey("second_challenge_stamp");
    }

    public static thirdChallengeStamp() {
        return new PhraseKey("third_challenge_stamp");
    }

    public static taskKillStamp() {
        return new PhraseKey("task_kill_stamp");
    }

    public static succeedReaction() {
        return new PhraseKey("succeed_reaction");
    }

    public static failedReaction() {
        return new PhraseKey("failed_reaction");
    }

    public static bossStamp(number: BossNumber) {
        return new PhraseKey(`${number}_boss_stamp`);
    }

    public static carryOverStamp() {
        return new PhraseKey("carry_over_stamp");
    }

    public static bossKnockoutMessage() {
        return new PhraseKey("boss_knockout_message");
    }

    public static registerUncompleteMemberRole() {
        return new PhraseKey("register_uncomplete_member_role");
    }

    public static cannotGetRoleMessage() {
        return new PhraseKey("cannot_get_role_message");
    }

    public static cannotUseCommandInDmMessage() {
        return new PhraseKey("cannot_use_command_in_dm_message");
    }

    public static helpMessageRegisterUncompleteMemberRole() {
        return new PhraseKey("help_message_register_uncomplete_member_role");
    }

    public static bossSubjugation() {
        return new PhraseKey("boss_subjugation");
    }

    public static helpMessageBossSubjugation() {
        return new PhraseKey("help_message_boss_subjugation");
    }

    public static helpMessagePin() {
        return new PhraseKey("help_message_pin");
    }

    public static helpMessageUnpin() {
        return new PhraseKey("help_message_unpin");
    }

    public static openDamageInputFormLabel() {
        return new PhraseKey("open_damage_input_form_label");
    }

    public static interactionDeletePrompt() {
        return new PhraseKey("interaction_delete_prompt");
    }

    public static damageInputFormMessage() {
        return new PhraseKey("damage_input_form_message");
    }

    public static damageInputLabel(num: number) {
        return new PhraseKey(`damage_input_${num}_label`);
    }

    public static damageInputBackLabel() {
        return new PhraseKey("damage_input_back_label");
    }

    public static damageInputApplyLabel() {
        return new PhraseKey("damage_input_apply_label");
    }

    public static deleteLabel() {
        return new PhraseKey("delete_label");
    }

    public static confirmDeleteDamageReportMessage() {
        return new PhraseKey("confirm_delete_damage_report_message");
    }

    public static confirmEditDamageReportMessage() {
        return new PhraseKey("confirm_edit_damage_report_message");
    }

    public static inProcessDamageReportTemplate() {
        return new PhraseKey("in_process_damage_report_template");
    }

    public static confirmedDamageReportTemplate() {
        return new PhraseKey("confirmed_damage_report_template");
    }

    public static regularChallenge() {
        return new PhraseKey("regular_challenge");
    }

    public static carryOver() {
        return new PhraseKey("carry_over");
    }

    public static boss() {
        return new PhraseKey("boss");
    }

    public static nowloadingMessage() {
        return new PhraseKey("nowloading_message");
    }

    public static challengerSelectPlaceHolder() {
        return new PhraseKey("challenger_select_place_holder");
    }

    public static startChallengePromptTemplate() {
        return new PhraseKey("start_challenge_prompt_template");
    }

    public static challengingBossSelectPlaceHolder() {
        return new PhraseKey("challenging_boss_select_place_holder");
    }

    public static inDeletingMessage() {
        return new PhraseKey("in_deleting_message");
    }

    public static pageLabel() {
        return new PhraseKey("page_label");
    }

    public static requestRescueLabel() {
        return new PhraseKey("request_rescue_label");
    }

    public static requestRescueMessage(): PhraseKey {
        return new PhraseKey("request_rescue_message");
    }

    public static noChallengerMessage(): PhraseKey {
        return new PhraseKey("no_challenger_message");
    }

    public static noClanMembersMessage(): PhraseKey {
        return new PhraseKey("no_clan_members_message");
    }

    public static notClanMemberMessage(): PhraseKey {
        return new PhraseKey("not_clan_member_message");
    }

    public static inputCarryOverUiLabel(): PhraseKey {
        return new PhraseKey("input_carry_over_ui_label");
    }

    public static challengedTypeLabel(type: ChallengedType): PhraseKey {
        return new PhraseKey(`${type}_label`);
    }

    public static inputCarryOverSecondsPrompt(): PhraseKey {
        return new PhraseKey("input_carry_over_seconds_prompt");
    }

    public static timeOutInputMessage(): PhraseKey {
        return new PhraseKey("time_out_input_message");
    }

    public static selectChallengedTypeSelectMessage(): PhraseKey {
        return new PhraseKey("select_challenged_type_select_message");
    }

    public static inputCarryOverChallengedTypePrompt(): PhraseKey {
        return new PhraseKey("input_carry_over_challenged_type_prompt");
    }

    public static confirmDeleteCarryOverMessage(): PhraseKey {
        return new PhraseKey("confirm_delete_carry_over_message");
    }

    public static confirmEditCarryOverButtonMessage(): PhraseKey {
        return new PhraseKey("confirm_edit_carry_over_button_message");
    }

    public static retryChallengeLabel(): PhraseKey {
        return new PhraseKey("retry_challenge_label");
    }

    public static requestPin(): PhraseKey {
        return new PhraseKey("request_pin");
    }

    public static requestUnpin(): PhraseKey {
        return new PhraseKey("request_unpin");
    }

    public static calculateCarryOverTl(): PhraseKey {
        return new PhraseKey("calculate_carry_over_tl");
    }

    public static carryOverTimeIsInvalidMessage(): PhraseKey {
        return new PhraseKey("carry_over_time_is_invalid_message");
    }

    public static timeupLine(): PhraseKey {
        return new PhraseKey("timeup_line");
    }

    public static carryOverTimelineResultTitle(): PhraseKey {
        return new PhraseKey("carry_over_timeline_result_title");
    }

    public static carryOverSecondsInputLabel(): PhraseKey {
        return new PhraseKey("carry_over_seconds_input_label");
    }

    public static carryOverSecondsInputPlaceholder(): PhraseKey {
        return new PhraseKey("carry_over_seconds_input_placeholder");
    }

    public static noteInputLabel(): PhraseKey {
        return new PhraseKey("note_input_label");
    }

    public static carryOverNoteInputPlaceholder(): PhraseKey {
        return new PhraseKey("carry_over_note_input_placeholder");
    }

    public static editCarryOverLabel(): PhraseKey {
        return new PhraseKey("edit_caryy_over_label");
    }

    public static reportDamageInputLabel(): PhraseKey {
        return new PhraseKey("report_damage_input_label");
    }

    public static reportDamageInputPlaceholder(): PhraseKey {
        return new PhraseKey("report_damage_input_placeholder");
    }

    public static damageReportNoteInputPlaceholder(): PhraseKey {
        return new PhraseKey("damage_report_note_input_placeholder");
    }

    public static reportDamageFormLabel(): PhraseKey {
        return new PhraseKey("report_damage_form_label");
    }

    public static confirmButtonLabel(): PhraseKey {
        return new PhraseKey("confirm_button_label");
    }

    public static damageIsInvalidMessage(): PhraseKey {
        return new PhraseKey("damage_is_invalid_message");
    }

    public static createTimelineThreadUIMessage(): PhraseKey {
        return new PhraseKey("create_timeline_thread_ui_message")
    }

    public static createTimelineThreadButtonLabel(): PhraseKey {
        return new PhraseKey("create_timeline_thread_button_label")
    }

    public static createTimelineThreadAuthorInputLabel(): PhraseKey {
        return new PhraseKey("create_timeline_thread_author_input_label")
    }

    public static createTimelineThreadAuthorInputPlaceholder(): PhraseKey {
        return new PhraseKey("create_timeline_thread_author_input_placeholder")
    }

    public static createTimelineThreadDamageInputLabel(): PhraseKey {
        return new PhraseKey("create_timeline_thread_damage_input_label")
    }

    public static createTimelineThreadDamageInputPlaceholder(): PhraseKey {
        return new PhraseKey("create_timeline_thread_damage_input_placeholder")
    }

    public static createTimelineThreadDescriptionInputLabel(): PhraseKey {
        return new PhraseKey("create_timeline_thread_description_input_label")
    }

    public static createTimelineThreadDescriptionInputPlaceholder(): PhraseKey {
        return new PhraseKey("create_timeline_thread_description_input_placeholder")
    }

    public static createTimelineThreadSourceInputLabel(): PhraseKey {
        return new PhraseKey("create_timeline_thread_source_input_label")
    }

    public static createTimelineThreadSourceInputPlaceholder(): PhraseKey {
        return new PhraseKey("create_timeline_thread_source_input_placeholder")
    }

    public static setupTimelineChannel(): PhraseKey {
        return new PhraseKey("setup_timeline_channel")
    }

    public static excellentLuck(): PhraseKey {
        return new PhraseKey("excellent_luck");
    }

    public static goodLuck(): PhraseKey {
        return new PhraseKey("good_luck");
    }

    public static fairLuck(): PhraseKey {
        return new PhraseKey("fair_luck");
    }

    public static smallLuck(): PhraseKey {
        return new PhraseKey("small_luck");
    }

    public static futureLuck(): PhraseKey {
        return new PhraseKey("future_luck");
    }

    public static badLuck(): PhraseKey {
        return new PhraseKey("bad_luck");
    }

    public static greatMisfortune(): PhraseKey {
        return new PhraseKey("great_misfortune");
    }

    public static omikujiResult(): PhraseKey {
        return new PhraseKey("omikuji_result");
    }

    public static omikujiCommand(): PhraseKey {
        return new PhraseKey("omikuji_command");
    }

    public toString(): string {
        return this.value;
    }
}
