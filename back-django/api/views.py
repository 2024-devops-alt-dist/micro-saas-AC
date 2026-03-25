from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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
                {"error": "Le mot de passe actuel est requis pour modifier votre profil"},
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
                    {"error": "Le nouveau mot de passe doit contenir au moins 8 caractères"},
                    status=400,
                )
            user.set_password(new_password)

        user.save()
        serializer = UserSerializer(user)
        return Response({"message": "Profil mis à jour avec succès", "user": serializer.data})

    def delete(self, request):
        user = request.user
        current_password = request.data.get("current_password")

        if not current_password:
            return Response(
                {"error": "Le mot de passe est requis pour supprimer votre compte"},
                status=400,
            )

        if not user.check_password(current_password):
            return Response({"error": "Mot de passe incorrect"}, status=400)

        user.delete()

        response = Response({"message": "Compte supprimé avec succès"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


def test_api(request):
    return JsonResponse({"status": "ok", "message": "Test endpoint is working! on testttt"})


# CRUD pour "l'outil principal" de l'app
# création d'une nouvelle catégorie
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


# Stats : utilisateur authentifié obligatoire, filtrage que sur ses propres stats
class QuizStatsListCreateView(generics.ListCreateAPIView):
    serializer_class = QuizStatsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # On filtre via l'email pour faire le lien entre auth_user et la table users
        return QuizStats.objects.filter(user__email=self.request.user.email).order_by("-date")

    # creation d une nouvelle stat : recup user django, trouver ou créer user n8n, sauvegarder la stat avec ce user n8n
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
            print(f"DEBUG STATS - Utilisateur n8n: {user_n8n.pseudo} " f"(ID: {user_n8n.id_user}, Created: {created})")
            print(f"DEBUG STATS - Data envoyée: {self.request.data}")

            serializer.save(user=user_n8n)
            print("DEBUG STATS - Sauvegarde réussie")

        except Exception as e:  # pylint: disable=broad-exception-caught
            print(f"DEBUG STATS - ERREUR CRITIQUE: {str(e)}")
            raise e


# gestion de l'auth (stocker les tokens JWT dans des cookies HTTP-only au lieu de les retourner simplement dans le corps de la réponse JSON)
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # On appelle la logique de base pour obtenir les tokens
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")
            print(f"DEBUG LOGIN - Connexion réussie, token généré: {access_token[:20]}...")
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
        return response


# renouveller le token quand il expire
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


# demander au navigateur de supprimer les cookies pour se déconnecter
class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Successfully logged out"}, status=200)
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])
        response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])
        return response


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        if not email:
            return Response({"error": "L'email est requis."}, status=400)

        # On ne révèle pas si l'email existe ou non (sécurité)
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:3005")
            reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

            send_mail(
                subject="Réinitialisation de votre mot de passe QuizPilot",
                message=(
                    f"Bonjour {user.username},\n\n"
                    f"Vous avez demandé la réinitialisation de votre mot de passe.\n\n"
                    f"Cliquez sur le lien ci-dessous (valable 24h) :\n{reset_link}\n\n"
                    f"Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\n"
                    f"L'équipe QuizPilot"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass  # On ne révèle pas si l'adresse est connue

        return Response({"message": "Si cet email est enregistré, un lien de réinitialisation vous a été envoyé."}, status=200)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not all([uid, token, new_password]):
            return Response({"error": "Tous les champs sont requis."}, status=400)

        if len(new_password) < 8:
            return Response({"error": "Le mot de passe doit contenir au moins 8 caractères."}, status=400)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Lien invalide."}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Lien expiré ou invalide."}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Mot de passe réinitialisé avec succès."}, status=200)
