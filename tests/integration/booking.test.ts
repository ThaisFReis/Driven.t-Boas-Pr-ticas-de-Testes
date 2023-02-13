import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken"; 
import supertest from "supertest";
import app, { init } from "@/app";

import { TicketStatus } from "@prisma/client";
import { cleanDb, generateValidToken } from "../helpers";

import {
    createEnrollmentWithAddress,
    createUser,
    createTicket,
    createPayment,
    createTicketTypeWithHotel,
    createHotel,
    createRoomWithHotelId,
    createBooking
  } from "../factories";


beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);


describe("Get all bookings", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/bookings");
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/bookings").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it ("should respond with status 200 when user has a booking", async () => {
            const user = await createUser();
            const token = generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(
                enrollment.id,
                ticketType.id,
                TicketStatus.PAID
            );
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const booking = await createBooking({
                roomId: room.id,
                userId: user.id
            });

            const response = await server.get("/bookings").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
        });

        it ("should respond with status 401 if user has not paymented ticket", async () => {
            const user = await createUser();
            const token = generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(
                enrollment.id,
                ticketType.id,
                TicketStatus.RESERVED
            );

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const booking = await createBooking({
                roomId: room.id,
                userId: user.id
            });

            const response = await server.get("/bookings").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });
    });
});

describe("PUT /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const token = faker.lorem.word();
        const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const token = jwt.sign({ id: faker.datatype.number() }, process.env.JWT_SECRET);
        const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when token is valid", () => {
        it("should respond with status 200 if user has a booking", async () => {
            const user = await createUser();
            const token = generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(
                enrollment.id,
                ticketType.id,
                TicketStatus.PAID
            );
            const payment = await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const booking = await createBooking({
                roomId: room.id,
                userId: user.id
            });

            const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);
        });

        it("should respond with status 401 if user has not paymented ticket", async () => {
            const user = await createUser();
            const token = generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(
                enrollment.id,
                ticketType.id,
                TicketStatus.RESERVED
            );

            const hotel = await createHotel();
            const room = await createRoomWithHotelId(hotel.id);

            const booking = await createBooking({
                roomId: room.id,
                userId: user.id
            });

            const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });
    });
});