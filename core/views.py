import json
from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings

def index(request):
    return render(request, 'index.html')

def contact_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            message = data.get('message')
            
            if not all([name, email, message]):
                return JsonResponse({"status": "error", "message": "All fields are required."}, status=400)
            
            # Send the email to the console
            subject = f"New Portfolio Contact from {name}"
            body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL,
                ['me@portfolio.com'], # Target email
                fail_silently=False,
            )
            
            return JsonResponse({"status": "success", "message": "Email sent successfully!"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    
    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)
