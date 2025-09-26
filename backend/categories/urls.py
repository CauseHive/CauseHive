from django.urls import path
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count

from .models import Category
from .serializers import CategorySerializer


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Category.objects.annotate(cause_count=Count('causes'))
        page_size = request.query_params.get('page_size')
        # Simple non-paginated response; frontend expects count + results
        data = CategorySerializer(qs, many=True).data
        return Response({
            'count': qs.count(),
            'next': None,
            'previous': None,
            'results': data[: int(page_size)] if page_size else data,
        })


urlpatterns = [
    path('', CategoryListView.as_view(), name='category_list'),
]
