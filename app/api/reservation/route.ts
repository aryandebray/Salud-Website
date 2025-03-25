import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, date, time, guests } = body;

    // Validate required fields
    if (!name || !email || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('Creating new reservation:', {
      name,
      email,
      date,
      time,
      guests,
    });

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        date: new Date(date),
        time,
        guests: parseInt(guests),
        phone: body.phone, // Use the phone number from the form
      },
    });

    console.log('Reservation created successfully:', reservation);

    // Format date for better readability
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Read and convert logo to base64
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

    // HTML email template for customer
    const customerEmailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reservation Request Received</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #0B4D2C;
              padding: 20px;
              text-align: center;
            }
            .logo {
              max-width: 200px;
              height: auto;
              display: inline-block;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 0 auto;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .reservation-details {
              background-color: #F5F1EA;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 14px;
            }
            .button {
              background-color: #B4A186;
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin: 20px 0;
            }
            .divider {
              border-top: 1px solid #eee;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="${logoDataUrl}" 
                   alt="Salud Restaurant" 
                   class="logo" 
                   width="200" 
                   height="auto"
                   style="display: inline-block; max-width: 200px;">
            </div>
            <div class="content">
              <h1 style="color: #0B4D2C; text-align: center;">Reservation Request Received</h1>
              <p>Dear ${name},</p>
              <p>Thank you for choosing Salud Restaurant. We have received your reservation request and our team will review it shortly.</p>
              
              <div class="reservation-details">
                <h2 style="color: #0B4D2C; margin-top: 0;">Reservation Details</h2>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Number of Guests:</strong> ${guests}</p>
              </div>

              <div class="divider"></div>

              <h3 style="color: #0B4D2C;">What's Next?</h3>
              <p>Our team will review your reservation request and send you a confirmation email within the next few hours. Please note that your reservation is not confirmed until you receive our confirmation email.</p>

              <p>If you need to modify or cancel your reservation request, please contact us at:</p>
              <p>📞 Phone: +1 (555) 123-4567<br>
                 ✉️ Email: reservations@salud.com</p>
            </div>
            
            <div class="footer">
              <p>Salud Restaurant<br>
              123 Italian Street, Foodville, FD 12345</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // HTML email template for restaurant staff
    const restaurantEmailTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Reservation Request</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #0B4D2C;
              padding: 20px;
              text-align: center;
            }
            .logo {
              max-width: 200px;
              height: auto;
              display: inline-block;
            }
            .logo-fallback {
              color: white;
              font-size: 24px;
              font-weight: bold;
              font-family: serif;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              margin-top: 20px;
            }
            .reservation-details {
              background-color: #F5F1EA;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <img src="${logoDataUrl}" 
                   alt="Salud Restaurant" 
                   class="logo" 
                   width="200" 
                   height="auto"
                   style="display: inline-block; max-width: 200px;">
            </div>
            <div class="content">
              <h1 style="color: #0B4D2C;">New Reservation Request</h1>
              
              <div class="reservation-details">
                <h2 style="color: #0B4D2C; margin-top: 0;">Customer Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Number of Guests:</strong> ${guests}</p>
              </div>

              <div style="margin-top: 20px;">
                <p>To manage this reservation, please visit the admin dashboard:</p>
                <p><a href="/admin/reservations" style="color: #0B4D2C;">View in Dashboard</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reservation Request Received - Salud Restaurant',
      html: customerEmailTemplate,
      attachDataUrls: true // Enable data URL images
    });

    // Send notification email to restaurant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `New Reservation Request from ${name}`,
      html: restaurantEmailTemplate,
      attachDataUrls: true // Enable data URL images
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Failed to process reservation:', error);
    return NextResponse.json(
      { error: 'Failed to process reservation' },
      { status: 500 }
    );
  }
} 