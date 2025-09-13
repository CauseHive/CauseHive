#!/usr/bin/env python3
"""
Generate a Django SECRET_KEY for production use.
Run this script to get a secure secret key for Railway deployment.
"""

import secrets
import string

def generate_django_secret_key():
    """Generate a secure Django SECRET_KEY."""
    chars = string.ascii_letters + string.digits + '!@#$%^&*(-_=+)'
    return ''.join(secrets.choice(chars) for _ in range(50))

if __name__ == "__main__":
    secret_key = generate_django_secret_key()
    print("Generated Django SECRET_KEY:")
    print(secret_key)
    print("\nCopy this key to your Railway environment variables as SECRET_KEY")
