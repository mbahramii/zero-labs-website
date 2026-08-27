"""add scheduled_at to content_jobs

Revision ID: 8533d402c523
Revises: 7d7c7d94236c
Create Date: 2026-08-27 19:12:40.566452

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8533d402c523'
down_revision: Union[str, Sequence[str], None] = '56fa468ddc93'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'content_jobs',
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('content_jobs', 'scheduled_at')
