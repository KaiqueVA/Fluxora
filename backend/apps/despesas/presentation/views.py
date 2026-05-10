from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from drf_spectacular.utils import extend_schema

from apps.despesas.application.services import (
    CreateDespesaService,
    ListDespesasService,
    RetrieveDespesaService,
    UpdateDespesaService,
    DeleteDespesaService,
)
from apps.despesas.infrastructure.repositories import DespesaRepository
from apps.despesas.presentation.serializers import DespesaSerializer
from apps.despesas.domain.exceptions import ValidationException, DespesaNotFoundException


class DespesaPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class DespesaViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    pagination_class = DespesaPagination

    def get_repository(self):
        return DespesaRepository()

    @extend_schema(
        request=DespesaSerializer,
        responses={201: DespesaSerializer},
    )
    def create(self, request):
        serializer = DespesaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            service = CreateDespesaService(self.get_repository())
            despesa = service.execute(serializer.validated_data, request.user)

            return Response(
                DespesaSerializer(despesa).data,
                status=status.HTTP_201_CREATED
            )

        except ValidationException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @extend_schema(
        responses={200: DespesaSerializer(many=True)},
    )
    def list(self, request):
        service = ListDespesasService(self.get_repository())
        despesas = service.execute(request.user)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(despesas, request)

        serializer = DespesaSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    @extend_schema(
        responses={200: DespesaSerializer},
    )
    def retrieve(self, request, pk=None):
        try:
            service = RetrieveDespesaService(self.get_repository())
            despesa = service.execute(pk, request.user)

            return Response(DespesaSerializer(despesa).data)

        except DespesaNotFoundException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        request=DespesaSerializer,
        responses={200: DespesaSerializer},
    )
    def update(self, request, pk=None):
        serializer = DespesaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            service = UpdateDespesaService(self.get_repository())
            despesa = service.execute(pk, serializer.validated_data, request.user)

            return Response(DespesaSerializer(despesa).data)

        except DespesaNotFoundException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_404_NOT_FOUND
            )

        except ValidationException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @extend_schema(
        responses={204: None},
    )
    def destroy(self, request, pk=None):
        try:
            service = DeleteDespesaService(self.get_repository())
            service.execute(pk, request.user)

            return Response(status=status.HTTP_204_NO_CONTENT)

        except DespesaNotFoundException as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_404_NOT_FOUND
            )