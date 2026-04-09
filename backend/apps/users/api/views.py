from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.users.api.serializers import RegisterSerializer, LoginSerializer
from apps.users.services.user_service import UserService, AuthService

class RegisterView(APIView):
    
    user_service = UserService()
    
    @extend_schema(
        request=RegisterSerializer,
        responses={201: dict}
    )
    
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if serializer.is_valid():
            try:
                user = self.user_service.create_user(
                    email=serializer.validated_data['email'],
                    password=serializer.validated_data['password'],
                )
                return Response(
                    {
                        'id': user.id,
                        'email': user.email,
                        'message': 'User registered successfully'},
                    status=status.HTTP_201_CREATED
                )
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    auth_service = AuthService()
    
    @extend_schema(
        request=LoginSerializer,
        responses={200: dict}
        )
    def post(self, request):
        
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            tokens = self.auth_service.login(
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password'],
            )
            return Response(tokens, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)