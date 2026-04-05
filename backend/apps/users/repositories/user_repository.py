from django.contrib.auth import get_user_model
from apps.users.domain.interfaces import UserRepositoryInterface
User = get_user_model()

class UserRepository(UserRepositoryInterface):
    
    def create(self, email: str, password: str):
        return User.objects.create_user(email=email, password=password)
        
    
    def get_by_email(self, email: str):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None
    
    def password_valid(self, user, password):
        return user.check_password(password)