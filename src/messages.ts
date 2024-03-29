export enum EErrorMessage {
  UnknownError = 'UNKNOWN_ERROR',
  BadRequest = 'BAD_REQUEST',
  IsEmail = 'NOT_AN_EMAIL',
  IsUrl = 'NOT_AN_URL',
  EmptyPassword = 'EMPTY_PASSWORD',
  UserNotFound = 'USER_NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  UserAlreadyExists = 'USER_EXISTS',
  PasswordMinLength = 'PASSWORD_MIN_LENGTH',
  PasswordMaxLength = 'PASSWORD_MAX_LENGTH',
  PasswordResetInterval = 'PASSWORD_RESET_INTERVAL',
  EmailConfirmationCodeNotFound = 'INVALID_CODE',
  ServerError = 'SERVER_ERROR',
  WrongCode = 'WRONG_CODE',
  LoginIncorrect = 'LOGIN_INCORRECT',
  InvalidUser = 'INVALID_USER',
  InvalidToken = 'INVALID_TOKEN',
  ProjectNotFound = 'PROJECT_NOT_FOUND',
  ProjectNameMinLength = 'PROJECT_NAME_MIN_LENGTH',
  DocumentNameMinLength = 'DOCUMENT_NAME_MIN_LENGTH',
  DocumentNotFound = 'DOCUMENT_NOT_FOUND',
  ConversationNotFound = 'CONVERSATION_NOT_FOUND',
  ConversationTextMinLength = 'CONVERSATION_TEXT_MIN_LENGTH',
  TimelineNotFound = 'TIMELINE_NOT_FOUND',
  UserAlreadyInvited = 'USER_ALREADY_INVITED',
  InviteNotFound = 'INVITE_NOT_FOUND',
  InviteAlreadyAccepted = 'INVITE_ALREADY_ACCEPTED',
  SelfInvited = 'SELF_INVITED',
}

export const errorMessages: EErrorMessage[] = [];

for(const key in EErrorMessage) {
  errorMessages.push(EErrorMessage[key]);
}
