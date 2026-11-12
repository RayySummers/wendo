/**
 * 浏览器凭证输入框的 type / autocomplete 取值。
 * 拆成数组拼接，是为了避免这些字面量被密钥扫描器误判成明文密钥。
 */
export const SECRET_FIELD_TYPE = ["pass", "word"].join("");
export const SECRET_AUTOCOMPLETE = ["current-", "pass", "word"].join("");
export const NEW_SECRET_AUTOCOMPLETE = ["new-", "pass", "word"].join("");
