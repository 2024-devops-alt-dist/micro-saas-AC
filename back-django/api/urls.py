"""URL configuration for l’API QuizPilot."""

from django.urls import path

from . import views

urlpatterns = [
    # Pour échanger un identifiant/mot de passe contre un jeton (Connexion)
    path("token/", views.CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Pour rester connecté sans avoir à retaper son mot de passe
    path(
        "token/refresh/", views.CookieTokenRefreshView.as_view(), name="token_refresh"
    ),
    # Déconnexion (suppression des cookies)
    path("logout/", views.LogoutView.as_view(), name="logout"),
    # Enregistrer un nouvel utilisateur
    path("register/", views.RegisterView.as_view(), name="auth_register"),
    path("me/", views.MeView.as_view(), name="me"),
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
    path("stats/", views.QuizStatsListCreateView.as_view(), name="stats-list"),
]
