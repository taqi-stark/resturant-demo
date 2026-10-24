CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION private.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated;

DROP POLICY "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

DROP POLICY "admins manage categories" ON public.menu_categories;
CREATE POLICY "admins manage categories" ON public.menu_categories FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

DROP POLICY "admins manage items" ON public.menu_items;
CREATE POLICY "admins manage items" ON public.menu_items FOR ALL TO authenticated
  USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

DROP POLICY "staff read orders" ON public.orders;
DROP POLICY "staff create orders" ON public.orders;
DROP POLICY "staff update orders" ON public.orders;
DROP POLICY "admins delete orders" ON public.orders;
CREATE POLICY "staff read orders" ON public.orders FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "staff create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "staff update orders" ON public.orders FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "admins delete orders" ON public.orders FOR DELETE TO authenticated USING (private.has_role(auth.uid(),'admin'));

DROP POLICY "staff read order items" ON public.order_items;
DROP POLICY "staff write order items" ON public.order_items;
DROP POLICY "staff modify order items" ON public.order_items;
DROP POLICY "staff delete order items" ON public.order_items;
CREATE POLICY "staff read order items" ON public.order_items FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "staff write order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "staff modify order items" ON public.order_items FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "staff delete order items" ON public.order_items FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

DROP FUNCTION public.has_role(uuid, public.app_role);
DROP FUNCTION public.is_staff(uuid);