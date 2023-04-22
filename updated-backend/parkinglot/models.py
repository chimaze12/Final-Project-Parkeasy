from django.db import models
from django.contrib.auth.models import User


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


class ParkingLot(models.Model):
    name = models.CharField(max_length=200, unique=True,)
    price = models.IntegerField()

    def __str__(self):
        return self.name


class BookLot(models.Model):
    date_booked = models.DateTimeField(auto_now_add=True)
    parkinglot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name='booked_lot')
    user = models.ForeignKey(User, related_name='booked_by', on_delete=models.CASCADE)
    amount = models.IntegerField()


class Rating(models.Model):
    parkinglot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name='rate_lot')
    no_of_stars = models.IntegerField()
    user = models.ForeignKey(User, related_name='rate_by', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.no_of_stars) + " " + str(self.user)