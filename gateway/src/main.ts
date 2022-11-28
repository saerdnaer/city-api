import { createYoga } from 'graphql-yoga'
import { useGraphQLModules } from '@envelop/graphql-modules'
import { createServer } from 'http'

import { application } from './application'
import * as wikidata from './modules/wikidata'
import config from './config'

const main = async () => {

  const schema = await wikidata.buildSchema();

  const yoga = createYoga({
    schema,
    // plugins: [useGraphQLModules(application)]
  })
  const server = createServer(yoga)
  server.listen(config.port, () => {
    console.info(`Server is running on http://localhost:${config.port}/graphql`)
  })
}

main()