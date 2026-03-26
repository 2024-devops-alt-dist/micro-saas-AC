"""
Commande de management Django pour synchroniser la table `users`
avec les comptes Django (auth_user).

Usage:
    python manage.py sync_users

Utile pour corriger les utilisateurs déjà enregistrés en prod
qui n'ont pas encore d'entrée dans la table `users` (partagée avec n8n).
"""

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import connection

from api.models import Users


class Command(BaseCommand):
    help = "Synchronise la table users avec les comptes Django auth_user"

    def handle(self, *args, **options):
        django_users = User.objects.all()
        created_count = 0
        skipped_count = 0

        for django_user in django_users:
            # Ignorer les superusers (admins Django)
            if django_user.is_superuser:
                self.stdout.write(self.style.WARNING(f"  Ignoré (superuser) : {django_user.username} <{django_user.email}>"))
                skipped_count += 1
                continue

            if not django_user.email:
                self.stdout.write(self.style.WARNING(f"  Ignoré (sans email) : {django_user.username}"))
                skipped_count += 1
                continue

            existing = Users.objects.filter(email=django_user.email).first()
            if existing:
                self.stdout.write(f"  Déjà présent : {django_user.username} <{django_user.email}>")
                skipped_count += 1
            else:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT COALESCE(MAX(id_user), 0) + 1 FROM users")
                    next_id = cursor.fetchone()[0]

                Users.objects.create(
                    id_user=next_id,
                    email=django_user.email,
                    pseudo=django_user.username,
                )
                self.stdout.write(self.style.SUCCESS(f"  Créé (id={next_id}) : {django_user.username} <{django_user.email}>"))
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"\nTerminé : {created_count} créé(s), {skipped_count} ignoré(s)."))
