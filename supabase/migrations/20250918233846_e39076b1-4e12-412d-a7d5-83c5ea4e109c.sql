-- Create user roles enum and table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('student', 'parent', 'teacher', 'staff', 'leader');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create class memberships table
CREATE TABLE IF NOT EXISTS public.class_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    class_id TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, class_id)
);

-- Create calendars table
CREATE TABLE IF NOT EXISTS public.calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    calendar_type TEXT DEFAULT 'personal' CHECK (calendar_type IN ('personal', 'class', 'school', 'shared')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create calendar shares table
CREATE TABLE IF NOT EXISTS public.calendar_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
    share_type TEXT NOT NULL CHECK (share_type IN ('user', 'class', 'role')),
    share_target TEXT NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (calendar_id, share_type, share_target)
);

-- Create layered_events table (to avoid conflict with existing events table)
CREATE TABLE IF NOT EXISTS public.layered_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT false,
    location TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event shares table
CREATE TABLE IF NOT EXISTS public.event_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.layered_events(id) ON DELETE CASCADE NOT NULL,
    share_type TEXT NOT NULL CHECK (share_type IN ('user', 'class', 'role')),
    share_target TEXT NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (event_id, share_type, share_target)
);

-- Create calendar subscriptions table
CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, calendar_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layered_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_classes(_user_id UUID)
RETURNS TEXT[]
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(class_id)
  FROM public.class_memberships
  WHERE user_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.can_view_calendar(_user_id UUID, _calendar_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Owner can always view
    SELECT 1 FROM public.calendars WHERE id = _calendar_id AND owner_id = _user_id
  ) OR EXISTS (
    -- Check calendar shares
    SELECT 1 FROM public.calendar_shares cs
    WHERE cs.calendar_id = _calendar_id
    AND (
      (cs.share_type = 'user' AND cs.share_target = _user_id::TEXT) OR
      (cs.share_type = 'class' AND cs.share_target = ANY(public.get_user_classes(_user_id))) OR
      (cs.share_type = 'role' AND public.has_role(_user_id, cs.share_target::app_role))
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.can_edit_calendar(_user_id UUID, _calendar_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Owner can always edit
    SELECT 1 FROM public.calendars WHERE id = _calendar_id AND owner_id = _user_id
  ) OR EXISTS (
    -- Check calendar shares with edit permission
    SELECT 1 FROM public.calendar_shares cs
    WHERE cs.calendar_id = _calendar_id AND cs.permission = 'edit'
    AND (
      (cs.share_type = 'user' AND cs.share_target = _user_id::TEXT) OR
      (cs.share_type = 'class' AND cs.share_target = ANY(public.get_user_classes(_user_id))) OR
      (cs.share_type = 'role' AND public.has_role(_user_id, cs.share_target::app_role))
    )
  )
$$;

-- RLS Policies for calendars
DROP POLICY IF EXISTS "Users can view calendars they have access to" ON public.calendars;
CREATE POLICY "Users can view calendars they have access to"
ON public.calendars FOR SELECT
TO authenticated
USING (public.can_view_calendar(auth.uid(), id));

DROP POLICY IF EXISTS "Users can create their own calendars" ON public.calendars;
CREATE POLICY "Users can create their own calendars"
ON public.calendars FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can update calendars they can edit" ON public.calendars;
CREATE POLICY "Users can update calendars they can edit"
ON public.calendars FOR UPDATE
TO authenticated
USING (public.can_edit_calendar(auth.uid(), id));

DROP POLICY IF EXISTS "Users can delete their own calendars" ON public.calendars;
CREATE POLICY "Users can delete their own calendars"
ON public.calendars FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- RLS Policies for calendar_shares
DROP POLICY IF EXISTS "Calendar owners can manage shares" ON public.calendar_shares;
CREATE POLICY "Calendar owners can manage shares"
ON public.calendar_shares FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.calendars WHERE id = calendar_id AND owner_id = auth.uid()));

-- RLS Policies for layered_events
DROP POLICY IF EXISTS "Users can view events from accessible calendars" ON public.layered_events;
CREATE POLICY "Users can view events from accessible calendars"
ON public.layered_events FOR SELECT
TO authenticated
USING (public.can_view_calendar(auth.uid(), calendar_id));

DROP POLICY IF EXISTS "Users can create events in editable calendars" ON public.layered_events;
CREATE POLICY "Users can create events in editable calendars"
ON public.layered_events FOR INSERT
TO authenticated
WITH CHECK (public.can_edit_calendar(auth.uid(), calendar_id) AND created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update events in editable calendars" ON public.layered_events;
CREATE POLICY "Users can update events in editable calendars"
ON public.layered_events FOR UPDATE
TO authenticated
USING (public.can_edit_calendar(auth.uid(), calendar_id));

DROP POLICY IF EXISTS "Users can delete events they created in editable calendars" ON public.layered_events;
CREATE POLICY "Users can delete events they created in editable calendars"
ON public.layered_events FOR DELETE
TO authenticated
USING (public.can_edit_calendar(auth.uid(), calendar_id) AND created_by = auth.uid());

-- RLS Policies for event_shares
DROP POLICY IF EXISTS "Event creators can manage event shares" ON public.event_shares;
CREATE POLICY "Event creators can manage event shares"
ON public.event_shares FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.layered_events WHERE id = event_id AND created_by = auth.uid()));

-- RLS Policies for calendar_subscriptions
DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON public.calendar_subscriptions;
CREATE POLICY "Users can manage their own subscriptions"
ON public.calendar_subscriptions FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
CREATE POLICY "Users can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'leader'));

-- RLS Policies for class_memberships
DROP POLICY IF EXISTS "Users can view class memberships" ON public.class_memberships;
CREATE POLICY "Users can view class memberships"
ON public.class_memberships FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Teachers and staff can manage class memberships" ON public.class_memberships;
CREATE POLICY "Teachers and staff can manage class memberships"
ON public.class_memberships FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'leader')
);

-- Add updated_at triggers if they don't exist
DROP TRIGGER IF EXISTS update_calendars_updated_at ON public.calendars;
CREATE TRIGGER update_calendars_updated_at
  BEFORE UPDATE ON public.calendars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_layered_events_updated_at ON public.layered_events;
CREATE TRIGGER update_layered_events_updated_at
  BEFORE UPDATE ON public.layered_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();