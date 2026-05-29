from functools import wraps
from flask import request, g
from app.common.auth import decode_token
from app.common.errors import BusinessError


def get_json_data():
    """获取并验证请求JSON数据"""
    data = request.get_json(silent=True) or {}
    if not data:
        raise BusinessError('请求体不能为空', code=400)
    return data


def get_current_user():
    """从Token获取当前用户信息"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, None

    token = auth_header.replace('Bearer ', '', 1).strip()
    payload = decode_token(token)
    if not payload:
        return None, None

    return payload.get('role'), payload.get('user_id')


def require_auth():
    """要求登录的装饰器"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            role, user_id = get_current_user()
            if not role or not user_id:
                raise BusinessError('未登录或token失效', code=401, status_code=401)
            g.current_role = role
            g.current_user_id = user_id
            return f(*args, **kwargs)
        return wrapper
    return decorator


def require_role(*allowed_roles):
    """要求特定角色的装饰器"""
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            role = getattr(g, 'current_role', None)
            if not role:
                raise BusinessError('未登录', code=401, status_code=401)
            if role not in allowed_roles:
                raise BusinessError('权限不足', code=403, status_code=403)
            return f(*args, **kwargs)
        return wrapper
    return decorator