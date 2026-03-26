from django.contrib.auth.models import User
from django.db import connection
from rest_framework import serializers

from .models import Category, Level, Propositions, Questions, QuizStats, Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "date_joined"]
        read_only_fields = ["id", "date_joined"]


# mdp cryptés en bdd
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "password", "email"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Un compte avec cet email existe déjà.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        # Créer l'entrée dans la table `users` (partagée avec n8n) dès l'inscription
        # pour éviter les conflits de séquence PostgreSQL lors de la création de quiz
        if not Users.objects.filter(email=user.email).exists():
            with connection.cursor() as cursor:
                cursor.execute("SELECT COALESCE(MAX(id_user), 0) + 1 FROM users")
                next_id = cursor.fetchone()[0]
            Users.objects.create(
                id_user=next_id,
                email=user.email,
                pseudo=user.username,
            )

        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
        read_only_fields = ["id"]


class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ["id", "name"]
        read_only_fields = ["id"]


class PropositionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propositions
        fields = ["id", "text", "questions_id", "is_correct"]
        read_only_fields = ["id"]


class QuestionsSerializer(serializers.ModelSerializer):
    propositions = PropositionsSerializer(many=True, read_only=True)

    class Meta:
        model = Questions
        fields = ["id", "text_question", "category_id", "level_id", "propositions"]
        read_only_fields = ["id"]


class QuizStatsSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id_user", read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(source="category", queryset=Category.objects.all())
    level_id = serializers.PrimaryKeyRelatedField(source="level", queryset=Level.objects.all())
    category_name = serializers.ReadOnlyField(source="category.name")
    level_name = serializers.ReadOnlyField(source="level.name")

    class Meta:
        model = QuizStats
        fields = [
            "id",
            "user_id",
            "category_id",
            "category_name",
            "level_id",
            "level_name",
            "date",
            "score",
        ]
        read_only_fields = ["id", "date"]
