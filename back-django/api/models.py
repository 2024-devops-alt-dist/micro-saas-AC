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


class Questions(models.Model):
    text_question = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, db_column="category_id", null=True
    )
    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, db_column="level_id", null=True
    )

    class Meta:
        db_table = "questions"
        managed = False

    def __str__(self):
        return f"Question: {str(self.text_question)[:50]}"


class Propositions(models.Model):
    text = models.CharField(max_length=255)
    questions = models.ForeignKey(
        Questions,
        on_delete=models.CASCADE,
        db_column="questions_id",
        null=True,
        related_name="propositions",
    )
    is_correct = models.BooleanField(default=False)

    class Meta:
        db_table = "propositions"
        managed = False

    def __str__(self):
        return f"Proposition: {self.text}"


class Users(models.Model):
    id_user = models.AutoField(primary_key=True)
    pseudo = models.CharField(
        max_length=150, unique=True, db_column="pseudo", blank=True, null=True
    )
    email = models.EmailField(unique=True, db_column="email")
    password = models.CharField(max_length=255, db_column="password")

    class Meta:
        db_table = "users"
        managed = False

    def __str__(self):
        return str(self.pseudo)


class QuizStats(models.Model):
    user = models.ForeignKey(
        Users, on_delete=models.CASCADE, db_column="user_id", null=True
    )
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, db_column="category_id", null=True
    )
    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, db_column="level_id", null=True
    )
    date = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField()
    # On laisse les autres champs (quiz_id, average_time) optionnels car gérés par la base ou n8n

    class Meta:
        db_table = "quiz_stats"
        managed = False

    def __str__(self):
        return f"Stat {self.id}: {self.score}"
