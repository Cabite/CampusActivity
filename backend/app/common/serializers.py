from datetime import datetime

def dt(value):
    """格式化日期时间"""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value.strftime('%Y-%m-%d %H:%M:%S')
    return str(value)
