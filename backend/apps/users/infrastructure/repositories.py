from typing import Optional

from apps.users.domain.interfaces import UserRepositoryInterface
from apps.users.models import User


class UserRepository(UserRepositoryInterface):

    def create(self, email: str, password: str, **extra_fields) -> User:
        return User.objects.create_user(email=email, password=password, **extra_fields)

    def get_by_email(self, email: str) -> Optional[User]:
        return User.objects.filter(email=email).first()

    def update(self, user: User, **fields) -> User:
        for field, value in fields.items():
            setattr(user, field, value)

        user.full_clean()
        user.save(update_fields=[*fields.keys()])
        return user
