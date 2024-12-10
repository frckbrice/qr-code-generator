// dashboard/page.tsx

"use client";

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../../../database.types';
import Image from 'next/image';

export default function AgentDashboard() {
    const [customerName, setCustomerName] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [generatedTicket, setGeneratedTicket] = useState<Database['public']['Tables']['tickets']['Row'] | null>(null);
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setCompanyLogo(reader.result as string);
        };
        reader.readAsDataURL(file!);
    };

    const generateTicket = () => {
        const ticket: Database['public']['Tables']['tickets']['Row'] = {
            id: uuidv4(),
            name: customerName,
            amount: parseFloat(ticketPrice),
            created_at: new Date().toISOString(),
            is_valid: true
        };
        // TODO: save ticket to database

        setGeneratedTicket(ticket);
    };

    function validateTicket(scannedQRData: string) {
        try {
            const ticketData = JSON.parse(scannedQRData);

            // Check ticket properties
            const isValid =
                ticketData.id &&
                ticketData.is_valid === true &&
                new Date(ticketData.created_at) < new Date(); // Prevent future tickets

            // Optional: Database check
            //   const databaseValidation = checkTicketInDatabase(ticketData.id);

            //   return isValid && databaseValidation;
            return isValid;
        } catch (error) {
            return false; // Invalid QR code format
        }
    }

    // Simulated database check
    function checkTicketInDatabase(ticketId: string) {
        //TODO: query your database
        // to confirm the ticket hasn't been used
        return true;
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-gray-100'>
            <div className='w-full max-w-4xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-white  rounded-lg p-6'>
                    {/* Input Section */}
                    <div className='space-y-4 bg-cyan-50 p-2 customer-form'>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Créer un ticket</h2>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Nom du client
                            </label>
                            <input
                                type="text"
                                placeholder="Nom du client (Optionnel)"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-500"
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Montant à payer
                            </label>
                            <input
                                type="number"
                                placeholder="Prix du ticket"
                                value={ticketPrice}
                                onChange={(e) => setTicketPrice(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-500"
                            />
                        </div>

                        <button
                            onClick={generateTicket}
                            className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-700 transition duration-300"
                        >
                            Générer le ticket
                        </button>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Télécharger le logo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="w-full text-sm text-gray-500 
                                file:mr-4 file:py-2 file:px-4 
                                file:rounded file:border-0 
                                file:text-sm file:font-semibold
                                file:bg-cyan-50 file:text-cyan-700
                                hover:file:bg-cyan-100"
                            />
                        </div>
                    </div>

                    {/* Ticket Preview Section */}
                    {generatedTicket && (
                        <div className='flex flex-col items-center justify-center  print-ticket-section'>
                            <div className='text-center w-full border border-gray-300 shadow-lg rounded-lg p-3 sm:p-6 ticket-customer'>
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Ticket YAFE</h3>

                                {!!companyLogo && (
                                    <Image
                                        src={companyLogo}
                                        alt="Logo de l'entreprise"
                                        className="mx-auto mb-4 h-24 w-24 object-cover rounded-full"
                                        width={100}
                                        height={100}
                                        priority
                                    />
                                )}

                                <div className='flex justify-center mb-4'>
                                    <QRCode
                                        size={256}
                                        style={{ height: "200px", maxWidth: "100%", width: "200px" }}
                                        value={JSON.stringify(generatedTicket)}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>

                                <div className='space-y-2 text-gray-700'>
                                    <p>Nom du Client: {customerName || 'Invité'}</p>
                                    <p>Prix: {ticketPrice} $</p>
                                    <p>Date: {new Date(generatedTicket.created_at).toLocaleDateString()}</p>
                                </div>

                                <button
                                    className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 button-print print:hidden"
                                    onClick={() => window.print()}
                                >
                                    Imprimer le ticket
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
