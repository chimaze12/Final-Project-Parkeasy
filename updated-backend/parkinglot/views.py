from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from parkinglot.models import ParkingLot, Account, Rating, BookLot
from parkinglot.serializers import ParkingLotSerializer, BookLotSerializer, AccountSerializer, RatingSerializer


class ParkingLotViewSet(viewsets.ModelViewSet):
    queryset = ParkingLot.objects.all()
    serializer_class = ParkingLotSerializer
    permission_classes = [permissions.IsAuthenticated]


class BookLotViewSet(viewsets.ModelViewSet):
    queryset = BookLot.objects.all()
    serializer_class = BookLotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        account = Account.objects.get(user=request.user)
        if account.balance < serializer.instance.parkinglot.price:
            return Response({'error': 'Not enough balance'}, status=status.HTTP_400_BAD_REQUEST)
        account.balance -= serializer.instance.parkinglot.price
        account.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class DepositViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def create(self, request, *args, **kwargs):
        account = Account.objects.get(user=request.user)
        account.balance += int(request.data['amount'])
        account.save()
        return Response({'balance': account.balance}, status=status.HTTP_201_CREATED)


class RatingViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer

    def create(self, request, *args, **kwargs):
        try:
            rate = Rating.objects.get(parkinglot_id=request.data["parkinglot"], user_id=request.data["user"])
            if rate:
                rate.no_of_stars = request.data["no_of_stars"]
                rate.save()
                return Response(status=status.HTTP_201_CREATED)
        except:
            print("user has not rated that parking lot before")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        try:
            keys = str(kwargs["pk"])
            key_arr = keys.split("-")
            instance = Rating.objects.get(user_id=int(key_arr[0]), parkinglot_id=int(key_arr[1]))
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_100_CONTINUE)
