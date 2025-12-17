# import uuid

# from django.contrib.auth.models import User
# from django.db import models


# class Category(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=100)

#     def __str__(self):
#         return f"Category: {self.name}"


# class Level(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     name = models.CharField(max_length=100)

#     def __str__(self):
#         return f"Level: {self.name}"


from django.contrib.auth.models import User
from django.db import models


class Category(models.Model):
    # L'id est automatiquement un IntegerField (comme sur n8n)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "category"  # On pointe vers la table existante
        managed = False  # On interdit à Django de modifier la structure

    def __str__(self):
        return f"Category: {self.name}"


class Level(models.Model):
    # L'id est automatiquement un IntegerField
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "level"  # On pointe vers la table existante
        managed = False

    def __str__(self):
        return f"Level: {self.name}"
