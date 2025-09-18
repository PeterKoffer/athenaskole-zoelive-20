-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('student', 'parent', 'teacher', 'staff', 'leader');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create class memberships table
CREATE TABLE public.class_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    class_id TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, class_id)
);

-- Create calendars table
CREATE TABLE public.calendars (
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
CREATE TABLE public.calendar_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
    share_type TEXT NOT NULL CHECK (share_type IN ('user', 'class', 'role')),
    share_target TEXT NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (calendar_id, share_type, share_target)
);

-- Create events table
CREATE TABLE public.events (
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
CREATE TABLE public.event_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    share_type TEXT NOT NULL CHECK (share_type IN ('user', 'class', 'role')),
    share_target TEXT NOT NULL,
    permission TEXT NOT NULL CHECK (permission IN ('view', 'edit')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (event_id, share_type, share_target)
);

-- Create calendar subscriptions table
CREATE TABLE public.calendar_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, calendar_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Users can view calendars they have access to"
ON public.calendars FOR SELECT
TO authenticated
USING (public.can_view_calendar(auth.uid(), id));

CREATE POLICY "Users can create their own calendars"
ON public.calendars FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update calendars they can edit"
ON public.calendars FOR UPDATE
TO authenticated
USING (public.can_edit_calendar(auth.uid(), id));

CREATE POLICY "Users can delete their own calendars"
ON public.calendars FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- RLS Policies for calendar_shares
CREATE POLICY "Calendar owners can manage shares"
ON public.calendar_shares FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.calendars WHERE id = calendar_id AND owner_id = auth.uid()));

-- RLS Policies for events
CREATE POLICY "Users can view events from accessible calendars"
ON public.events FOR SELECT
TO authenticated
USING (public.can_view_calendar(auth.uid(), calendar_id));

CREATE POLICY "Users can create events in editable calendars"
ON public.events FOR INSERT
TO authenticated
WITH CHECK (public.can_edit_calendar(auth.uid(), calendar_id) AND created_by = auth.uid());

CREATE POLICY "Users can update events in editable calendars"
ON public.events FOR UPDATE
TO authenticated
USING (public.can_edit_calendar(auth.uid(), calendar_id));

CREATE POLICY "Users can delete events they created in editable calendars"
ON public.events FOR DELETE
TO authenticated
USING (public.can_edit_calendar(auth.uid(), calendar_id) AND created_by = auth.uid());

-- RLS Policies for event_shares
CREATE POLICY "Event creators can manage event shares"
ON public.event_shares FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.events WHERE id = event_id AND created_by = auth.uid()));

-- RLS Policies for calendar_subscriptions
CREATE POLICY "Users can manage their own subscriptions"
ON public.calendar_subscriptions FOR ALL
TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'leader'));

-- RLS Policies for class_memberships
CREATE POLICY "Users can view class memberships"
ON public.class_memberships FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Teachers and staff can manage class memberships"
ON public.class_memberships FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher') OR 
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'leader')
);

-- Add updated_at triggers
CREATE TRIGGER update_calendars_updated_at
  BEFORE UPDATE ON public.calendars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();