from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.parsers import FileUploadParser,MultiPartParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.http import FileResponse
from .models import UploadedFile
from .serializers import UploadedFileSerializer,ListFileSerializer
import mimetypes

class FileUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):

        # print(request.user.id,"Hello")
        serializer = UploadedFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id, *args, **kwargs):
        try:
            uploaded_file = UploadedFile.objects.get(id=file_id,user=request.user)
            file_path = uploaded_file.file.path
            file_name = uploaded_file.file.name.split('/')[-1]
            mime_type, _ = mimetypes.guess_type(file_path)
            response = FileResponse(open(file_path, 'rb'))
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            response['Content-Type'] = mime_type or 'application/octet-stream'
            return response
            # return FileResponse(uploaded_file.file.open(), as_attachment=True)
        except UploadedFile.DoesNotExist:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)


class FileListView(ListAPIView):
    permission_classes=[IsAuthenticated]
    serializer_class=ListFileSerializer
    
    def get_queryset(self):
        return UploadedFile.objects.filter(user=self.request.user)

class FileDeleteView(APIView):
    permission_classes=[IsAuthenticated]

    def delete(self, request, pk, *args, **kwargs):
        # Fetch the file object by ID
        file_obj = get_object_or_404(UploadedFile, pk=pk, user=request.user)
        print(file_obj)
        # Delete the file
        file_obj.delete()
        return Response({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


