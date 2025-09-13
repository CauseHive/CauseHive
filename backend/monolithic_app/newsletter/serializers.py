from rest_framework import serializers
from .models import NewsletterSubscription


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['email']
        
    def create(self, validated_data):
        # Create or update subscription
        email = validated_data['email']
        subscription, created = NewsletterSubscription.objects.get_or_create(
            email=email,
            defaults={'is_active': True}
        )
        if not created:
            # Reactivate if previously unsubscribed
            subscription.is_active = True
            subscription.save()
        return subscription
