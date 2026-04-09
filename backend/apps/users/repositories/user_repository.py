
from django.contrib.auth import get_user_model
from apps.users.domain.interfaces import UserRepositoryInterface
from apps.users.models import User
from typing import Optional

class UserRepository(UserRepositoryInterface):
    
    def create(self, email: str, password: str, **extra_fields) -> User:
        return User.objects.create_user(email=email, password=password, **extra_fields)
        
    
    def get_by_email(self, email: str) -> Optional[User]:
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None