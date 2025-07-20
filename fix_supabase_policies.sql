-- ========================================
-- CORREÇÃO DAS POLÍTICAS RLS DO SUPABASE
-- ========================================
-- Execute este arquivo no SQL Editor do Supabase

-- 1. Desabilitar RLS temporariamente para permitir acesso
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages DISABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Allow anonymous read access to users" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous read access to services" ON public.services;
DROP POLICY IF EXISTS "Allow anonymous read access to clients" ON public.clients;
DROP POLICY IF EXISTS "Allow anonymous insert access to clients" ON public.clients;
DROP POLICY IF EXISTS "Allow anonymous insert access to whatsapp_messages" ON public.whatsapp_messages;

-- 3. Criar políticas mais permissivas
CREATE POLICY "Enable read access for all users" ON public.users
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.services
FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.clients
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.clients
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert access for all users" ON public.whatsapp_messages
FOR INSERT WITH CHECK (true);

-- 4. Reabilitar RLS com as novas políticas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- 5. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('users', 'services', 'clients', 'whatsapp_messages'); 