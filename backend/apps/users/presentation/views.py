from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.domain.exceptions import (
    AuthenticationException,
    UserAlreadyExistsException,
    ValidationException,
)
from apps.users.presentation.factories import login_user_service, register_user_service
from apps.users.presentation.serializers import LoginSerializer, RegisterSerializer


class RegisterView(APIView):

    def get_service(self):
        return register_user_service()

    @extend_schema(
        request=RegisterSerializer,
        responses={201: dict, 400: dict},
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = self.get_service().execute(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        except (ValidationException, UserAlreadyExistsException) as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "id": user.id,
                "email": user.email,
                "message": "User registered successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):

    def get_service(self):
        return login_user_service()

    @extend_schema(
        request=LoginSerializer,
        responses={200: dict, 401: dict},
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            tokens = self.get_service().execute(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        except AuthenticationException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(tokens, status=status.HTTP_200_OK)
