import { prisma } from "@/config";

async function findAllByHotelId(hotelId: number) {
  const Rooms = await prisma.room.findMany({
    where: {
      hotelId,
    },
  });

  return Rooms;
}

async function findById(id: number) {   
    const Rooms = await prisma.room.findUnique({
    where: {
    id,
    },
});
    
return Rooms;
}

const roomRepository = {
    findAllByHotelId,
    findById
    };
      
export default roomRepository;