from django.http import JsonResponse


def test_api(request):
    return JsonResponse({"status": "ok", "message": "Test endpoint is working! on testttt"})
