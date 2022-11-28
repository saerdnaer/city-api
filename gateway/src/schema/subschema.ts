import { print, printSchema } from "graphql";
import { introspectSchema } from "@graphql-tools/wrap";
import { loadSchema } from "@graphql-tools/load";
import { AsyncExecutor } from "@graphql-tools/utils";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import meta from "../../package.json";

import * as fs from "fs";
// import { ensureDirSync } from 'fs-extra';

import logger from "../logger";
import config from "../config";
import path from "path";

type Options = {
	useSchemaSnapshot?: boolean;
	forwardAuthorization?: boolean;
	debug?: boolean;
};

export const buildExecutor = (endpointUrl: string, options?: Options): AsyncExecutor => {
	const { forwardAuthorization, debug } = options || {
		forwardAuthorization: false,
		debug: false,
	};

	return async ({ document, variables, context }) => {
		const { request } = (context as any) || { request: null };
		const query = print(document);
		if (config.isDevelopment && debug) {
			// eslint-disable-next-line no-console
			console.debug(query);
		}

		let authorization;
		if (forwardAuthorization && request?.headers?.authorization) {
			authorization = request?.headers?.authorization;
		}

		const headers = {
			"Content-Type": "application/json",
			"Accept-Language": request?.headers?.get("accept-language") || 'en',
			"x-request-id": request?.headers?.get("x-request-id"),
			...(authorization ? { authorization } : {}),
			"user-agent": `${meta.name} (gw:${config.branch})`,
		};
		console.log(headers);
		const fetchResult = await fetch(endpointUrl, {
			method: "POST",
			headers,
			body: JSON.stringify({ query, variables }),
		});

		if (fetchResult.status >= 400) {
			const error = new Error(`Fetching '${endpointUrl}' yields error ${fetchResult.status}: ${fetchResult.statusText}`);

			(error as any).__debug = { variables, query };
			throw error;
		}

		const result = await fetchResult.json();
		if (config.isDevelopment && debug) {
			// eslint-disable-next-line no-console
			console.dir(result, { depth: 3 });
		}
		return result;
	};
};

export default async (name: string, endpointUrl: string, options?: Options) => {
	const schemaFile = `${process.cwd()}/__snapshots__/${name}Schema.graphql`;

	const debug = process.env.DEBUG?.includes(name.toUpperCase()) || options?.debug;

	const useSchemaSnapshot = options?.useSchemaSnapshot ?? !config.isDevelopment ?? (process.env.USE_SCHEMA_SNAPSHOTS && !debug) ?? false;

	const executor = buildExecutor(endpointUrl, { ...options, debug });

	logger.info(` – import: ${endpointUrl} (from ${useSchemaSnapshot ? "local snapshot" : "remote"})`);

	const subschemaConfig = {
		schema: await (useSchemaSnapshot
			? // load prebuild schema from disk
			  loadSchema(schemaFile, { loaders: [new GraphQLFileLoader()] })
			: // else: build schema on the fly, and store result to disk
			  introspectSchema(executor)),
		executor,
	};

	if (!useSchemaSnapshot) {
		const schemaSdl = printSchema(subschemaConfig.schema);

		const dir = path.dirname(schemaFile);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		fs.writeFileSync(schemaFile, schemaSdl);
		logger.debug('wrote schema to ' + schemaFile);
	}

	return subschemaConfig;
};