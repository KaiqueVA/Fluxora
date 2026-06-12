class UserEntity:

    def __init__(
        self,
        email: str,
        password: str,
        name: str,
        birth_date,
        phone: str,
        profession: str | None = None,
        monthly_income=None,
    ):
        self.email = email
        self.password = password
        self.name = name
        self.birth_date = birth_date
        self.phone = phone
        self.profession = profession
        self.monthly_income = monthly_income

    def is_valid_email(self):
        return "@" in self.email and "." in self.email.split("@")[-1]
