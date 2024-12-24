from rest_framework import serializers
from .models import UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'file', 'uploaded_at','user']
        read_only_fields = ['user']

class ListFileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UploadedFile
        fields=['id','file','uploaded_at']