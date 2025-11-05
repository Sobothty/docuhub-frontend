/**
 * Network Information API type definitions
 * Based on: https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation
 */

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: string;
  readonly downlink?: number;
  readonly rtt?: number;
  readonly saveData?: boolean;
  readonly type?: string;
  onchange?: ((this: NetworkInformation, ev: Event) => unknown) | null;
}

interface Navigator {
  readonly connection?: NetworkInformation;
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}
