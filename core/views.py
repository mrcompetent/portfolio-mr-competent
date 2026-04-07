import json
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
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

def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Disallow: /admin/",
        "Allow: /",
        "Sitemap: https://portfolio-mr-competent.vercel.app/sitemap.xml"
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")

def sitemap_xml(request):
    xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://portfolio-mr-competent.vercel.app/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
    return HttpResponse(xml, content_type="application/xml")
