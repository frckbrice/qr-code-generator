// "use client";

// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';
// import supabase from '@/lib/supabase.-client';
// import { Database } from '../../database.types';

// // // Supabase client initialization
// // const supabase = createClient<Database>(
// //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// // );

// interface TicketValidationResult {
//     isValid: boolean;
//     message: string;
//     ticketDetails?: Database['public']['Tables']['tickets']['Row'];
// }

// export default function TicketValidator() {
//     const [scanResult, setScanResult] = useState<TicketValidationResult | null>(null);

//     const handleScan = async (data: string | null) => {
//         if (!data) return;

//         try {
//             // Parse QR code data
//             const ticketData: Database['public']['Tables']['tickets']['Row'] = JSON.parse(data);

//             // Validate ticket in database
//             const { data: dbTicket, error } = await supabase
//                 .from('tickets')
//                 .select('*')
//                 .eq('id', ticketData.id)
//                 .single();

//             if (error || !dbTicket) {
//                 setScanResult({
//                     isValid: false,
//                     message: 'Ticket not found in system'
//                 });
//                 return;
//             }

//             // Additional validation checks
//             const validationResult = validateTicket(dbTicket);
//             setScanResult(validationResult);
//         } catch (error) {
//             setScanResult({
//                 isValid: false,
//                 message: 'Invalid QR code format'
//             });
//         }
//     };

//     const validateTicket = (ticket: Database['public']['Tables']['tickets']['Row']): TicketValidationResult => {
//         const now = new Date();
//         const ticketDate = new Date(ticket.created_at);

//         // Validation rules
//         if (!ticket.is_valid) {
//             return {
//                 isValid: false,
//                 message: 'Ticket has been invalidated',
//                 ticketDetails: ticket
//             };
//         }

//         // Optional: Add time-based validation if needed
//         // Example: Ticket valid for 24 hours after creation
//         const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
//         if (ticketDate < twentyFourHoursAgo) {
//             return {
//                 isValid: false,
//                 message: 'Ticket has expired',
//                 ticketDetails: ticket
//             };
//         }

//         return {
//             isValid: true,
//             message: 'Ticket is valid',
//             ticketDetails: ticket
//         };
//     };

//     const markTicketUsed = async () => {
//         if (scanResult?.ticketDetails) {
//             await supabase
//                 .from('tickets')
//                 .update({ is_valid: false })
//                 .eq('id', scanResult.ticketDetails.id);

//             setScanResult({
//                 isValid: false,
//                 message: 'Ticket has been marked as used'
//             });
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//             <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
//                 <h2 className="text-2xl font-bold mb-4 text-center">Validation de Ticket</h2>

//                 <div className="mb-4">
//                     <QrReader
//                         onResult={(result) => {
//                             if (result) {
//                                 handleScan(result.getText());
//                             }
//                         }}
//                         constraints={{ facingMode: 'environment' }}
//                         className="w-full"
//                     />
//                 </div>

//                 {scanResult && (
//                     <div
//                         className={`p-4 rounded-lg text-center ${scanResult.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                             }`}
//                     >
//                         <p className="font-bold mb-2">{scanResult.message}</p>

//                         {scanResult.isValid && (
//                             <button
//                                 onClick={markTicketUsed}
//                                 className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//                             >
//                                 Marquer comme utilisé
//                             </button>
//                         )}

//                         {scanResult.ticketDetails && (
//                             <div className="mt-4 text-left">
//                                 <p>Nom: {scanResult.ticketDetails.name}</p>
//                                 <p>Montant: {scanResult.ticketDetails.amount} $</p>
//                                 <p>Date: {new Date(scanResult.ticketDetails.created_at).toLocaleString()}</p>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
