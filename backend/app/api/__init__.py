from flask import Blueprint

# 导入所有蓝图
from app.api.auth import bp as auth_bp
from app.api.user import bp as user_bp
from app.api.activities import bp as activities_bp
from app.api.admin_activities import bp as admin_activities_bp
from app.api.admin_users import bp as admin_users_bp
from app.api.registrations import bp as registrations_bp
from app.api.checkin import bp as checkin_bp
from app.api.notifications import bp as notifications_bp
from app.api.statistics import bp as statistics_bp
from app.api.categories import bp as categories_bp
from app.api.health import bp as health_bp

# 统一导出
__all__ = [
    'auth_bp',
    'user_bp',
    'activities_bp',
    'admin_activities_bp',
    'admin_users_bp',
    'registrations_bp',
    'checkin_bp',
    'notifications_bp',
    'statistics_bp',
    'categories_bp',
    'health_bp',
]