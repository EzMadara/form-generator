import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Retrieve all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'requestNumber', 'date', 'purpose', 'addressProject', 'amount',
      'totalAmount', 'recipientName', 'bankName', 'accountNumber',
      'paymentMethod', 'projectConsultant', 'purchasingOfficer', 'recipientCompany'
    ];
    
    const missingFields = requiredFields.filter(field => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    const invoice = await prisma.invoice.create({
      data: {
        requestNumber: body.requestNumber,
        date: body.date,
        purpose: body.purpose,
        addressProject: body.addressProject || '',
        amount: body.amount || '',
        totalAmount: body.totalAmount,
        recipientName: body.recipientName,
        bankName: body.bankName,
        accountNumber: body.accountNumber,
        paymentMethod: body.paymentMethod,
        projectConsultant: body.projectConsultant,
        purchasingOfficer: body.purchasingOfficer,
        recipientCompany: body.recipientCompany,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to create invoice: ${errorMessage}` },
      { status: 500 }
    );
  }
}

