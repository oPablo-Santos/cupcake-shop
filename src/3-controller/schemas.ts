import { z } from 'zod'

const checkoutItemSchema = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.number().int().min(1).max(99),
})

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Informe seu nome completo')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome muito longo'),
  customerEmail: z
    .string()
    .min(1, 'Informe seu e-mail')
    .email('E-mail inválido')
    .max(254, 'E-mail muito longo'),
  customerPhone: z
    .string()
    .min(1, 'Informe seu telefone')
    .min(8, 'Telefone deve ter pelo menos 8 dígitos')
    .max(20, 'Telefone muito longo'),
  street: z
    .string()
    .min(1, 'Informe a rua')
    .min(2, 'Rua deve ter pelo menos 2 caracteres')
    .max(200, 'Endereço muito longo'),
  number: z.string().min(1, 'Informe o número').max(20, 'Número muito longo'),
  complement: z.string().max(100, 'Complemento muito longo').optional(),
  neighborhood: z
    .string()
    .min(1, 'Informe o bairro')
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(120, 'Bairro muito longo'),
  city: z
    .string()
    .min(1, 'Informe a cidade')
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(120, 'Cidade muito longa'),
  state: z
    .string()
    .min(1, 'Informe a UF')
    .length(2, 'UF deve ter 2 letras (ex.: SP)'),
  zipCode: z
    .string()
    .min(1, 'Informe o CEP')
    .min(8, 'CEP deve ter 8 dígitos')
    .max(9, 'CEP inválido'),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'CASH_ON_DELIVERY']),
  items: z.array(checkoutItemSchema).min(1).max(50),
})

export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Informe o nome')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(120, 'Nome muito longo'),
  description: z
    .string()
    .min(1, 'Informe a descrição')
    .min(2, 'Descrição muito curta')
    .max(2000, 'Descrição muito longa'),
  priceCents: z.number().int().min(1, 'Preço inválido').max(10_000_000, 'Preço muito alto'),
  imageUrl: z.string().min(1, 'Informe a URL da imagem').url('URL inválida').max(2048, 'URL muito longa'),
  available: z.boolean().optional(),
})

export const updateProductSchema = productSchema.partial()

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Informe a senha').max(256, 'Senha muito longa'),
})

export const updateOrderStatusesSchema = z.object({
  orderStatus: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  deliveryStatus: z
    .enum(['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ProductInput = z.infer<typeof productSchema>
