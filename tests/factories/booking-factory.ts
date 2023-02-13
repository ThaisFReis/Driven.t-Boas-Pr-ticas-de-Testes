import { prisma } from "@/config";

type createBookingParams = {
    roomId: number;
    userId: number;
}

export function createBooking({ roomId, userId }: createBookingParams){
    return prisma.booking.create({
        data: {
            userId,
            roomId,
        }
    });
}