from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_create_jobs_table'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('name', sa.String, nullable=False),
        sa.Column('status', sa.Enum('queued', 'running', 'succeeded', 'failed', name='jobstatus'), nullable=False, default='queued'),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now(), onupdate=sa.func.now())
    )

def downgrade():
    op.drop_table('jobs')
