import { createApplication } from 'graphql-modules'
import { ckan } from './modules'

// This is your application, it contains your GraphQL schema and the implementation of it.
export const application = createApplication({
  modules: [ckan]
})
