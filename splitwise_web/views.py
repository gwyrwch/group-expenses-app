from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, 'index.html')


def profile(request):
    return render(request, 'profile.html')


def sign_in_up(request):
    return render(request, 'sign_in_up.html')


def index_mobile(request):
    return render(request, 'index_mobile.html')