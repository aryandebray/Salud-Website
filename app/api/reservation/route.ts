import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

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
          <title>Reservation Confirmation</title>
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
              <img src="${logoDataUrl}" alt="Salud Restaurant" class="logo" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
              <div class="logo-fallback" style="display: none;">Salud Restaurant</div>
            </div>
            <div class="content">
              <h1 style="color: #0B4D2C; text-align: center;">Reservation Confirmation</h1>
              <p>Dear ${name},</p>
              <p>Thank you for choosing Salud Restaurant. We are pleased to confirm your reservation:</p>
              
              <div class="reservation-details">
                <h2 style="color: #0B4D2C; margin-top: 0;">Reservation Details</h2>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Number of Guests:</strong> ${guests}</p>
                <p><strong>Contact Number:</strong> ${phone}</p>
                ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/menu" class="button">View Our Menu</a>
              </div>

              <div class="divider"></div>

              <h3 style="color: #0B4D2C;">Important Information</h3>
              <ul>
                <li>Please arrive 5-10 minutes before your reservation time</li>
                <li>Your table will be held for 15 minutes after the reservation time</li>
                <li>For parties larger than 6, a deposit may be required</li>
              </ul>

              <p>If you need to modify or cancel your reservation, please contact us at:</p>
              <p>📞 Phone: +1 (555) 123-4567<br>
                 ✉️ Email: reservations@salud.com</p>
            </div>
            
            <div class="footer">
              <p>Salud Restaurant<br>
              123 Italian Street, Foodville, FD 12345</p>
              <p>This is an automated confirmation. Please do not reply to this email.</p>
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
          <title>New Reservation</title>
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
              <img src="${logoDataUrl}" alt="Salud Restaurant" class="logo" onerror="this.style.display='none';this.nextElementSibling.style.display='block';">
              <div class="logo-fallback" style="display: none;">Salud Restaurant</div>
            </div>
            <div class="content">
              <h1 style="color: #0B4D2C;">New Reservation Request</h1>
              
              <div class="reservation-details">
                <h2 style="color: #0B4D2C; margin-top: 0;">Customer Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                
                <h2 style="color: #0B4D2C;">Reservation Details</h2>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Number of Guests:</strong> ${guests}</p>
                ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
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
      subject: 'Reservation Confirmation - Salud Restaurant',
      html: customerEmailTemplate
    });

    // Send notification email to restaurant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: `New Reservation Request from ${name}`,
      html: restaurantEmailTemplate
    });

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