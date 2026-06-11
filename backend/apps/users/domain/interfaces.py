from abc import ABC, abstractmethod


class UserRepositoryInterface(ABC):

    @abstractmethod
    def create(self, email: str, password: str, **extra_fields):
        pass

    @abstractmethod
    def get_by_email(self, email: str):
        pass

    @abstractmethod
    def update(self, user, **fields):
        pass
