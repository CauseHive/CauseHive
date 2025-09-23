from .views import (
    add_to_cart,
    update_cart_item,
    checkout,
    get_cart,
    remove_from_cart,
    delete_cart,
    donate,
)
from django.urls import path

urlpatterns = [
    path('', get_cart, name='get_cart'),
    path('add/', add_to_cart, name='add_to_cart'),
    path('update/<uuid:item_id>/', update_cart_item, name='update_cart_item'),
    path('remove/<uuid:item_id>/', remove_from_cart, name='remove_from_cart'),
    path('delete/', delete_cart, name='delete_cart'),
    # Compatibility aliases
    path('<uuid:item_id>/', update_cart_item, name='cart_item_update_patch_delete'),  # PATCH will update, DELETE handled below
    path('clear/', delete_cart, name='cart_clear'),
    path('checkout/', checkout, name='checkout'),
    path('donate/', donate, name='donate'),
]