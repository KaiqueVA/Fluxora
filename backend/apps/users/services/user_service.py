from apps.users.repositories.user_repository import UserRepository
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class UserService:
    
    def __init__(self):
        self.repo = UserRepository()

    def create_user(self, email, password):
        if not email or not password:
            raise ValueError("Email and password are required")

        if self.repo.get_by_email(email):
            raise ValueError("Email already exists")

        if not self._password_valid(password):
            raise ValueError("Password must be at least 8 characters long and contain both letters and numbers")

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

    def _password_valid(self, password: str) -> bool:
        return (
            len(password) >= 8
            and any(char.isdigit() for char in password)
            and any(char.isalpha() for char in password)
        )