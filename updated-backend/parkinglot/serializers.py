from rest_framework import serializers

from parkinglot.models import ParkingLot, BookLot, Account, Rating


class ParkingLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingLot
        fields = ('name', 'price' ,'url')


class BookLotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookLot
        fields = ('date_booked', 'parkinglot', 'user', 'amount')


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('balance', 'user')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('parkinglot', 'no_of_stars', 'user')
