/**
 * 全角英数字&スペースを半角に変換する
 */
export function ConvertFullWidth(value: string) {
    return value.replace(
        /[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
    ).replace(/　/g, " ");

}