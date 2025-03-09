import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or any other email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(timeStr: string) {
  return new Date(`2000/01/01 ${timeStr}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

async function sendEmails(data: any) {
  // Email to restaurant
  const restaurantEmailContent = `
    New Reservation Details:
    
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
    Date: ${formatDate(data.date)}
    Time: ${formatTime(data.time)}
    Number of Guests: ${data.guests}
    Special Requests: ${data.specialRequests}
    
    Timestamp: ${new Date(data.timestamp).toLocaleString()}
  `;

  // HTML email to customer
  const customerHtmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #B4A186; text-align: center;">Reservation Confirmation</h2>
      <p style="text-align: center;">Thank you for choosing Salud!</p>
      
      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0B4D2C; margin-top: 0;">Your Reservation Details:</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Date:</strong> ${formatDate(data.date)}</p>
        <p><strong>Time:</strong> ${formatTime(data.time)}</p>
        <p><strong>Number of Guests:</strong> ${data.guests}</p>
        ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ''}
      </div>

      <div style="text-align: center; color: #666; font-size: 14px;">
        <p>We're excited to serve you! If you need to make any changes to your reservation, please contact us at ${process.env.RESTAURANT_EMAIL}</p>
        <p style="margin-top: 20px;">
          <strong>Address:</strong> 123 Italian Street<br>
          <strong>Phone:</strong> (555) 123-4567
        </p>
      </div>
    </div>
  `;

  try {
    // Send email to restaurant
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RESTAURANT_EMAIL,
      subject: `New Reservation - ${data.name}`,
      text: restaurantEmailContent
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: 'Your Reservation at Salud is Confirmed!',
      html: customerHtmlContent,
      text: `
        Thank you for choosing Salud!
        
        Your Reservation Details:
        Name: ${data.name}
        Date: ${formatDate(data.date)}
        Time: ${formatTime(data.time)}
        Number of Guests: ${data.guests}
        ${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}
        
        We're excited to serve you! If you need to make any changes to your reservation, please contact us at ${process.env.RESTAURANT_EMAIL}
        
        Address: 123 Italian Street
        Phone: (555) 123-4567
      `
    });

    return true;
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Add timestamp to the reservation data
    const reservationData = {
      ...data,
      timestamp: new Date().toISOString()
    };

    // Send emails to both restaurant and customer
    await sendEmails(reservationData);

    return NextResponse.json({ 
      success: true, 
      message: 'Reservation confirmed! Check your email for confirmation details.' 
    });
  } catch (error) {
    console.error('Error processing reservation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit reservation. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
} 