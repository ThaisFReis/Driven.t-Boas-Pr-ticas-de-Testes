import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Room id is required",
    });
  }

  const booking = await bookingService.bookingRoomById(roomId, userId);

    return res.status(httpStatus.CREATED).json(booking);
}

export async function listAllBookings(req: AuthenticatedRequest, res: Response) {
  try{
    const { userId } = req;
    const booking = await bookingService.getBooking(userId);
    
    return res.status(httpStatus.OK).send({ id : booking.id, Room : booking.Room });
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({ message: error.message });
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  try{
    const { userId } = req;
    const bookingById = req.params.bookingId;
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Room id is required",
      });
    }

    if (!bookingById) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Booking id is required",
      });
    }

    const booking = await bookingService.updateBooking(userId, roomId);

    return res.status(httpStatus.OK).json(booking);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({ message: error.message });
  }
}