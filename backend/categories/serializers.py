from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    cause_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'cause_count']
