export enum  IdType {
  Nric = 'NRIC',
  OldIc = 'OLD_IC',
  Passport = 'PASSPORT'
}

enum IdTypeString {
  NRIC = 'NRIC',
  OLD_IC = 'Old IC',
  PASSPORT = 'Passport'
}

export function getIdTypeString(idType: IdType): string {
  return IdTypeString[idType];
}