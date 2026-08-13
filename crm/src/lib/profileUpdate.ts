export interface CustomerProfileUpdate {
  name?: string;
  username?: string;
  discordHandle?: string;
}

export function parseCustomerProfileUpdate(input: Record<string, unknown>): CustomerProfileUpdate {
  return {
    ...(typeof input.name === 'string' ? { name: input.name.trim() } : {}),
    ...(typeof input.username === 'string' ? { username: input.username.trim() } : {}),
    ...(typeof input.discordHandle === 'string' ? { discordHandle: input.discordHandle.trim() } : {}),
  };
}
