class DomainException(Exception):
    pass


class ValidationException(DomainException):
    pass


class UserAlreadyExistsException(DomainException):
    pass


class AuthenticationException(DomainException):
    pass
