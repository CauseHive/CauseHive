from django.urls import path
from . import views

app_name = 'testimonials'

urlpatterns = [
    # Public testimonials endpoints
    path('cause/<int:cause_id>/', 
         views.CauseTestimonialsListView.as_view(), 
         name='cause-testimonials-list'),
    
    path('cause/<int:cause_id>/stats/', 
         views.cause_testimonials_stats, 
         name='cause-testimonials-stats'),
    
    # User testimonials endpoints
    path('create/', 
         views.TestimonialCreateView.as_view(), 
         name='testimonial-create'),
    
    path('<int:pk>/update/', 
         views.TestimonialUpdateView.as_view(), 
         name='testimonial-update'),
    
    path('<int:pk>/delete/', 
         views.TestimonialDeleteView.as_view(), 
         name='testimonial-delete'),
    
    path('<int:testimonial_id>/like/', 
         views.toggle_testimonial_like, 
         name='testimonial-like'),
    
    path('user/<int:user_id>/', 
         views.UserTestimonialsListView.as_view(), 
         name='user-testimonials-list'),
    
    path('user/', 
         views.UserTestimonialsListView.as_view(), 
         name='current-user-testimonials-list'),
    
    # Reporting endpoints
    path('report/', 
         views.TestimonialReportCreateView.as_view(), 
         name='testimonial-report'),
    
    # Admin/Moderation endpoints
    path('admin/list/', 
         views.TestimonialModerationListView.as_view(), 
         name='admin-testimonials-list'),
    
    path('admin/<int:pk>/update/', 
         views.TestimonialModerationUpdateView.as_view(), 
         name='admin-testimonial-update'),
    
    path('admin/reports/', 
         views.TestimonialReportsListView.as_view(), 
         name='admin-testimonial-reports'),
]