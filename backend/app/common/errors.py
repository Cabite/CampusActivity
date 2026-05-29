from flask import jsonify
class BusinessError(Exception):
    """业务异常"""

    def __init__(self, message, code=400, status_code=None):
        self.message = message
        self.code = code
        self.status_code = status_code or code

    def to_response(self):
        return jsonify({
            'code': self.code,
            'message': self.message,
            'data': None
        }), self.status_code


def register_error_handlers(app):
    """注册全局错误处理"""
    @app.errorhandler(BusinessError)
    def handle_business_error(e):
        return e.to_response()

    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({'code': 404, 'message': '资源不存在', 'data': None}), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({'code': 500, 'message': '服务器内部错误', 'data': None}), 500
