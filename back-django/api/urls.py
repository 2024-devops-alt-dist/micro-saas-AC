"""URL configuration for l’API QuizPilot."""

from django.urls import path

from . import views

urlpatterns = [
    path("test/", views.test_api, name="test-api"),
    path("categories/", views.CategoryListCreateView.as_view(), name="category-list"),
    path(
        # "categories/<uuid:id>/",
        "categories/<int:id>/",
        views.CategoryRetrieveUpdateDestroyView.as_view(),
        name="category-detail",
    ),
    path("levels/", views.LevelListCreateView.as_view(), name="level-list"),
    path(
        # "levels/<uuid:id>/",
        "levels/<int:id>/",
        views.LevelRetrieveUpdateDestroyView.as_view(),
        name="level-detail",
    ),
    path("users/", views.UserListCreateView.as_view(), name="user-list"),
    path(
        # "users/<uuid:id>/",
        "users/<int:id>/",
        views.UserRetrieveUpdateDestroyView.as_view(),
        name="user-detail",
    ),
    path("questions/", views.QuestionsListCreateView.as_view(), name="questions-list"),
    path(
        "questions/<int:id>/",
        views.QuestionsRetrieveUpdateDestroyView.as_view(),
        name="questions-detail",
    ),
    path(
        "propositions/",
        views.PropositionsListCreateView.as_view(),
        name="propositions-list",
    ),
    path(
        "propositions/<int:id>/",
        views.PropositionsRetrieveUpdateDestroyView.as_view(),
        name="propositions-detail",
    ),
]
