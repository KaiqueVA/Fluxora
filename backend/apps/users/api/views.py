from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from .serializers import RegisterSerializer, LoginSerializer
from apps.users.services.user_service import UserService

class RegisterView(APIView):
    @extend_schema(
        request=RegisterSerializer,
        responses={201: dict}
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            service = UserService()
            
            try:
                user = service.create_user(**serializer.validated_data)
                return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    @extend_schema(
        request=LoginSerializer,
        responses={200: dict}
        )
    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            service = UserService()
           
            try:
               result = service.login(**serializer.validated_data)
               return Response(result, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)