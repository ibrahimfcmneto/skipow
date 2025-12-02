import { supabase } from '@/integrations/supabase/client';
import { Token, Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export async function getTokens(): Promise<Token[]> {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
  
  return (data || []).map(t => ({
    id: t.id,
    status: t.status as 'DISPONIVEL' | 'CONSUMIDO',
    productName: t.product_name,
    productImage: t.product_image,
    createdAt: new Date(t.created_at).getTime(),
  }));
}

export async function generateTokens(product: Product, quantity: number): Promise<Token[]> {
  const newTokens = [];
  
  for (let i = 0; i < quantity; i++) {
    newTokens.push({
      status: 'DISPONIVEL',
      product_name: product.name,
      product_image: product.image,
    });
  }

  const { data, error } = await supabase
    .from('tokens')
    .insert(newTokens)
    .select();

  if (error) {
    console.error('Error generating tokens:', error);
    return [];
  }

  return (data || []).map(t => ({
    id: t.id,
    status: t.status as 'DISPONIVEL' | 'CONSUMIDO',
    productName: t.product_name,
    productImage: t.product_image,
    createdAt: new Date(t.created_at).getTime(),
  }));
}

export async function getAvailableTokens(): Promise<Token[]> {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('status', 'DISPONIVEL')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching available tokens:', error);
    return [];
  }
  
  return (data || []).map(t => ({
    id: t.id,
    status: t.status as 'DISPONIVEL' | 'CONSUMIDO',
    productName: t.product_name,
    productImage: t.product_image,
    createdAt: new Date(t.created_at).getTime(),
  }));
}

export async function validateToken(tokenId: string): Promise<{ success: boolean; token?: Token; error?: 'CONSUMED' | 'NOT_FOUND' }> {
  // First, fetch the token
  const { data: tokenData, error: fetchError } = await supabase
    .from('tokens')
    .select('*')
    .eq('id', tokenId)
    .maybeSingle();

  if (fetchError || !tokenData) {
    return { success: false, error: 'NOT_FOUND' };
  }

  if (tokenData.status === 'CONSUMIDO') {
    return { 
      success: false, 
      error: 'CONSUMED', 
      token: {
        id: tokenData.id,
        status: 'CONSUMIDO',
        productName: tokenData.product_name,
        productImage: tokenData.product_image,
        createdAt: new Date(tokenData.created_at).getTime(),
      }
    };
  }

  // Update status to CONSUMED
  const { data: updatedData, error: updateError } = await supabase
    .from('tokens')
    .update({ status: 'CONSUMIDO' })
    .eq('id', tokenId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating token:', updateError);
    return { success: false, error: 'NOT_FOUND' };
  }

  return { 
    success: true, 
    token: {
      id: updatedData.id,
      status: 'CONSUMIDO',
      productName: updatedData.product_name,
      productImage: updatedData.product_image,
      createdAt: new Date(updatedData.created_at).getTime(),
    }
  };
}

export async function getTokenById(tokenId: string): Promise<Token | undefined> {
  const { data, error } = await supabase
    .from('tokens')
    .select('*')
    .eq('id', tokenId)
    .maybeSingle();

  if (error || !data) {
    return undefined;
  }

  return {
    id: data.id,
    status: data.status as 'DISPONIVEL' | 'CONSUMIDO',
    productName: data.product_name,
    productImage: data.product_image,
    createdAt: new Date(data.created_at).getTime(),
  };
}
