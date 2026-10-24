CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL CHECK (char_length(customer_name) BETWEEN 1 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 30),
  visit_date date NOT NULL,
  visit_time time NOT NULL,
  party_size integer NOT NULL CHECK (party_size BETWEEN 1 AND 12),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.reservations TO anon, authenticated;
GRANT SELECT, UPDATE ON public.reservations TO authenticated;

CREATE POLICY "public can request reservations"
  ON public.reservations FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE POLICY "staff can read reservations"
  ON public.reservations FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()));

CREATE POLICY "staff can update reservations"
  ON public.reservations FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()))
  WITH CHECK (private.is_staff(auth.uid()));
