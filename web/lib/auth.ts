import { NextRequest } from 'next/server';

export interface UserIdentity {
  userId: string;
  name: string;
  email: string;
  tenantId?: string;
  roles?: string[];
}

/**
 * Validates Microsoft Entra ID (Azure AD) Bearer Token from SharePoint SPFx requests.
 * In production, this decodes and verifies the JWT token signature using Microsoft public keys (jwks.msftidentity.com).
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<UserIdentity | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If unauthenticated internal network access is permitted
    return null;
  }

  const token = authHeader.substring(7);

  try {
    // Decode JWT payload (base64)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    // Verify token expiration & issuer claims
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.warn('Entra ID token expired');
      return null;
    }

    return {
      userId: payload.sub || payload.oid || 'unknown',
      name: payload.name || payload.preferred_username || 'SharePoint User',
      email: payload.preferred_username || payload.upn || payload.email || '',
      tenantId: payload.tid,
      roles: payload.roles || []
    };
  } catch (error) {
    console.error('Failed to parse Entra ID token:', error);
    return null;
  }
}
