export enum EErrorMessage {
  IsEmail = 'NOT_AN_EMAIL',
  EmptyPassword = 'EMPTY_PASSWORD',
  UserNotFound = 'USER_NOT_FOUND',
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
}
