"""Add inverter telemetry

Revision ID: 21ed086d2253
Revises: e6d75bd98faa
Create Date: 2026-08-24

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "21ed086d2253"
down_revision: Union[str, Sequence[str], None] = "e6d75bd98faa"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the inverter telemetry table."""

    op.create_table(
        "inverter_telemetry",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("inverter_id", sa.String(), nullable=False),
        sa.Column("dc_voltage_v", sa.Float(), nullable=True),
        sa.Column("dc_current_a", sa.Float(), nullable=True),
        sa.Column("dc_power_kw", sa.Float(), nullable=True),
        sa.Column("ac_power_kw", sa.Float(), nullable=True),
        sa.Column("efficiency_percent", sa.Float(), nullable=True),
        sa.Column("temperature_c", sa.Float(), nullable=True),
        sa.Column("grid_frequency_hz", sa.Float(), nullable=True),
        sa.Column("power_factor", sa.Float(), nullable=True),
        sa.Column("mppt1_voltage_v", sa.Float(), nullable=True),
        sa.Column("mppt1_current_a", sa.Float(), nullable=True),
        sa.Column("mppt1_power_kw", sa.Float(), nullable=True),
        sa.Column("mppt2_voltage_v", sa.Float(), nullable=True),
        sa.Column("mppt2_current_a", sa.Float(), nullable=True),
        sa.Column("mppt2_power_kw", sa.Float(), nullable=True),
        sa.Column(
            "timestamp",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_inverter_telemetry_inverter_id",
        "inverter_telemetry",
        ["inverter_id"],
        unique=False,
    )

    op.create_index(
        "ix_inverter_telemetry_timestamp",
        "inverter_telemetry",
        ["timestamp"],
        unique=False,
    )


def downgrade() -> None:
    """Remove the inverter telemetry table."""

    op.drop_index(
        "ix_inverter_telemetry_timestamp",
        table_name="inverter_telemetry",
    )

    op.drop_index(
        "ix_inverter_telemetry_inverter_id",
        table_name="inverter_telemetry",
    )

    op.drop_table("inverter_telemetry")