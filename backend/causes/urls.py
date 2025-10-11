from django.urls import path
from .views import (
    CauseCreateView,
    CauseDeleteView,
    CauseListView,
    CauseDetailView,
    AdminCauseListView,
    AdminCauseUpdateView,
    CauseListCreateView,
    CauseRetrieveUpdateView,
)

urlpatterns = [
    path('', CauseListCreateView.as_view(), name='cause_list_create'),
    path('<uuid:id>/', CauseRetrieveUpdateView.as_view(), name='cause_retrieve_update'),
    path('create/', CauseCreateView.as_view(), name='cause_create'),
    path('list/', CauseListView.as_view(), name='cause_list'),
    path('delete/<uuid:id>/', CauseDeleteView.as_view(), name='cause_delete'),
    path('details/<uuid:id>/', CauseDetailView.as_view(), name='cause_detail'),
    # path('admin/causes/', AdminCauseListView.as_view(), name='cause_admin_list'),
    # path('admin/causes/<uuid:id>/update/', AdminCauseUpdateView.as_view(), name='cause_admin_update'),
    # path('admin/causes/<uuid:id>/approve/', AdminCauseUpdateView.as_view(), name='cause_admin_approve'),
]