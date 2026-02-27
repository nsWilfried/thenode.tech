/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_ingestFeeds from "../actions/ingestFeeds.js";
import type * as actions_polarWebhook from "../actions/polarWebhook.js";
import type * as actions_sendNewsletters from "../actions/sendNewsletters.js";
import type * as actions_summarizeArticles from "../actions/summarizeArticles.js";
import type * as actions_weeklyDigest from "../actions/weeklyDigest.js";
import type * as auth from "../auth.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as mutations_articles from "../mutations/articles.js";
import type * as mutations_newsletters from "../mutations/newsletters.js";
import type * as mutations_sources from "../mutations/sources.js";
import type * as mutations_subscriptions from "../mutations/subscriptions.js";
import type * as mutations_users from "../mutations/users.js";
import type * as mutations_weeklyDigests from "../mutations/weeklyDigests.js";
import type * as queries_articles from "../queries/articles.js";
import type * as queries_newsletters from "../queries/newsletters.js";
import type * as queries_sources from "../queries/sources.js";
import type * as queries_subscriptions from "../queries/subscriptions.js";
import type * as queries_users from "../queries/users.js";
import type * as queries_weeklyDigests from "../queries/weeklyDigests.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/ingestFeeds": typeof actions_ingestFeeds;
  "actions/polarWebhook": typeof actions_polarWebhook;
  "actions/sendNewsletters": typeof actions_sendNewsletters;
  "actions/summarizeArticles": typeof actions_summarizeArticles;
  "actions/weeklyDigest": typeof actions_weeklyDigest;
  auth: typeof auth;
  crons: typeof crons;
  http: typeof http;
  "mutations/articles": typeof mutations_articles;
  "mutations/newsletters": typeof mutations_newsletters;
  "mutations/sources": typeof mutations_sources;
  "mutations/subscriptions": typeof mutations_subscriptions;
  "mutations/users": typeof mutations_users;
  "mutations/weeklyDigests": typeof mutations_weeklyDigests;
  "queries/articles": typeof queries_articles;
  "queries/newsletters": typeof queries_newsletters;
  "queries/sources": typeof queries_sources;
  "queries/subscriptions": typeof queries_subscriptions;
  "queries/users": typeof queries_users;
  "queries/weeklyDigests": typeof queries_weeklyDigests;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
