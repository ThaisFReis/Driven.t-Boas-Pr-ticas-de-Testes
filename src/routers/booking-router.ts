import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { createBooking, listAllBookings, updateBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken) // Usar /* para que se aplique a todas as rotas
  .get("", listAllBookings)
  .post("", createBooking)
  .put("/:bookingId", updateBooking);

export { bookingRouter };