from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "ALTER TABLE users_user ADD COLUMN IF NOT EXISTS name varchar(150);"
                "UPDATE users_user SET name = '' WHERE name IS NULL;"
                "ALTER TABLE users_user ALTER COLUMN name SET NOT NULL;"
            ),
            reverse_sql="ALTER TABLE users_user DROP COLUMN IF EXISTS name;",
        ),
    ]