from django.urls import path,include
from .views import FileUploadView, FileDownloadView,FileListView,FileDeleteView

urlpatterns = [
    
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('download/<int:file_id>/', FileDownloadView.as_view(), name='file-download'),
    path('delete/<int:pk>/',FileDeleteView.as_view(),name='file-delete'),
    path('',FileListView.as_view(),name='file-list')
]
