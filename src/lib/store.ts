import { supabase } from './supabase';
import { Product, Token } from '@/types';

// --- PRODUTOS ---

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
  return data || [];
}

// --- FICHAS (TOKENS) ---

// Busca as fichas compradas (Para o futuro: aqui filtraremos pelo user_id do cliente logado)
export async function getAvailableTokens(): Promise<Token[]> {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('status', 'DISPONIVEL')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar tokens:', error);
    return [];
  }

  // Mapeia o formato do banco (snake_case) para o do React (camelCase)
  return (data || []).map((item: any) => ({
    id: item.id,
    status: item.status,
    productName: item.product_name,
    productImage: item.product_image,
    createdAt: item.created_at,
  }));
}

// Gera novas fichas após "pagamento"
export async function generateTokens(product: Product, quantity: number): Promise<void> {
  const newTokens = Array.from({ length: quantity }).map(() => ({
    status: 'DISPONIVEL',
    product_name: product.name,
    product_image: product.image,
    // created_at é automático no banco
  }));

  const { error } = await supabase
    .from('tokens')
    .insert(newTokens);

  if (error) {
    console.error('Erro ao criar tokens:', error);
    throw error;
  }
}

// Valida a ficha (Usado pelo Barman)
export async function validateToken(tokenId: string): Promise<{ success: boolean; token?: Token; error?: 'CONSUMED' | 'NOT_FOUND' | 'ERROR' }> {
  // 1. Busca o token no banco
  const { data: tokenData, error: fetchError } = await supabase
    .from('tokens')
    .select('*')
    .eq('id', tokenId)
    .single();

  if (fetchError || !tokenData) {
    return { success: false, error: 'NOT_FOUND' };
  }

  // 2. Verifica se já foi usado
  if (tokenData.status === 'CONSUMIDO') {
    // Retorna o token mesmo assim para mostrarmos qual produto era
    return { 
      success: false, 
      error: 'CONSUMED', 
      token: {
        id: tokenData.id,
        status: 'CONSUMIDO',
        productName: tokenData.product_name,
        productImage: tokenData.product_image,
        createdAt: tokenData.created_at
      }
    };
  }

  // 3. Atualiza para CONSUMIDO (Queima a ficha)
  const { data: updatedData, error: updateError } = await supabase
    .from('tokens')
    .update({ status: 'CONSUMIDO' })
    .eq('id', tokenId)
    .select()
    .single();

  if (updateError || !updatedData) {
    return { success: false, error: 'ERROR' };
  }

  return { 
    success: true, 
    token: {
      id: updatedData.id,
      status: 'CONSUMIDO',
      productName: updatedData.product_name,
      productImage: updatedData.product_image,
      createdAt: updatedData.created_at
    }
  };
}