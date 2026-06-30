from nexios_contrib.mail import setup_mail as _setup_mail, MailConfig
from nexios import NexiosApp
import os

_mail_client = None


def setup_mail(app: NexiosApp):
    global _mail_client

    _mail_client = _setup_mail(
        app,
        config=MailConfig(
            smtp_host=os.getenv("SMTP_HOST", "smtp.gmail.com"),
            smtp_port=int(os.getenv("SMTP_PORT", "587")),
            smtp_username=os.getenv("SMTP_USERNAME", ""),
            smtp_password=os.getenv("SMTP_PASSWORD", ""),
            use_tls=os.getenv("SMTP_USE_TLS", "true").lower() == "true",
            default_from=os.getenv("MAIL_FROM", "noreply@brodcasta.com"),
        ),
    )

    return _mail_client


def get_mail_client():
    if _mail_client is None:
        raise RuntimeError("Mail client has not been initialized. Call setup_mail() first.")

    return _mail_client