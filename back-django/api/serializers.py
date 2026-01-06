from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Category, Level, Questions, Propositions


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "date_joined"]
        read_only_fields = ["id", "date_joined"]


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
