from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from apps.saldo.presentation.factories import get_saldo_service
from apps.saldo.presentation.serializers import SaldoSerializer


class SaldoView(APIView):
    permission_classes = [IsAuthenticated]

    def get_service(self):
        return get_saldo_service()

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="periodo",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                description="Filtro de período. Valores aceitos: dia, semana, mes, ano."
            ),
            OpenApiParameter(
                name="data",
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description="Data base para o filtro. Formato: YYYY-MM-DD. Se não enviar, usa a data atual."
            ),
        ],
        responses={200: SaldoSerializer},
        description="Retorna o saldo do usuário autenticado, podendo filtrar por dia, semana, mês ou ano."
    )
    def get(self, request):
        periodo = request.query_params.get("periodo")
        data = request.query_params.get("data")

        data_base = None

        if data:
            try:
                data_base = datetime.strptime(data, "%Y-%m-%d").date()
            except ValueError:
                return Response(
                    {"detail": "Data inválida. Use o formato YYYY-MM-DD."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        service = self.get_service()

        try:
            saldo = service.execute(
                user=request.user,
                periodo=periodo,
                data_base=data_base,
            )

            serializer = SaldoSerializer(saldo)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        except ValueError as error:
            return Response(
                {"detail": str(error)},
                status=status.HTTP_400_BAD_REQUEST
            )