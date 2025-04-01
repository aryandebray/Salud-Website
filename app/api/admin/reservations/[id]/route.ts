import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

// API route for handling individual reservation operations
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminNote } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { 
        status,
        ...(adminNote && { adminNote })
      },
    });

    // Send email notification
    try {
      const emailSubject = status === 'CONFIRMED' 
        ? '¡Your Reservation at Salud is Confirmed!' 
        : 'Update on Your Salud Reservation';

      // Read and convert logo to base64
      const logoPath = path.join(process.cwd(), 'public', 'logobg.png');
      const logoBuffer = fs.readFileSync(logoPath);

      // Read and convert QR code to base64
      const qrCodePath = path.join(process.cwd(), 'public', 'payment-qr.png');
      const qrCodeBuffer = fs.readFileSync(qrCodePath);

      const baseEmailStyle = `
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `;

      const headerStyle = `
        background-color: #0B4D2C;
        padding: 20px;
        text-align: center;
        margin-bottom: 30px;
      `;

      const logoStyle = `
        width: 150px;
        height: auto;
        margin-bottom: 20px;
      `;

      const buttonStyle = status === 'CONFIRMED'
        ? 'background-color: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0;'
        : 'background-color: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 20px 0;';

      const footerStyle = `
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eaeaea;
        text-align: center;
        color: #666;
        font-size: 14px;
      `;

      const emailContent = `
        <div style="${baseEmailStyle}">
          <div style="${headerStyle}">
            <img src="cid:logo" alt="Salud Restaurant" style="${logoStyle}">
            <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 10px;">
              ${status === 'CONFIRMED' ? '¡Reservation Confirmed!' : 'Reservation Update'}
            </h1>
          </div>

          <p style="color: #333; font-size: 16px;">Dear ${updatedReservation.name},</p>

          ${status === 'CONFIRMED' ? `
            <p style="color: #333; font-size: 16px;">
              We're delighted to confirm your reservation at Salud Restaurant:
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(updatedReservation.date).toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><strong>Time:</strong> ${updatedReservation.time}</p>
              <p style="margin: 5px 0;"><strong>Guests:</strong> ${updatedReservation.guests}</p>
              <p style="margin: 5px 0;"><strong>Price per person:</strong> Rs. 2100</p>
              <p style="margin: 5px 0;"><strong>Total Amount:</strong> Rs. ${updatedReservation.guests * 2100}</p>
              ${updatedReservation.specialRequests ? `<p style="margin: 5px 0;"><strong>Special Requests:</strong> ${updatedReservation.specialRequests}</p>` : ''}
            </div>
            ${adminNote ? `<p style="color: #333; font-style: italic;">${adminNote}</p>` : ''}
            
            <div style="background-color: #F5F1EA; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #0B4D2C; margin-top: 0;">Complete Your Payment</h3>
              <p>Please complete the payment using the QR code below to secure your reservation:</p>
              <div style="width: 200px; height: 200px; margin: 15px auto;">
                <img src="cid:qrcode" 
                     alt="Payment QR Code" 
                     style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              <p style="font-size: 14px; color: #666;">Scan this QR code to complete your payment</p>
            </div>

            <p style="color: #333;">We look forward to serving you an unforgettable dining experience!</p>
            
          ` : `
            <p style="color: #333; font-size: 16px;">
              We regret to inform you that we are unable to accommodate your reservation for ${updatedReservation.guests} guests on ${new Date(updatedReservation.date).toLocaleDateString()} at ${updatedReservation.time}.
            </p>
            ${adminNote ? `<p style="color: #333; font-style: italic;">${adminNote}</p>` : ''}
            <p style="color: #333;">We sincerely apologize for any inconvenience caused and hope to welcome you another time.</p>
            
          `}

          <div style="${footerStyle}">
            <p>Salud Restaurant</p>
            <p>G962+F6R, Lake Range, Kalighat, Kolkata, West Bengal 700045</p>
            <p>📞 Phone: +91 9831175550<br>
               ✉️ Email: salud.calcutta@gmail.com</p>
            <div style="margin-top: 20px;">
              <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Facebook</a>
              <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Instagram</a>
              <a href="#" style="color: #666; text-decoration: none; margin: 0 10px;">Twitter</a>
            </div>
          </div>
        </div>
      `;

      const { sendEmail } = await import('@/lib/email');
      
      // Create email options with attachments
      const emailOptions = {
        to: updatedReservation.email,
        subject: emailSubject,
        text: status === 'CONFIRMED' 
          ? `Your reservation for ${updatedReservation.guests} guests on ${new Date(updatedReservation.date).toLocaleDateString()} at ${updatedReservation.time} has been confirmed.`
          : `Unfortunately, we are unable to accommodate your reservation for ${updatedReservation.guests} guests on ${new Date(updatedReservation.date).toLocaleDateString()} at ${updatedReservation.time}.`,
        html: emailContent,
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
      };

      await sendEmail(emailOptions);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue with the response even if email fails
    }

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Failed to update reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
} 