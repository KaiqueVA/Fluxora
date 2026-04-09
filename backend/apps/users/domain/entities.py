class UserEntity:
    
    def __init__(self, email: str, password: str):
        self.email = email
        self.password = password

    def is_valid_email(self):
        return "@" in self.email and "." in self.email.split("@")[-1]
