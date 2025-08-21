from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0003_create_artifacts_table'
down_revision = '0002_create_runs_table'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'artifacts',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('run_id', sa.Integer, sa.ForeignKey('runs.id'), nullable=False),
        sa.Column('path', sa.String, nullable=False),
        sa.Column('type', sa.String, nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now())
    )

def downgrade():
    op.drop_table('artifacts')
