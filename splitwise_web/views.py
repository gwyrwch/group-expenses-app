from hashlib import md5

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render

# Create your views here.
from django.views.generic.base import View


def index(request):
    if request.user.is_authenticated:
        return render(request, 'index.html')
    else:
        return HttpResponseRedirect(redirect_to='/sign_in_up')


def profile(request):
    if request.user.is_authenticated:
        return render(request, 'profile.html')
    else:
        return HttpResponseRedirect(redirect_to='/sign_in_up')


class SignInUP(View):
    def get(self, request):
        return render(request, 'sign_in_up.html')

    def post(self, request):
        if request.POST.get('sign-in-username'):
            print(request.POST)
            username = request.POST.get('sign-in-username')
            password = request.POST.get('sign-in-password')
            pass_hash = md5(password.encode()).hexdigest()
            user = authenticate(username=username, password=pass_hash)

            if user is not None:
                login(request, user)
                return HttpResponseRedirect(redirect_to='/')
            else:
                # todo: show that data is invalid with context={'invalid_data': True} or somehow
                return HttpResponseRedirect(redirect_to='/sign_in_up')

        elif request.POST.get('sign-up-username'):
            username = request.POST.get('sign-up-username')
            password = request.POST.get('sign-up-password')
            email = request.POST.get('sign-up-email')
            pass_hash = md5(password.encode()).hexdigest()
            user = User.objects.create_user(username, password=pass_hash, email=email)
            print(user)

            user = authenticate(username=username, password=pass_hash)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(redirect_to='/')

            return HttpResponseRedirect(redirect_to='/sign_in_up')

        return HttpResponseRedirect(redirect_to='/sign_in_up')


def index_mobile(request):
    if request.user.is_authenticated:
        return render(request, 'index_mobile.html')
    else:
        return HttpResponseRedirect(redirect_to='/sign_in_up')


def friends_groups_mobile(request):
    if request.user.is_authenticated:
        return render(request, 'friends_groups_mobile.html')
    else:
        return HttpResponseRedirect(redirect_to='/sign_in_up')


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(redirect_to='/sign_in_up')
