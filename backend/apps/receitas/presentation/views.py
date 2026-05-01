from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from apps.receitas.application.services import (
    CreateReceitaService,
    ListReceitasService,
    RetrieveReceitaService,
    UpdateReceitaService,
    DeleteReceitaService,
)
from apps.receitas.infrastructure.repositories import ReceitaRepository
from apps.receitas.presentation.serializers import ReceitaSerializer
from apps.receitas.domain.exceptions import ValidationException

class ReceitaPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    


class ReceitaViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_repository(self):
        return ReceitaRepository()
    
    @extend_schema(
        request=ReceitaSerializer,
        responses={
            201: ReceitaSerializer,
            400: OpenApiTypes.OBJECT
        },
        description="Cria uma nova receita para o usuário autenticado"
    )
    
    def create(self, request):
        serializer = ReceitaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        
        service = CreateReceitaService(self.get_repository())
        try:
            receita = service.execute({
               **serializer.validated_data,
                "user": request.user 
            })
            
            return Response(ReceitaSerializer(receita).data, status=status.HTTP_201_CREATED)
        except ValidationException as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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
    responses={200: ReceitaSerializer(many=True)}
    )
    def list(self, request):
        service = ListReceitasService(self.get_repository())
        receitas = service.execute(request.user).order_by("-date", "-id")

        paginator = ReceitaPagination()
        paginated_receitas = paginator.paginate_queryset(receitas, request)

        serializer = ReceitaSerializer(paginated_receitas, many=True)

        return paginator.get_paginated_response(serializer.data)
    
    @extend_schema(
        responses={200: ReceitaSerializer, 404: dict}
    )
    def retrieve(self, request, pk=None):
        service = RetrieveReceitaService(self.get_repository())
        receita = service.execute(pk, request.user)

        if receita is None:
            return Response(
                {"error": "Receita not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            ReceitaSerializer(receita).data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        request=ReceitaSerializer,
        responses={200: ReceitaSerializer, 400: dict, 404: dict},
    )
    def update(self, request, pk=None):
        serializer = ReceitaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        
        service = UpdateReceitaService(self.get_repository())

        try:
            receita = service.execute(
                receita_id=pk,
                user=request.user,
                data=serializer.validated_data
            )

            if receita is None:
                return Response(
                    {"error": "Receita not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                ReceitaSerializer(receita).data,
                status=status.HTTP_200_OK
            )

        except ValidationException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        responses={204: None, 404: dict}
    )
    def destroy(self, request, pk=None):
        service = DeleteReceitaService(self.get_repository())
        deleted = service.execute(pk, request.user)

        if not deleted:
            return Response(
                {"error": "Receita not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
