export type DomainError = {
  code: string
  message: string
}

export const productNotFound: DomainError = {
  code: 'PRODUCT_NOT_FOUND',
  message: 'Produto não encontrado',
}

export const productUnavailable: DomainError = {
  code: 'PRODUCT_UNAVAILABLE',
  message: 'Produto indisponível',
}

export const orderNotFound: DomainError = {
  code: 'ORDER_NOT_FOUND',
  message: 'Pedido não encontrado',
}

export const invalidCredentials: DomainError = {
  code: 'INVALID_CREDENTIALS',
  message: 'Senha inválida',
}

export const adminMisconfigured: DomainError = {
  code: 'ADMIN_MISCONFIGURED',
  message: 'Admin não configurado',
}

export const rateLimited: DomainError = {
  code: 'RATE_LIMITED',
  message: 'Muitas tentativas. Tente novamente em instantes.',
}

export const unauthorized: DomainError = {
  code: 'UNAUTHORIZED',
  message: 'Não autorizado',
}

export const emptyCart: DomainError = {
  code: 'EMPTY_CART',
  message: 'Carrinho vazio',
}

export const invalidZipCode: DomainError = {
  code: 'INVALID_ZIP',
  message: 'CEP inválido',
}
