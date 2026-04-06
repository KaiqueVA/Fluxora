from abc import ABC, abstractmethod


class UserRepositoryInterface(ABC):

    @abstractmethod
    def create(self, email: str, password: str):
        pass

    @abstractmethod
    def get_by_email(self, email: str):
        pass
