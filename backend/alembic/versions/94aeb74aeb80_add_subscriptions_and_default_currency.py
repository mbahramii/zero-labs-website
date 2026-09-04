"""add subscriptions and default_currency

Revision ID: 94aeb74aeb80
Revises: 8533d402c523
Create Date: 2026-08-29 05:13:58.776991

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = '94aeb74aeb80'
down_revision: Union[str, Sequence[str], None] = '8533d402c523'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1) Create plans table (idempotent)
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = inspector.get_table_names()

    if "plans" not in existing_tables:
        op.create_table(
            "plans",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(length=100), nullable=False),
            sa.Column("slug", sa.String(length=50), nullable=False),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("prices", JSONB(), nullable=False, server_default="{}"),
            sa.Column("monthly_quota", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("features", JSONB(), nullable=False, server_default="{}"),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.text("now()"),
            ),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("name"),
            sa.UniqueConstraint("slug"),
        )
        op.create_index(op.f("ix_plans_slug"), "plans", ["slug"], unique=False)

    # 2) Create subscriptions table (idempotent)
    if "subscriptions" not in existing_tables:
        op.create_table(
            "subscriptions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("user_id", sa.Integer(), nullable=False),
            sa.Column("plan_id", sa.Integer(), nullable=False),
            sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
            sa.Column("currency", sa.String(length=3), nullable=False, server_default="IRR"),
            sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("auto_renew", sa.Boolean(), nullable=False, server_default=sa.text("true")),
            sa.Column("payment_method", sa.String(length=50), nullable=True),
            sa.Column("external_id", sa.String(length=200), nullable=True),
            sa.Column(
                "created_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.text("now()"),
            ),
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.text("now()"),
            ),
            sa.PrimaryKeyConstraint("id"),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["plan_id"], ["plans.id"], ondelete="RESTRICT"),
        )
        op.create_index(op.f("ix_subscriptions_user_id"), "subscriptions", ["user_id"], unique=False)
        op.create_index(op.f("ix_subscriptions_plan_id"), "subscriptions", ["plan_id"], unique=False)

    # 3) Add default_currency to users (idempotent: skip if exists)
    existing_cols = [c["name"] for c in inspector.get_columns("users")]
    if "default_currency" not in existing_cols:
        op.add_column(
            "users",
            sa.Column("default_currency", sa.String(length=3), nullable=True),
        )


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_cols = [c["name"] for c in inspector.get_columns("users")]
    if "default_currency" in existing_cols:
        op.drop_column("users", "default_currency")

    existing_tables = inspector.get_table_names()
    if "subscriptions" in existing_tables:
        op.drop_index(op.f("ix_subscriptions_plan_id"), table_name="subscriptions")
        op.drop_index(op.f("ix_subscriptions_user_id"), table_name="subscriptions")
        op.drop_table("subscriptions")

    if "plans" in existing_tables:
        op.drop_index(op.f("ix_plans_slug"), table_name="plans")
        op.drop_table("plans")