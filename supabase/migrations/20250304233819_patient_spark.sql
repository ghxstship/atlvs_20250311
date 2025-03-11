-- Create maritime certifications table
CREATE TABLE IF NOT EXISTS maritime_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issuing_authority text NOT NULL,
  certification_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crew certifications table
CREATE TABLE IF NOT EXISTS crew_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id uuid NOT NULL,
  certification_id uuid REFERENCES maritime_certifications(id),
  certificate_number text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date NOT NULL,
  status text NOT NULL,
  document_url text,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work rest hours table
CREATE TABLE IF NOT EXISTS work_rest_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id uuid NOT NULL,
  date date NOT NULL,
  work_start time NOT NULL,
  work_end time NOT NULL,
  rest_periods jsonb,
  total_work_hours numeric(4,2) NOT NULL,
  total_rest_hours numeric(4,2) NOT NULL,
  compliant boolean NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_hours CHECK (total_work_hours + total_rest_hours <= 24)
);

-- Create emergency roles table
CREATE TABLE IF NOT EXISTS emergency_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id uuid NOT NULL,
  role_name text NOT NULL,
  muster_station text NOT NULL,
  primary_duty text NOT NULL,
  secondary_duty text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE maritime_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_rest_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Maritime certifications are viewable by authenticated users"
  ON maritime_certifications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Crew certifications are viewable by crew members and admins"
  ON crew_certifications FOR SELECT
  TO authenticated
  USING (
    auth.uid() = crew_member_id OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = auth.uid()
      AND team_members.role = 'admin'
    )
  );

CREATE POLICY "Work rest hours are viewable by crew members and supervisors"
  ON work_rest_hours FOR SELECT
  TO authenticated
  USING (
    auth.uid() = crew_member_id OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.user_id = auth.uid()
      AND team_members.role IN ('admin', 'supervisor')
    )
  );

CREATE POLICY "Emergency roles are viewable by all authenticated users"
  ON emergency_roles FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_crew_certifications_member_id ON crew_certifications(crew_member_id);
CREATE INDEX idx_crew_certifications_expiry ON crew_certifications(expiry_date);
CREATE INDEX idx_work_rest_hours_member_date ON work_rest_hours(crew_member_id, date);
CREATE INDEX idx_emergency_roles_member ON emergency_roles(crew_member_id);

-- Create functions for compliance checks
CREATE OR REPLACE FUNCTION check_certification_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.expiry_date <= CURRENT_DATE + interval '30 days' THEN
    PERFORM pg_notify(
      'certification_expiring',
      json_build_object(
        'crew_member_id', NEW.crew_member_id,
        'certification_id', NEW.certification_id,
        'expiry_date', NEW.expiry_date
      )::text
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION check_work_rest_compliance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check minimum rest period compliance (10 hours in any 24-hour period)
  IF NEW.total_rest_hours < 10 THEN
    NEW.compliant = false;
  -- Check maximum work period compliance (14 hours in any 24-hour period)
  ELSIF NEW.total_work_hours > 14 THEN
    NEW.compliant = false;
  ELSE
    NEW.compliant = true;
  END IF;

  -- Notify if non-compliant
  IF NOT NEW.compliant THEN
    PERFORM pg_notify(
      'work_rest_violation',
      json_build_object(
        'crew_member_id', NEW.crew_member_id,
        'date', NEW.date,
        'total_rest_hours', NEW.total_rest_hours,
        'total_work_hours', NEW.total_work_hours
      )::text
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER check_certification_expiry_trigger
  BEFORE INSERT OR UPDATE ON crew_certifications
  FOR EACH ROW
  EXECUTE FUNCTION check_certification_expiry();

CREATE TRIGGER check_work_rest_compliance_trigger
  BEFORE INSERT OR UPDATE ON work_rest_hours
  FOR EACH ROW
  EXECUTE FUNCTION check_work_rest_compliance();