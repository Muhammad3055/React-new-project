from django.apps import AppConfig
from django.db.models.signals import post_migrate


def create_default_superuser(sender, **kwargs):
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            print("Auto-initialized default superuser: admin / admin123")
    except Exception:
        pass


class CoreConfig(AppConfig):
    name = 'core'

    def ready(self):
        post_migrate.connect(create_default_superuser, sender=self)

