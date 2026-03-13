from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model


class BasicTest(TestCase):
    def test_basic(self):
        """Test basique"""
        self.assertEqual(1 + 1, 2)


class TestEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_test_returns_200(self):
        resp = self.client.get("/api/test/")
        self.assertEqual(resp.status_code, 200)

        # verifie que ca renvoie du json
        data = resp.json()
        self.assertIsInstance(data, (dict, list))


class AuthCookieTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User = get_user_model()
        self.username = "testuser"
        self.password = "Test1234!"
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
            email="testuser@example.com",
        )

    def test_login_sets_jwt_cookies(self):
        resp = self.client.post(
            "/api/token/",
            {"username": self.username, "password": self.password},
            format="json",
        )
        self.assertEqual(resp.status_code, 200)

        # Vérifie que les cookies sont bien posés
        self.assertIn("access_token", resp.cookies)
        self.assertIn("refresh_token", resp.cookies)

        # Vérifie HttpOnly (sécurité)
        self.assertTrue(resp.cookies["access_token"]["httponly"])
        self.assertTrue(resp.cookies["refresh_token"]["httponly"])
