"""URL configuration for l’API QuizPilot."""

from django.urls import path

from . import views

urlpatterns = [
    path("test/", views.test_api, name="test-api"),
    path("categories/", views.CategoryListCreateView.as_view(), name="category-list"),
    path(
        "categories/<uuid:id>/",
        views.CategoryRetrieveUpdateDestroyView.as_view(),
        name="category-detail",
    ),
    path("levels/", views.LevelListCreateView.as_view(), name="level-list"),
    path(
        "levels/<uuid:id>/",
        views.LevelRetrieveUpdateDestroyView.as_view(),
        name="level-detail",
    ),
    path("users/", views.UserListCreateView.as_view(), name="user-list"),
    path(
        "users/<uuid:id>/",
        views.UserRetrieveUpdateDestroyView.as_view(),
        name="user-detail",
    ),
]
