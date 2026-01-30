import hmac
import hashlib
import base64
import os

SECRET = os.environ["SECRET_KEY"].encode()

def generate_hmac_token(client_id: str) -> str:
    msg = client_id.encode()

    sig = hmac.new(
        SECRET,
        msg,
        hashlib.sha256
    ).hexdigest()

    token = base64.urlsafe_b64encode(msg).decode() + "." + sig
    return token

def validate_hmac_token(token: str) -> str:
    try:
        raw, sig = token.split(".")
        msg = base64.urlsafe_b64decode(raw)

        expected_sig = hmac.new(
            SECRET,
            msg,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(sig, expected_sig):
            raise ValueError

        client_id = msg.decode()
        return client_id

    except Exception:
        raise ValueError("Invalid token")
