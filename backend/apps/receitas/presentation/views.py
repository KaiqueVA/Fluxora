from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from apps.receitas.application.services import CreateReceitaService
from apps.receitas.infrastructure.repositories import ReceitaRepository
from apps.receitas.presentation.serializers import ReceitaSerializer
from apps.receitas.domain.exceptions import ValidationException

class ReceitaViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
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
        
        service = CreateReceitaService(ReceitaRepository())
        try:
            receita = service.execute({
                'description': validated_data.get('descricao'),
                'value': validated_data.get('valor'),
                'date': validated_data.get('data'),
                'user': request.user
            })
            
            return Response(ReceitaSerializer(receita).data, status=status.HTTP_201_CREATED)
        except ValidationException as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)