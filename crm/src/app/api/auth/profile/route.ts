import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, verifyPassword, signToken, AUTH_COOKIE_NAME } from '../../../../lib/auth';
import { 
  getAdminByUsername, 
  getUserByEmail, 
  updateAdminProfile, 
  updateCustomerProfile, 
  initializeDatabase 
} from '../../../../lib/db';

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { username, name, discordHandle, currentPassword, newPassword } = body;

    const db = initializeDatabase();

    // 1. Handle Admin Profile Update
    if (session.role === 'admin' || session.role === 'superadmin') {
      const admin = db.admins.find((a) => a.id === session.id);
      if (!admin) {
        return NextResponse.json({ error: 'Admin account not found.' }, { status: 404 });
      }

      // If updating password, verify current password
      if (newPassword) {
        if (!currentPassword) {
          return NextResponse.json({ error: 'Current password is required to set a new password.' }, { status: 400 });
        }
        const isValid = await verifyPassword(currentPassword, admin.passwordHash);
        if (!isValid) {
          return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
        }
      }

      // Check username uniqueness if changed
      if (username && username !== admin.username) {
        const usernameTaken = db.admins.some((a) => a.username.toLowerCase() === username.toLowerCase() && a.id !== admin.id);
        if (usernameTaken) {
          return NextResponse.json({ error: 'Username is already taken by another admin.' }, { status: 400 });
        }
      }

      const updatedAdmin = await updateAdminProfile(admin.id, {
        username: username || admin.username,
        password: newPassword || undefined,
      });

      if (!updatedAdmin) {
        return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
      }

      // Update session token
      const newToken = await signToken({
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        role: updatedAdmin.role,
      }, '4h');

      const response = NextResponse.json({
        success: true,
        user: {
          id: updatedAdmin.id,
          username: updatedAdmin.username,
          role: updatedAdmin.role,
        },
      });

      response.cookies.set(AUTH_COOKIE_NAME, newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });

      return response;
    }

    // 2. Handle Customer Profile Update (Name & Discord Handle)
    const user = db.users.find((u) => u.id === session.id);
    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    const updatedUser = await updateCustomerProfile(user.id, {
      name: name || user.name,
      username: username || user.username,
      discordHandle: discordHandle !== undefined ? discordHandle : user.discordHandle,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
    }

    // Update session token
    const newToken = await signToken({
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: 'customer',
    }, '365d');

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        discordHandle: updatedUser.discordHandle,
        hwid: updatedUser.hwid,
        role: 'customer',
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
