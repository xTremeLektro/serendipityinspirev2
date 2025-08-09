import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.json(); // Assuming form data is sent as JSON
    console.log('Quote Request Form Submission:', formData);

    // In a real application, you would process the data here
    // (e.g., save to a database, send email notifications, etc.)

    return NextResponse.json({ message: 'Quote request submitted successfully!' });
  } catch (error) {
    console.error('Error handling quote request form submission:', error);
    return NextResponse.json({ message: 'Error submitting quote request.' }, { status: 500 });
  }
}