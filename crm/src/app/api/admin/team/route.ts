import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getAdmins, createAdmin, deleteAdmin } from '../../../../lib/db';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only Super Admins can view the team.' }, { status: 403 });
    }

    const admins = await getAdmins();
    // Return sanitized admin profiles (without password hashes)
    const sanitized = admins.map((a) => ({
      id: a.id,
      username: a.username,
      role: a.role,
      createdAt: a.createdAt,
    }));

    return NextResponse.json({ success: true, admins: sanitized });
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

    const success = await deleteAdmin(adminId);
    if (!success) {
      return NextResponse.json({ error: 'Cannot delete this admin or super admin.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
