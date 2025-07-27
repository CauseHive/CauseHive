import requests
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import  Response
from rest_framework import status, permissions
from .clients.cause_client import CauseClient
from .serializers import CauseStatusUpdateSerializer

from auditlog.utils import log_admin_action

# Create your views here.
class AdminCauseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        params = request.query_params.dict()
        try:
            cause = CauseClient.get_causes(params)
            return Response({'status': 'success','data': cause})
        except requests.HTTPError as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AdminCauseStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, cause_id):
        serializer = CauseStatusUpdateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Update the cause status using the CauseClient
                result = CauseClient.update_cause(cause_id, serializer.validated_data)
                # log the admin action
                log_admin_action(
                    user=request.user,
                    entity_type='cause',
                    entity_id=cause_id,
                    action=f"status_changed_to_{serializer.validated_data.get('status', '')}",
                    reason = serializer.validated_data.get('reason', ''),
                    extra_data={"request_data": serializer.validated_data},
                )
                return Response({"success": True, "data": result})
            except requests.HTTPError as e:
                return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

