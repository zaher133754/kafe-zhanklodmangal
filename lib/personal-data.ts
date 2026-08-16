export const PERSONAL_DATA_CONSENT_VERSION = "1.0" as const;

export const PERSONAL_DATA_DOCUMENT_DATE_ISO = "2026-08-17" as const;
export const PERSONAL_DATA_DOCUMENT_DATE_LABEL =
  "17 августа 2026 года" as const;
export const PERSONAL_DATA_ORDER_RETENTION_YEARS = 3 as const;

export const PERSONAL_DATA_CONSENT_REQUIRED_MESSAGE =
  "Необходимо дать согласие на обработку персональных данных";

export const personalDataOperator = {
  name: "ИП Озернова Мария Сергеевна",
  taxId: "731304199885",
  registrationNumber: "318732500052980",
  legalAddress: "443114, г. Самара, проспект Кирова, д. 393В",
  postalAddress: "443114, г. Самара, проспект Кирова, д. 393В",
  privacyEmail: "ogannesigityan@yandex.ru",
  authorizedRoles: ["администратор", "бармен"],
  responsibleRole: "бармен"
} as const;
