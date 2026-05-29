import jwt
from flask import current_app
from datetime import datetime, timedelta

def create_token(role, user_id):
    """创建 JWT Token"""
    payload = {
        'role': role,
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')


def decode_token(token):
    """解析 JWT Token"""
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None