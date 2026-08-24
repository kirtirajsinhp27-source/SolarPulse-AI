"""Add inverter table

Revision ID: e6d75bd98faa
Revises: 9038fee7279a
Create Date: 2026-08-24

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e6d75bd98faa"
down_revision: Union[str, Sequence[str], None] = "9038fee7279a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the inverter table."""
    op.create_table(
        "inverters",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("inverter_id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("manufacturer", sa.String(), nullable=False),
        sa.Column("model", sa.String(), nullable=False),
        sa.Column("rated_capacity_kw", sa.Float(), nullable=False),
        sa.Column("connection_type", sa.String(), nullable=False),
        sa.Column("host", sa.String(), nullable=True),
        sa.Column("port", sa.String(), nullable=True),
        sa.Column("unit_id", sa.String(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("inverter_id"),
    )


def downgrade() -> None:
    """Remove the inverter table."""
    op.drop_table("inverters")