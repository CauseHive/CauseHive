import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    # is_organizer = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        indexes = [
            models.Index(fields=['email']),  # Critical for login performance
            models.Index(fields=['is_active']),
            models.Index(fields=['date_joined']),
            models.Index(fields=['email', 'is_active']),  # Composite index for login queries
        ]

    def __str__(self):
        return self.first_name

class UserProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', default='profile_pictures/default.jpg',blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    withdrawal_address = models.JSONField(blank=True, null=True, help_text="Stores complete withdrawal payment info.")
    withdrawal_wallet = models.CharField(max_length=50, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.first_name} {self.user.last_name}"

    def get_withdrawal_info(self):
        if not self.withdrawal_address:
            return None

        withdrawal_data = self.withdrawal_address
        payment_method = withdrawal_data.get('payment_method', 'bank_transfer')

        if payment_method == 'bank_transfer':
            return {
                'payment_method': 'bank_transfer',
                'bank_code': withdrawal_data.get('bank_code'),
                'account_number': withdrawal_data.get('account_number'),
                'account_name': withdrawal_data.get('account_name'),
            }
        elif payment_method == 'mobile_money':
            return {
                'payment_method': 'mobile_money',
                'phone_number': withdrawal_data.get('phone_number'),
                'country': withdrawal_data.get('country'),
            }
        else:
            return {
                'payment_method': 'bank_transfer',
                'bank_code': withdrawal_data.get('bank_code'),
                'account_number': withdrawal_data.get('account_number'),
                'account_name': withdrawal_data.get('account_name'),
            }

    def has_complete_withdrawal_info(self):
        if not self.withdrawal_address:
            return False

        data = self.withdrawal_address
        payment_method = data.get('payment_method')

        if payment_method == 'bank_transfer':
            required_fields = ['bank_code', 'account_number', 'account_name']
        elif payment_method == 'mobile_money':
            required_fields = ['phone_number', 'provider']
        else:
            required_fields = ['bank_code', 'account_number', 'account_name']

        return all(field in data and data[field] for field in required_fields)
