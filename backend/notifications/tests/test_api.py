from django.contrib.auth import get_user_model
from django.db.models import Q
from django.test.utils import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from notifications.models import AdminNotification


TEST_DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}


@override_settings(DATABASES=TEST_DATABASES)
class NotificationAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="user@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )
        self.other_user = get_user_model().objects.create_user(
            email="other@example.com",
            password="testpass123",
            first_name="Other",
            last_name="User",
        )
        self.client.force_authenticate(user=self.user)
        AdminNotification.objects.all().delete()

    def test_list_notifications_returns_only_relevant_entries(self):
        user_notification = AdminNotification.objects.create(
            title="Assigned",
            message="Assigned notification",
            notification_type="system_alert",
            user=self.user,
        )
        global_notification = AdminNotification.objects.create(
            title="Global",
            message="Global notification",
            notification_type="system_alert",
        )
        other_notification = AdminNotification.objects.create(
            title="Other",
            message="Other notification",
            notification_type="system_alert",
            user=self.other_user,
        )

        url = reverse("notifications:notification-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        returned_ids = [item["id"] for item in response.data["results"]]
        self.assertIn(user_notification.id, returned_ids)
        self.assertIn(global_notification.id, returned_ids)
        self.assertNotIn(other_notification.id, returned_ids)

    def test_mark_notification_as_read(self):
        notification = AdminNotification.objects.create(
            title="Assigned",
            message="Assigned notification",
            notification_type="system_alert",
            user=self.user,
        )
        url = reverse("notifications:notification-mark-read", args=[notification.id])

        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)
        self.assertIn("notification", response.data)
        self.assertTrue(response.data["notification"]["is_read"])

    def test_mark_all_notifications_as_read(self):
        AdminNotification.objects.create(
            title="Assigned",
            message="Assigned notification",
            notification_type="system_alert",
            user=self.user,
        )
        AdminNotification.objects.create(
            title="Global",
            message="Global notification",
            notification_type="system_alert",
        )
        url = reverse("notifications:notification-mark-all-read")

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        targeted_notifications = AdminNotification.objects.filter(
            Q(user=self.user) | Q(user__isnull=True)
        )
        self.assertEqual(targeted_notifications.count(), 2)
        self.assertEqual(targeted_notifications.filter(is_read=True).count(), 2)
        self.assertEqual(response.data["updated_count"], 2)
