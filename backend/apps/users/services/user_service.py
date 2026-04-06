from apps.users.repositories.user_repository import UserRepository
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import re

class UserService:
    
    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, email, password):
        if not email or not password:
            raise ValueError("Email and password are required")

        if self.repo.get_by_email(email):
            raise ValueError("Email already exists")

        PasswordPolicy.assert_valid(password)

        return self.repo.create(email, password)

    def login(self, email: str, password: str):
        user = authenticate(username=email, password=password)

        if not user:
            raise ValueError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
        }
        
        
class PasswordPolicy:
    
    @staticmethod
    def validate(password: str) -> bool:
        if not password or len(password) < 8:
            return False
        if not re.search(r"[A-Z]", password):
            return False
        if not re.search(r"[a-z]", password):
            return False
        if not re.search(r"\d", password):
            return False
        return True

    @classmethod
    def assert_valid(cls, password: str) -> None:
        if not cls.validate(password):
            raise ValueError(
                "Password must be at least 8 characters long and contain both letters and numbers"
            )
            
class AuthService:
    def login(self, email: str, password: str):
        user = authenticate(username=email, password=password)

        if not user:
            raise ValueError("Invalid credentials")

        refresh = RefreshToken.for_user(user)

        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user_id': user.id,
        }