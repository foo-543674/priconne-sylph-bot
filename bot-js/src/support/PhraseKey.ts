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

    public static createCarryOverUiLabel(): PhraseKey {
        return new PhraseKey("create_carry_over_ui_label");
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
        return new PhraseKey("select_challenged_type_select_message");
    }

    public static confirmDeleteCarryOverMessage(): PhraseKey {
        return new PhraseKey("confirm_delete_carry_over_message");
    }

    public toString(): string {
        return this.value;
    }
}
