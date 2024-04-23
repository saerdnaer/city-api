import { createModule, gql } from "graphql-modules";
import CkanAPI from "./datasource";

export const ckan = createModule({
	id: "ckan",
	dirname: __dirname,
	typeDefs: [
		gql`
			scalar JSON

			type Query {
				hello: String!
				dataset(id: String!): JSON
			}
		`,
	],
	resolvers: {
		Query: {
			hello: () => "world",
			dataset: async (_: any, { id }: { id: string }, { dataSources }: any) => {
				const dataset = await (dataSources.ckan as CkanAPI).getDataset(id);
				return dataset;
			}
		},
	},
});
