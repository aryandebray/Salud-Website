import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests
    } = await request.json();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Format date and time for better readability
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `New Reservation Request from ${name}`,
      html: `
        <h2>New Reservation Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Number of Guests:</strong> ${guests}</p>
        ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
        <br>
        <p style="color: #666; font-size: 14px;">This is an automated message from your restaurant reservation system.</p>
      `,
    };

    // Send confirmation email to restaurant
    await transporter.sendMail(mailOptions);

    // Send confirmation email to customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reservation Confirmation - Salud Restaurant',
      html: `
        <h2>Thank You for Your Reservation!</h2>
        <p>Dear ${name},</p>
        <p>We have received your reservation request for:</p>
        <ul>
          <li>Date: ${formattedDate}</li>
          <li>Time: ${time}</li>
          <li>Number of Guests: ${guests}</li>
        </ul>
        <p>We will review your request and contact you if we need any additional information.</p>
        <p><strong>Reservation Details:</strong></p>
        <p>Phone: ${phone}</p>
        ${specialRequests ? `<p>Special Requests: ${specialRequests}</p>` : ''}
        <br>
        <p>If you need to modify or cancel your reservation, please contact us at:</p>
        <p>Phone: +1 (555) 123-4567</p>
        <p>Email: reservations@salud.com</p>
        <br>
        <p style="color: #666; font-size: 14px;">This is an automated confirmation. Please do not reply to this email.</p>
      `,
    };

    await transporter.sendMail(customerMailOptions);

    return NextResponse.json(
      { message: 'Reservation submitted successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing reservation:', error);
    return NextResponse.json(
      { error: 'Failed to process reservation' },
      { status: 500 }
    );
  }
} 