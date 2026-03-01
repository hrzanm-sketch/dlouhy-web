export { categories, categoriesRelations } from "./categories"
export { products, productsRelations } from "./products"
export {
  productParameters,
  productParametersRelations,
} from "./product-parameters"
export {
  productDocuments,
  productDocumentsRelations,
} from "./product-documents"
export {
  productRelations,
  productRelationsRelations,
} from "./product-relations"
export { downloads } from "./downloads"
export { webLeads, webLeadsRelations } from "./web-leads"
export { webPageContent } from "./web-page-content"
export { portalUsers, portalUsersRelations } from "./portal-users"
export {
  portalNotifications,
  portalNotificationsRelations,
} from "./portal-notifications"
export { references } from "./references"
export { articles } from "./articles"

// Intranet tables (read-only, no migrations)
export {
  intranetOrders,
  intranetInvoices,
  intranetCompanies,
  intranetServiceRequests,
  intranetClaims,
} from "./intranet"
export type { CompanyAddress, CompanyContact } from "./intranet"
