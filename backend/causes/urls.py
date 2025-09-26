from django.urls import path
from .views import (
    CauseCreateView,
    CauseDeleteView,
    CauseListView,
    CauseDetailView,
    AdminCauseListView,
    AdminCauseUpdateView,
)

urlpatterns = [
    path('create/', CauseCreateView.as_view(), name='cause_create'),
    path('list/', CauseListView.as_view(), name='cause_list'),
    path('delete/<uuid:id>/', CauseDeleteView.as_view(), name='cause_delete'),
    path('details/<uuid:id>/', CauseDetailView.as_view(), name='cause_detail'),
    # Compatibility aliases for frontend expectations
    path('', CauseListView.as_view(), name='cause_list_root'),
    path('<uuid:id>/', CauseDetailView.as_view(), name='cause_detail_root'),
    # path('admin/causes/', AdminCauseListView.as_view(), name='cause_admin_list'),
    # path('admin/causes/<uuid:id>/update/', AdminCauseUpdateView.as_view(), name='cause_admin_update'),
    # path('admin/causes/<uuid:id>/approve/', AdminCauseUpdateView.as_view(), name='cause_admin_approve'),
]