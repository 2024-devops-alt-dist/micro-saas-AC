from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

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

    def create(self, request, *args, **kwargs):
        print(f"DEBUG STATS - Requête reçue de: {request.user.email}")
        print(f"DEBUG STATS - Payload: {request.data}")

        try:
            # On s'assure d'abord que l'utilisateur n8n existe
            user_django = request.user
            user_n8n, created = Users.objects.get_or_create(
                email=user_django.email,
                defaults={
                    "pseudo": user_django.username,
                    "password": "dummy_password_for_constraint",
                },
            )
            print(
                f"DEBUG STATS - Utilisateur n8n: {user_n8n.pseudo} (ID: {user_n8n.id_user}, Created: {created})"
            )

            # Validation manuelle pour voir si ça bloque ici
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print(f"DEBUG STATS - Erreur Validation: {serializer.errors}")
                return Response(serializer.errors, status=400)

            # Sauvegarde
            serializer.save(user=user_n8n)
            print("DEBUG STATS - SUCCESS: Score enregistré en base")
            return Response(serializer.data, status=201)

        except Exception as e:
            print(f"DEBUG STATS - ERREUR CRITIQUE: {str(e)}")
            import traceback

            traceback.print_exc()  # Affiche la pile d'exécution complète dans les logs
            return Response({"error": str(e)}, status=500)
