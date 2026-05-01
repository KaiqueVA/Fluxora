class ReceitaEntity:
    def __init__(self, description: str, value: float, date: str, user: str, id: str = None):
        self.id = id
        self.description = description
        self.value = value
        self.date = date
        self.user = user   