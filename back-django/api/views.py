from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings

from .models import Category, Level, Propositions, Questions, QuizStats, Users
from .serializers import (
    CategorySerializer,
    LevelSerializer,
    PropositionsSerializer,
    QuestionsSerializer,
    QuizStatsSerializer,
    RegisterSerializer,
    UserSerializer,
)


# creation d un nouveau compte
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        data = request.data

        # Vérifier le mot de passe actuel pour toute modification
        current_password = data.get("current_password")
        if not current_password:
            return Response(
                {
                    "error": "Le mot de passe actuel est requis pour modifier votre profil"
                },
                status=400,
            )

        if not user.check_password(current_password):
            return Response({"error": "Mot de passe actuel incorrect"}, status=400)

        # Modifier l'email si fourni
        new_email = data.get("email")
        if new_email and new_email != user.email:
            # Vérifier que l'email n'est pas déjà utilisé
            if User.objects.filter(email=new_email).exclude(id=user.id).exists():
                return Response({"error": "Cet email est déjà utilisé"}, status=400)
            user.email = new_email

        # Modifier le mot de passe si fourni
        new_password = data.get("new_password")
        if new_password:
            if len(new_password) < 8:
                return Response(
                    {
                        "error": "Le nouveau mot de passe doit contenir au moins 8 caractères"
                    },
                    status=400,
                )
            user.set_password(new_password)

        user.save()
        serializer = UserSerializer(user)
        return Response(
            {"message": "Profil mis à jour avec succès", "user": serializer.data}
        )


def test_api(request):
    return JsonResponse(
        {"status": "ok", "message": "Test endpoint is working! on testttt"}
    )


# creation d une nouvelle catégorie
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# creation d'un nouveau niveau
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


class QuizStatsListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # On filtre via l'email pour faire le lien entre auth_user et la table users
        return QuizStats.objects.filter(user__email=self.request.user.email).order_by(
            "-date"
        )

    def perform_create(self, serializer):
        user_django = self.request.user
        print(f"DEBUG STATS - Tentative création pour: {user_django.email}")

        try:
            user_n8n, created = Users.objects.get_or_create(
                email=user_django.email,
                defaults={
                    "pseudo": user_django.username,
                },
            )
            print(
                f"DEBUG STATS - Utilisateur n8n: {user_n8n.pseudo} "
                f"(ID: {user_n8n.id_user}, Created: {created})"
            )
            print(f"DEBUG STATS - Data envoyée: {self.request.data}")

            serializer.save(user=user_n8n)
            print("DEBUG STATS - Sauvegarde réussie")

        except Exception as e:  # pylint: disable=broad-exception-caught
            print(f"DEBUG STATS - ERREUR CRITIQUE: {str(e)}")
            raise e


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=access_token,
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                value=refresh_token,
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
            # Optionnel: on peut enlever les tokens du corps de la réponse si on veut être strict
            # del response.data['access']
            # del response.data['refresh']
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Si le refresh token n'est pas dans le body, on le cherche dans les cookies
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        if refresh_token and "refresh" not in request.data:
            request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get("access")
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                value=access_token,
                expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Successfully logged out"}, status=200)
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        return response
