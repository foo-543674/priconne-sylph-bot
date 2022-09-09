import { getGroupOf } from '../support/RegexHelper';
import { Message, User, Client } from 'discord.js';

export const userMension = (id: string) => `<@${id}>`;
export const roleMension = (id: string) => `<@&${id}>`;

export function getMentionedUserId(messageContent: string) {
    return getGroupOf(/<@(?<challengerId>[0-9]+)>/, messageContent, "challengerId")[0];
}

export function getMentionedRoleId(messageContent: string) {
    return getGroupOf(/<@&(?<roleId>[0-9]+)>/, messageContent, "roleId")[0];
}

export function removeMentionsFromContent(messageContent: string) {
    const result = messageContent
        .replace(/<@!?\d+>/g, "")
        .replace(/<@&\d+>/g, "")
        .replace(/<#\d+>/g, "")
        .replace(/@everyone/g, "")
        .trim();

    return result;
}
