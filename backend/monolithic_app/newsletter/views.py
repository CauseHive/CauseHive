from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import NewsletterSubscription
from .serializers import NewsletterSubscriptionSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def subscribe_newsletter(request):
    """
    Subscribe to newsletter
    """
    serializer = NewsletterSubscriptionSerializer(data=request.data)
    if serializer.is_valid():
        try:
            subscription = serializer.save()
            return Response(
                {'message': 'Successfully subscribed to newsletter', 'email': subscription.email},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to subscribe to newsletter'},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def unsubscribe_newsletter(request):
    """
    Unsubscribe from newsletter
    """
    email = request.data.get('email')
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        subscription = NewsletterSubscription.objects.get(email=email)
        subscription.is_active = False
        subscription.save()
        return Response(
            {'message': 'Successfully unsubscribed from newsletter'},
            status=status.HTTP_200_OK
        )
    except NewsletterSubscription.DoesNotExist:
        return Response(
            {'error': 'Email not found in subscription list'},
            status=status.HTTP_404_NOT_FOUND
        )
