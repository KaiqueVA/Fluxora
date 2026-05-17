from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ViewSet
from rest_framework.pagination import PageNumberPagination

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.metas.domain.exceptions import ValidationException
from apps.metas.presentation.serializers import MetaFinanceiraSerializer
from apps.metas.presentation.factories import (
    create_meta_financeira_service,
    delete_meta_financeira_service,
    list_metas_financeiras_service,
    retrieve_meta_financeira_service,
    update_meta_financeira_service,
)


class MetaFinanceiraPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class MetaFinanceiraViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=MetaFinanceiraSerializer,
        responses={
            201: MetaFinanceiraSerializer,
            400: OpenApiTypes.OBJECT,
        },
        description="Cria uma nova meta financeira para o usuário autenticado",
    )
    def create(self, request):
        serializer = MetaFinanceiraSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = create_meta_financeira_service()

        try:
            meta = service.execute({
                **serializer.validated_data,
                "user": request.user
            })

            return Response(
                MetaFinanceiraSerializer(meta).data,
                status=status.HTTP_201_CREATED
            )

        except ValidationException as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )



    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="page",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Número da página"
            ),
            OpenApiParameter(
                name="page_size",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Quantidade de itens por página"
            ),
        ],
        responses={200: MetaFinanceiraSerializer(many=True)}
    )
    def list(self, request):
        service = list_metas_financeiras_service()
        metas = service.execute(request.user).order_by("-deadline", "-id")

        paginator = MetaFinanceiraPagination()
        paginated_metas = paginator.paginate_queryset(metas, request)

        serializer = MetaFinanceiraSerializer(paginated_metas, many=True)

        return paginator.get_paginated_response(serializer.data)




    @extend_schema(
        responses={
            200: MetaFinanceiraSerializer,
            404: dict,
        }
    )
    def retrieve(self, request, pk=None):
        service = retrieve_meta_financeira_service()
        meta = service.execute(pk, request.user)

        if meta is None:
            return Response(
                {"error": "Meta financeira not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            MetaFinanceiraSerializer(meta).data,
            status=status.HTTP_200_OK
        )





    @extend_schema(
        request=MetaFinanceiraSerializer,
        responses={
            200: MetaFinanceiraSerializer,
            400: dict,
            404: dict,
        }
    )
    def update(self, request, pk=None):
        serializer = MetaFinanceiraSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = update_meta_financeira_service()

        try:
            meta = service.execute(
                meta_id=pk,
                user=request.user,
                data=serializer.validated_data
            )

            if meta is None:
                return Response(
                    {"error": "Meta financeira not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                MetaFinanceiraSerializer(meta).data,
                status=status.HTTP_200_OK
            )

        except ValidationException as error:
            return Response(
                {"error": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )



    @extend_schema(
        responses={
            204: None,
            404: dict,
        }
    )
    def destroy(self, request, pk=None):
        service = delete_meta_financeira_service()
        deleted = service.execute(pk, request.user)

        if not deleted:
            return Response(
                {"error": "Meta financeira not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)