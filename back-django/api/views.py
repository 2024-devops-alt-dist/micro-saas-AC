from django.http import JsonResponse
from rest_framework import generics
from .models import Category, Level
from .serializers import LevelSerializer
from .serializers import CategorySerializer


def test_api(request):
    return JsonResponse({"status": "ok", "message": "Test endpoint is working! on testttt"})


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LevelListCreateView(generics.ListCreateAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer


class CategoryRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'id'


class LevelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    lookup_field = 'id'