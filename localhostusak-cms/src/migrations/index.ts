import * as migration_20260920_011155_initial_schema from './20260920_011155_initial_schema';
import * as migration_20260920_034150_add_reset_password_requested_at from './20260920_034150_add_reset_password_requested_at';
import * as migration_20260928_192652_reconcile_schema_drift from './20260928_192652_reconcile_schema_drift';
import * as migration_20260928_200754_add_team_members from './20260928_200754_add_team_members';
import * as migration_20260929_074024_add_event_status_open_closed_and_recap_url from './20260929_074024_add_event_status_open_closed_and_recap_url';
import * as migration_20260930_092130_add_project_status_difficulty_and_contributing_url from './20260930_092130_add_project_status_difficulty_and_contributing_url';
import * as migration_20261005_163346_kariyer_cv_havuzu from './20261005_163346_kariyer_cv_havuzu';

export const migrations = [
  {
    up: migration_20260920_011155_initial_schema.up,
    down: migration_20260920_011155_initial_schema.down,
    name: '20260920_011155_initial_schema',
  },
  {
    up: migration_20260920_034150_add_reset_password_requested_at.up,
    down: migration_20260920_034150_add_reset_password_requested_at.down,
    name: '20260920_034150_add_reset_password_requested_at',
  },
  {
    up: migration_20260928_192652_reconcile_schema_drift.up,
    down: migration_20260928_192652_reconcile_schema_drift.down,
    name: '20260928_192652_reconcile_schema_drift',
  },
  {
    up: migration_20260928_200754_add_team_members.up,
    down: migration_20260928_200754_add_team_members.down,
    name: '20260928_200754_add_team_members',
  },
  {
    up: migration_20260929_074024_add_event_status_open_closed_and_recap_url.up,
    down: migration_20260929_074024_add_event_status_open_closed_and_recap_url.down,
    name: '20260929_074024_add_event_status_open_closed_and_recap_url',
  },
  {
    up: migration_20260930_092130_add_project_status_difficulty_and_contributing_url.up,
    down: migration_20260930_092130_add_project_status_difficulty_and_contributing_url.down,
    name: '20260930_092130_add_project_status_difficulty_and_contributing_url',
  },
  {
    up: migration_20261005_163346_kariyer_cv_havuzu.up,
    down: migration_20261005_163346_kariyer_cv_havuzu.down,
    name: '20261005_163346_kariyer_cv_havuzu'
  },
];
