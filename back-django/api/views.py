from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import generics

from .models import Category, Level, Propositions, Questions
from .serializers import (
    CategorySerializer,
    LevelSerializer,
    PropositionsSerializer,
    QuestionsSerializer,
    UserSerializer,
)


def test_api(request):
    return JsonResponse(
        {"status": "ok", "message": "Test endpoint is working! on testttt"}
    )


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LevelListCreateView(generics.ListCreateAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer


class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "id"


class LevelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    lookup_field = "id"


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"


class UserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"


class QuestionsListCreateView(generics.ListCreateAPIView):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer


class QuestionsRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Questions.objects.all()
    serializer_class = QuestionsSerializer
    lookup_field = "id"


class PropositionsListCreateView(generics.ListCreateAPIView):
    queryset = Propositions.objects.all()
    serializer_class = PropositionsSerializer


class PropositionsRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Propositions.objects.all()
    serializer_class = PropositionsSerializer
    lookup_field = "id"
