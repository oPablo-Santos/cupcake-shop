import { ProductRepository } from '@framework/repositories/productRepository'
import { OrderRepository } from '@framework/repositories/orderRepository'
import { AdminAuthService } from '@framework/services/adminAuthService'
import { ListAvailableProductsUseCase } from '@business/useCases/listAvailableProducts'
import { ListAllProductsUseCase } from '@business/useCases/listAllProducts'
import {
  CreateProductUseCase,
  DeactivateProductUseCase,
  UpdateProductUseCase,
} from '@business/useCases/manageProduct'
import { CreateOrderUseCase } from '@business/useCases/createOrder'
import {
  GetOrderUseCase,
  ListOrdersUseCase,
  UpdateOrderStatusesUseCase,
} from '@business/useCases/manageOrder'
import { AdminLoginUseCase, VerifyAdminSessionUseCase } from '@business/useCases/adminAuth'

const productRepository = new ProductRepository()
const orderRepository = new OrderRepository()
const adminAuth = new AdminAuthService()

export const useCases = {
  listAvailableProducts: new ListAvailableProductsUseCase(productRepository),
  listAllProducts: new ListAllProductsUseCase(productRepository),
  createProduct: new CreateProductUseCase(productRepository),
  updateProduct: new UpdateProductUseCase(productRepository),
  deactivateProduct: new DeactivateProductUseCase(productRepository),
  createOrder: new CreateOrderUseCase(orderRepository, productRepository),
  listOrders: new ListOrdersUseCase(orderRepository),
  getOrder: new GetOrderUseCase(orderRepository),
  updateOrderStatuses: new UpdateOrderStatusesUseCase(orderRepository),
  adminLogin: new AdminLoginUseCase(adminAuth),
  verifyAdminSession: new VerifyAdminSessionUseCase(adminAuth),
}

export { SESSION_COOKIE, MAX_AGE_SEC } from '@framework/services/adminAuthService'
