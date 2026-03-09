/**
 * Resolves the correct data source for hybrid controllers that handle
 * both HTTP (@Body) and microservice (@Payload) requests.
 *
 * HTTP requests populate @Body; TCP/RMQ requests populate @Payload.
 * This helper picks whichever is non-empty.
 *
 * @param httpData   - Data from the @Body() decorator
 * @param tcpPayload - Data from the @Payload() decorator
 * @returns          - The resolved data object
 */
export function resolvePayload<T>(httpData: T, tcpPayload: T): T {
  if (
    httpData &&
    typeof httpData === 'object' &&
    Object.keys(httpData).length > 0
  ) {
    return httpData;
  }
  return tcpPayload;
}

/**
 * Resolves a single value (e.g. an ID) from HTTP param vs TCP payload.
 */
export function resolveParam<T>(httpParam: T, tcpParam: T): T {
  return httpParam || tcpParam;
}
