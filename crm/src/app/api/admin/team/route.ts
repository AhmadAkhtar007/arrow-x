import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getAdmins, createAdmin, deleteAdmin, updateAdminProfile } from '../../../../lib/db';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'superadmin' && session.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const admins = await getAdmins();
    // Return sanitized admin profiles (without password hashes)
    const sanitized = admins.map((a) => ({
      id: a.id,
      username: a.username,
      role: a.role,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({ success: true, team: sanitized, admins: sanitized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only Super Admins can provision new staff.' }, { status: 403 });
    }

    const body = await req.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const newAdmin = await createAdmin({
      username: username.trim(),
      password: password.trim(),
      role: role || 'admin',
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        role: newAdmin.role,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create admin.' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only Super Admins can modify staff accounts.' }, { status: 403 });
    }

    const body = await req.json();
    const { id, username, password, role } = body;

    if (!id) {
      return NextResponse.json({ error: 'Admin ID is required.' }, { status: 400 });
    }

    const updated = await updateAdminProfile(id, {
      username: username?.trim() || undefined,
      password: password?.trim() || undefined,
      role: role || undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Admin not found or failed to update.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: updated.id,
        username: updated.username,
        role: updated.role,
        createdAt: updated.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update admin.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only Super Admins can remove staff.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get('id');
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID is required.' }, { status: 400 });
    }

    if (session.id === adminId) {
      return NextResponse.json({ error: 'You cannot delete your own active administrator account.' }, { status: 400 });
    }

    const success = await deleteAdmin(adminId);
    if (!success) {
      return NextResponse.json({ error: 'Cannot delete this admin.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
