"""Add analytics model

Revision ID: 2_20260219170000_analytics
Revises: 1_20260124223112_update
Create Date: 2026-02-19 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '2_20260219170000_analytics'
down_revision = '1_20260124223112_update'
branch_labels = None
depends_on = None


def upgrade():
    # Create project_analytics table
    op.create_table('project_analytics',
        sa.Column('id', sa.String(length=26), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('deleted_at', sa.DateTime(), nullable=True),
        sa.Column('project_id', sa.String(length=26), nullable=False),
        sa.Column('event_type', sa.Enum('message_sent', 'message_received', 'broadcast_sent', 'broadcast_received', 'direct_sent', 'direct_received', 'client_connected', 'client_disconnected', 'room_joined', 'room_left', name='eventtype'), nullable=False),
        sa.Column('connection_type', sa.Enum('websocket', 'sse', name='connectiontype'), nullable=True),
        sa.Column('room_id', sa.String(length=255), nullable=True),
        sa.Column('client_id', sa.String(length=255), nullable=True),
        sa.Column('message_size', sa.Integer(), nullable=True),
        sa.Column('event_data', sa.JSON(), nullable=True),
        sa.Column('event_date', sa.Date(), nullable=True),
        sa.Column('event_hour', sa.Integer(), nullable=True),
        sa.Column('event_day_of_week', sa.Integer(), nullable=True),
        sa.Column('event_week', sa.Integer(), nullable=True),
        sa.Column('event_month', sa.Integer(), nullable=True),
        sa.Column('event_year', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_project_analytics_event_date'), 'project_analytics', ['event_date'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_day_of_week'), 'project_analytics', ['event_day_of_week'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_hour'), 'project_analytics', ['event_hour'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_type'), 'project_analytics', ['project_id', 'event_type'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_date_1'), 'project_analytics', ['event_date', 'event_type'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_date_2'), 'project_analytics', ['project_id', 'event_date'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_date_3'), 'project_analytics', ['project_id', 'event_date', 'event_hour'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_month'), 'project_analytics', ['project_id', 'event_month', 'event_year'], unique=False)
    op.create_index(op.f('ix_project_analytics_event_week'), 'project_analytics', ['project_id', 'event_week'], unique=False)
    op.create_index(op.f('ix_project_analytics_project_id'), 'project_analytics', ['project_id', 'created_at'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_project_analytics_project_id'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_week'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_month'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_date_3'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_date_2'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_date_1'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_type'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_hour'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_day_of_week'), table_name='project_analytics')
    op.drop_index(op.f('ix_project_analytics_event_date'), table_name='project_analytics')
    op.drop_table('project_analytics')
