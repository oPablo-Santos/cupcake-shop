import { ProductRepository } from '@framework/repositories/productRepository'
import { OrderRepository } from '@framework/repositories/orderRepository'
import { AdminUserRepository } from '@framework/repositories/adminUserRepository'
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
import { VerifyAdminSessionUseCase } from '@business/useCases/adminAuth'
import {
  AdminLoginUseCase,
  BootstrapAdminUseCase,
  CreateAdminUserUseCase,
  DeactivateAdminUserUseCase,
  ListAdminUsersUseCase,
} from '@business/useCases/manageAdmin'

const productRepository = new ProductRepository()
const orderRepository = new OrderRepository()
const adminUserRepository = new AdminUserRepository()
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
  bootstrapAdmin: new BootstrapAdminUseCase(adminUserRepository),
  adminLogin: new AdminLoginUseCase(adminUserRepository, adminAuth),
  verifyAdminSession: new VerifyAdminSessionUseCase(adminAuth, adminUserRepository),
  listAdminUsers: new ListAdminUsersUseCase(adminUserRepository),
  createAdminUser: new CreateAdminUserUseCase(adminUserRepository),
  deactivateAdminUser: new DeactivateAdminUserUseCase(adminUserRepository),
}

export { SESSION_COOKIE, MAX_AGE_SEC } from '@framework/services/adminAuthService'