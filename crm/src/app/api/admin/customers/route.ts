import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '../../../../lib/auth';
import { getUsers, deleteCustomer } from '../../../../lib/db';

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const users = await getUsers();
    const customers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      discordHandle: user.discordHandle,
      role: user.role,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.role !== 'superadmin') {
      return NextResponse.json({ error: 'Only Super Admins have permission to delete customer accounts.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('id');
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required.' }, { status: 400 });
    }

    const success = await deleteCustomer(customerId);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete customer.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Customer deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
