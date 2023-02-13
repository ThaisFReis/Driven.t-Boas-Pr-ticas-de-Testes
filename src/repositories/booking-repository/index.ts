import { prisma } from "@/config";
import { Booking } from "@prisma/client";

type createBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt"> // Omit serve para omitir os campos que não queremos que sejam passados para o banco de dados 
type updateBookingParams = Omit<Booking, "createdAt" | "updatedAt">

async function createBooking({ roomId, userId }: createBookingParams) {
  const booking = await prisma.booking.create({
    data: {
      roomId,
        userId,
    },
    });

  return booking;
}

async function findByRoomId (roomId: number) {
  const bookings = await prisma.booking.findMany({
    where: {
      roomId,
    },
    include: {
        Room: true,
    },
    });

  return bookings;
}

async function findByUserId (userId: number) {
    const booking = await prisma.booking.findFirst({
        where: {
          userId,
        },
        include: {
          Room: true,
        }
        });

  return booking;
}

async function upsertBooking ({ id, roomId, userId }: updateBookingParams) {
    const booking = await prisma.booking.upsert({
        where: {
            id,
        },
        update: {
            roomId,
        },
        create: {
            roomId,
            userId,
        },
    });

  return booking;
}

const bookingRepository = {
    createBooking,
    findByRoomId,
    findByUserId,
    upsertBooking,
  };
  
  export default bookingRepository;