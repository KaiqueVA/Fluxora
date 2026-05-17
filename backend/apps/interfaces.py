from abc import ABC, abstractmethod


class UserScopedRepositoryInterface(ABC):

    @abstractmethod
    def create(self, entity):
        pass

    @abstractmethod
    def list_by_user(self, user):
        pass

    @abstractmethod
    def get_by_id_for_user(self, entity_id, user):
        pass

    @abstractmethod
    def update(self, instance, data):
        pass

    @abstractmethod
    def delete(self, instance):
        pass
