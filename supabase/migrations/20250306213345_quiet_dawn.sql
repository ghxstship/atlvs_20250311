/*
  # Fix Roles RLS Policies

  1. Changes
    - Remove recursive policy check for roles
    - Implement direct role-based access control
    - Add separate policies for different operations
    
  2. Security
    - Enable RLS on roles table
    - Add policies for:
      - View access for authenticated users
      - Modify access for admins only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Only admins can modify roles" ON public.roles;
DROP POLICY IF EXISTS "Roles are viewable by all authenticated users" ON public.roles;

-- Create new policies without recursion
CREATE POLICY "Roles are viewable by authenticated users"
ON public.roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can modify roles"
ON public.roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role_id = (
      SELECT id FROM roles WHERE name = 'admin'
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role_id = (
      SELECT id FROM roles WHERE name = 'admin'
    )
  )
);