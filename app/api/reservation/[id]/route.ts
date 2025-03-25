import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status, adminNote } = await request.json();
    
    // Update reservation status
    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { 
        status,
        adminNote 
      }
    });

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Format date for better readability
    const formattedDate = reservation.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Read and convert logo to base64
    const logoPath = path.join(process.cwd(), 'public', 'logobg.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');

    // Read and convert QR code to base64
    const qrCodePath = path.join(process.cwd(), 'public', 'payment-qr.png');
    const qrCodeBuffer = fs.readFileSync(qrCodePath);
    const qrCodeBase64 = qrCodeBuffer.toString('base64');

    // Prepare email template based on status
    const getEmailTemplate = () => {
      const baseTemplate = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reservation ${status.toLowerCase()} - Salud Restaurant</title>
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
              .payment-section {
                background-color: #F5F1EA;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
              }
              .qr-code-container {
                width: 200px;
                height: 200px;
                margin: 15px auto;
                text-align: center;
              }
              .qr-code {
                width: 100%;
                height: 100%;
                object-fit: contain;
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
              .status-confirmed {
                color: #0B4D2C;
              }
              .status-rejected {
                color: #DC2626;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <img src="cid:logo" 
                     alt="Salud Restaurant" 
                     class="logo" 
                     style="max-width: 200px; height: auto; display: inline-block;">
              </div>
              <div class="content">
      `;

      const footerTemplate = `
              <div class="footer">
                <p>Salud Restaurant<br>
                G962+F6R, Lake Range, Kalighat, Kolkata, West Bengal 700045</p>
                <p>📞 Phone: +91 9831175550<br>
                   ✉️ Email: salud.calcutta@gmail.com</p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      if (status === 'CONFIRMED') {
        return `
          ${baseTemplate}
            <h1 class="status-confirmed" style="text-align: center;">Reservation Confirmed!</h1>
            <p>Dear ${reservation.name},</p>
            <p>Great news! Your reservation at Salud Restaurant has been confirmed.</p>
            
            <div class="reservation-details">
              <h2 style="color: #0B4D2C; margin-top: 0;">Reservation Details</h2>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${reservation.time}</p>
              <p><strong>Number of Guests:</strong> ${reservation.guests}</p>
              ${reservation.specialRequests ? `<p><strong>Special Requests:</strong> ${reservation.specialRequests}</p>` : ''}
              ${adminNote ? `<p><strong>Note:</strong> ${adminNote}</p>` : ''}
            </div>

            <div class="payment-section">
              <h3 style="color: #0B4D2C;">Complete Your Payment</h3>
              <p>Please complete the payment of Rs. 2000 using the QR code below to secure your reservation:</p>
              <div class="qr-code-container" style="width: 200px; height: 200px; margin: 15px auto; text-align: center;">
                <img src="cid:qrcode" 
                     alt="Payment QR Code" 
                     style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              <p style="font-size: 14px; color: #666;">Scan this QR code to complete your payment</p>
            </div>

            <h3 style="color: #0B4D2C;">Important Information</h3>
            <ul>
              <li>Please arrive 5-10 minutes before your reservation time</li>
              <li>Your table will be held for 15 minutes after the reservation time</li>
              <li>For parties larger than 6, a deposit may be required</li>
            </ul>

            <p>If you need to modify or cancel your reservation, please contact us at:</p>
            <p>📞 Phone: +91 9831175550<br>
               ✉️ Email: salud.calcutta@gmail.com</p>
          ${footerTemplate}
        `;
      } else if (status === 'REJECTED') {
        return `
          ${baseTemplate}
            <h1 class="status-rejected" style="text-align: center;">Reservation Update</h1>
            <p>Dear ${reservation.name},</p>
            <p>Thank you for your interest in dining at Salud Restaurant. Unfortunately, we are unable to accommodate your reservation request for the following date and time:</p>
            
            <div class="reservation-details">
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${reservation.time}</p>
              <p><strong>Number of Guests:</strong> ${reservation.guests}</p>
              ${adminNote ? `<p><strong>Reason:</strong> ${adminNote}</p>` : ''}
            </div>

            <p>We apologize for any inconvenience. We would be happy to help you find an alternative date or time for your visit.</p>

            <p>Please feel free to:</p>
            <ul>
              <li>Make a new reservation for a different date/time</li>
              <li>Call us at +91 9831175550 for immediate assistance</li>
              <li>Email us at salud.calcutta@gmail.com</li>
            </ul>

            <div style="text-align: center;">
              <a href="https://salud-calcutta.vercel.app/#reservation" class="button">Make New Reservation</a>
            </div>
          ${footerTemplate}
        `;
      }
    };

    // Send status update email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reservation.email,
      subject: `Reservation ${status.toLowerCase()} - Salud Restaurant`,
      html: getEmailTemplate(),
      attachments: [
        {
          filename: 'logobg.png',
          content: logoBuffer,
          cid: 'logo'
        },
        ...(status === 'CONFIRMED' ? [{
          filename: 'payment-qr.png',
          content: qrCodeBuffer,
          cid: 'qrcode'
        }] : [])
      ]
    });

    return NextResponse.json(
      { message: `Reservation ${status.toLowerCase()} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
} 
