import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    console.log('Basic contact form submission:', formData);

    return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing basic contact form submission:', error);
    return NextResponse.json({ message: 'Error submitting form.' }, { status: 500 });
  }
}