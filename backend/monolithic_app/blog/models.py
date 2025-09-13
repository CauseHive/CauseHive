from django.db import models

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.TextField(max_length=500, blank=True)
    content = models.TextField()
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    text = models.TextField()
    avatar = models.URLField(blank=True, null=True)
    position = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.position}"


class Contributor(models.Model):
    name = models.CharField(max_length=100)
    avatar = models.URLField(blank=True, null=True)
    contributions = models.IntegerField(default=0)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-contributions']

    def __str__(self):
        return self.name


class SiteStatistics(models.Model):
    total_donations = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_causes = models.IntegerField(default=0)
    total_donors = models.IntegerField(default=0)
    impact_score = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Site Statistics"

    def __str__(self):
        return f"Statistics as of {self.last_updated}"
