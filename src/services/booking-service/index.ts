import roomRepository from "@/repositories/room-repository";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

// Função para buscar a reserva do usuário
async function getBooking(userId: number) {
    // Busca a reserva pelo ID do usuário
    const booking = await bookingRepository.findByUserId(userId);
    
    // Se a reserva não for encontrada, lança erro
    if (!booking) {
    throw new Error("Reserva não encontrada");
    }
    
    // Retorna a reserva
    return booking;
}

// Função para verificar a inscrição e o bilhete do usuário
async function checkEnrollmentTicket(userId: number) {
    // Busca a inscrição do usuário pelo ID
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    // Se a inscrição não for encontrada, lança erro
    if (!enrollment) {
        throw new Error("Inscrição não encontrada");
    }

    // Busca o bilhete pelo ID da inscrição
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

    // Se o bilhete não for encontrado ou estiver reservado ou não incluir hospedagem ou for à distância, lança erro
    if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw new Error("Não é possível realizar a reserva");
    }
}

// Função para verificar se a reserva é válida
async function checkValidBooking(roomId: number) {
    // Busca a sala pelo ID
    const room = await roomRepository.findById(roomId);

    // Busca as reservas do quarto
    const bookings = await bookingRepository.findByRoomId(roomId);

    // Se a sala não for encontrada, lança erro
    if (!room) {
        throw new Error("Sala não encontrada");
    }

    // Se a capacidade da sala for menor ou igual ao número de reservas, lança erro
    if (room.capacity <= bookings.length) {
        throw new Error("Não é possível realizar a reserva");
    }
}

// Função para reservar um quarto pelo ID
async function bookingRoomById(userId: number, roomId: number) {
    // Verifica a inscrição e o bilhete do usuário
    await checkEnrollmentTicket(userId);
    // Verifica se a sala está disponível
    const room = await checkValidBooking(roomId);

    return bookingRepository.createBooking({userId, roomId});
}

// Função para atualizar a reserva do usuário
async function updateBooking(userId: number, roomId: number) {
    // Busca a reserva do usuário
    const booking = await getBooking(userId);
    // Verifica a inscrição e o bilhete do usuário
    await checkEnrollmentTicket(userId);
    // Verifica se a sala está disponível
    const room = await checkValidBooking(roomId);

    if (booking.roomId === roomId) {
        throw new Error("Não é possível realizar a reserva");
    }

    return bookingRepository.upsertBooking({
        id: booking.id,
        roomId,
        userId,
    });
}

const bookingService = {
    getBooking,                                                                         
    checkEnrollmentTicket,
    checkValidBooking,
    bookingRoomById,
    updateBooking,
};

export default bookingService;