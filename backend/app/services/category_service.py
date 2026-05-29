from app.common.database import db_session
from models import Category
class CategoryService:
    """分类服务"""

    @staticmethod
    def get_category_tree():
        """获取分类树形结构"""
        with db_session() as session:
            categories = session.query(Category).order_by(Category.sort_order).all()

            # 构建树形结构
            category_map = {c.id: {'id': c.id, 'name': c.name, 'level': c.level, 'sort_order': c.sort_order, 'children': []} for c in categories}
            tree = []

            for c in categories:
                node = category_map[c.id]
                if c.parent_id == 0:
                    tree.append(node)
                else:
                    parent = category_map.get(c.parent_id)
                    if parent:
                        parent['children'].append(node)

            return tree