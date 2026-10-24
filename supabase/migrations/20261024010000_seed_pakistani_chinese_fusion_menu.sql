INSERT INTO public.menu_categories (id, name, sort_order)
VALUES ('11111111-1111-1111-1111-111111111106', 'Pak-Chinese Wok', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.menu_items (category_id, name, description, price, sort_order)
VALUES
  ('11111111-1111-1111-1111-111111111106', 'Lahori Chicken Chow Mein', 'Wok-tossed noodles, chicken, crisp vegetables, green chilli and a touch of desi masala.', 1250, 1),
  ('11111111-1111-1111-1111-111111111106', 'Sichuan Chicken Tikka', 'Charcoal tikka finished in a numbing Sichuan pepper and chilli glaze.', 1550, 2),
  ('11111111-1111-1111-1111-111111111106', 'Chapli Beef Wok', 'Smash-seared chapli kebab, black bean, ginger and peppers from the wok.', 1690, 3),
  ('11111111-1111-1111-1111-111111111106', 'Karahi Masala Fried Rice', 'Wok-fired basmati with tomato karahi masala, egg, spring onion and green chilli.', 1190, 4),
  ('11111111-1111-1111-1111-111111111106', 'Lahori Chilli-Garlic Prawns', 'Crisp prawns tossed with garlic, soy, crushed red chilli and fresh coriander.', 1850, 5),
  ('11111111-1111-1111-1111-111111111106', 'Honey-Chilli Roghni Bites', 'Tandoor-baked roghni naan bites, wok-glazed with honey, sesame and chilli.', 590, 6);
