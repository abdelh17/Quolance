import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    if (!role || (role !== 'CLIENT' && role !== 'FREELANCER')) {
        return NextResponse.redirect(new URL('/auth/register', request.url));
    }

    console.log("User role: " + role)
    cookies().set('selectedRole', role, {
        path: '/',
        httpOnly: false,
        maxAge: 60 * 5,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/oauth2/authorization/google`);
}
