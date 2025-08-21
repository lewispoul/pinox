from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_create_runs_table'
down_revision = '0001_create_jobs_table'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'runs',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('job_id', sa.Integer, sa.ForeignKey('jobs.id'), nullable=False),
        sa.Column('status', sa.String, nullable=False),
        sa.Column('log', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('runs')
