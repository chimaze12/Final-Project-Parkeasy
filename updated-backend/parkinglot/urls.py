from django.urls import path, include
from rest_framework import routers

from parkinglot import views

router = routers.DefaultRouter()
router.register(r'parkinglots', views.ParkingLotViewSet)
router.register(r'booklots', views.BookLotViewSet)
router.register(r'account', views.DepositViewSet)
router.register(r'rate', views.RatingViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
