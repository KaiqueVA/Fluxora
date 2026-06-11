from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.domain.exceptions import (
    AuthenticationException,
    UserAlreadyExistsException,
    ValidationException,
)
from apps.users.presentation.factories import (
    login_user_service,
    register_user_service,
    update_user_monthly_income_service,
    update_user_phone_service,
    update_user_profession_service,
)
from apps.users.presentation.serializers import (
    LoginSerializer,
    MonthlyIncomeSerializer,
    PhoneSerializer,
    ProfessionSerializer,
    RegisterSerializer,
)


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
                name=serializer.validated_data["name"],
                birth_date=serializer.validated_data.get("birth_date"),
                phone=serializer.validated_data.get("phone"),
                profession=serializer.validated_data.get("profession") or None,
                monthly_income=serializer.validated_data.get("monthly_income"),
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
                "name": user.name,
                "birth_date": user.birth_date,
                "phone": user.phone,
                "profession": user.profession,
                "monthly_income": user.monthly_income,
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


class UserPhoneView(APIView):
    permission_classes = [IsAuthenticated]

    def get_service(self):
        return update_user_phone_service()

    @extend_schema(responses={200: PhoneSerializer})
    def get(self, request):
        return Response({"phone": request.user.phone}, status=status.HTTP_200_OK)

    @extend_schema(
        request=PhoneSerializer,
        responses={200: PhoneSerializer, 400: dict},
    )
    def patch(self, request):
        serializer = PhoneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = self.get_service().execute(
                request.user,
                serializer.validated_data["phone"],
            )
        except ValidationException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"phone": user.phone}, status=status.HTTP_200_OK)


class UserProfessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get_service(self):
        return update_user_profession_service()

    @extend_schema(responses={200: ProfessionSerializer})
    def get(self, request):
        return Response(
            {"profession": request.user.profession},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=ProfessionSerializer,
        responses={200: ProfessionSerializer, 400: dict},
    )
    def patch(self, request):
        serializer = ProfessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = self.get_service().execute(
                request.user,
                serializer.validated_data.get("profession"),
            )
        except ValidationException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"profession": user.profession},
            status=status.HTTP_200_OK,
        )


class UserMonthlyIncomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get_service(self):
        return update_user_monthly_income_service()

    @extend_schema(responses={200: MonthlyIncomeSerializer})
    def get(self, request):
        return Response(
            {"monthly_income": request.user.monthly_income},
            status=status.HTTP_200_OK,
        )

    @extend_schema(
        request=MonthlyIncomeSerializer,
        responses={200: MonthlyIncomeSerializer, 400: dict},
    )
    def patch(self, request):
        serializer = MonthlyIncomeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = self.get_service().execute(
                request.user,
                serializer.validated_data.get("monthly_income"),
            )
        except ValidationException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"monthly_income": user.monthly_income},
            status=status.HTTP_200_OK,
        )
