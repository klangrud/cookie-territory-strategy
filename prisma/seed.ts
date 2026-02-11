import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // Admin user
  const passwordHash = await hash("admin123", 12);
  await db.user.upsert({
    where: { email: "admin@cookieterritory.local" },
    update: {},
    create: {
      email: "admin@cookieterritory.local",
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
    },
  });

  // Troops
  const troop1 = await db.troop.upsert({
    where: { troopNumber: "4521" },
    update: {},
    create: {
      troopNumber: "4521",
      name: "Springfield Daisies",
      serviceUnitArea: "Springfield North",
    },
  });

  const troop2 = await db.troop.upsert({
    where: { troopNumber: "3087" },
    update: {},
    create: {
      troopNumber: "3087",
      name: "Capital City Brownies",
      serviceUnitArea: "Springfield South",
    },
  });

  const troop3 = await db.troop.upsert({
    where: { troopNumber: "5612" },
    update: {},
    create: {
      troopNumber: "5612",
      name: "Lincoln Trail Juniors",
      serviceUnitArea: "Springfield West",
    },
  });

  // Scouts — Springfield, IL area with hardcoded lat/lng
  const scouts = [
    // Troop 4521
    { troopId: troop1.id, firstName: "Emma", lastName: "Johnson", street: "101 E Monroe St", city: "Springfield", state: "IL", zip: "62701", latitude: 39.7990, longitude: -89.6437 },
    { troopId: troop1.id, firstName: "Olivia", lastName: "Smith", street: "200 S 6th St", city: "Springfield", state: "IL", zip: "62701", latitude: 39.7960, longitude: -89.6453 },
    { troopId: troop1.id, firstName: "Ava", lastName: "Williams", street: "500 N Grand Ave E", city: "Springfield", state: "IL", zip: "62702", latitude: 39.8045, longitude: -89.6350 },
    { troopId: troop1.id, firstName: "Sophia", lastName: "Brown", street: "1500 Wabash Ave", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7880, longitude: -89.6700 },
    { troopId: troop1.id, firstName: "Mia", lastName: "Jones", street: "2100 S MacArthur Blvd", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7720, longitude: -89.6850 },
    // Troop 3087
    { troopId: troop2.id, firstName: "Charlotte", lastName: "Davis", street: "3001 S 6th St", city: "Springfield", state: "IL", zip: "62703", latitude: 39.7600, longitude: -89.6450 },
    { troopId: troop2.id, firstName: "Amelia", lastName: "Miller", street: "2800 S Walnut St", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7650, longitude: -89.6600 },
    { troopId: troop2.id, firstName: "Harper", lastName: "Wilson", street: "100 Chatham Rd", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7700, longitude: -89.6750 },
    { troopId: troop2.id, firstName: "Ella", lastName: "Moore", street: "1800 S Spring St", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7750, longitude: -89.6550 },
    { troopId: troop2.id, firstName: "Lily", lastName: "Taylor", street: "3200 Lindbergh Blvd", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7580, longitude: -89.6800 },
    // Troop 5612
    { troopId: troop3.id, firstName: "Grace", lastName: "Anderson", street: "3100 W Iles Ave", city: "Springfield", state: "IL", zip: "62711", latitude: 39.7500, longitude: -89.7100 },
    { troopId: troop3.id, firstName: "Chloe", lastName: "Thomas", street: "2500 W Monroe St", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7980, longitude: -89.6900 },
    { troopId: troop3.id, firstName: "Zoey", lastName: "Jackson", street: "4000 Wabash Ave", city: "Springfield", state: "IL", zip: "62711", latitude: 39.7880, longitude: -89.7200 },
    { troopId: troop3.id, firstName: "Nora", lastName: "White", street: "1700 W Lawrence Ave", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7920, longitude: -89.6800 },
    { troopId: troop3.id, firstName: "Riley", lastName: "Harris", street: "2000 Archer Elevator Rd", city: "Springfield", state: "IL", zip: "62711", latitude: 39.7450, longitude: -89.7050 },
  ];

  for (const scout of scouts) {
    const existing = await db.scout.findFirst({
      where: {
        troopId: scout.troopId,
        firstName: scout.firstName,
        lastName: scout.lastName,
      },
    });
    if (!existing) {
      await db.scout.create({ data: scout });
    }
  }

  // Booths
  const booths = [
    // Troop 4521
    { troopId: troop1.id, name: "Walmart on Dirksen", street: "2760 N Dirksen Pkwy", city: "Springfield", state: "IL", zip: "62702", latitude: 39.8200, longitude: -89.6200, date: new Date("2026-02-14"), startTime: "10:00", endTime: "14:00" },
    { troopId: troop1.id, name: "Schnucks on Wabash", street: "1900 Wabash Ave", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7870, longitude: -89.6750, date: new Date("2026-02-21"), startTime: "09:00", endTime: "13:00" },
    // Troop 3087
    { troopId: troop2.id, name: "Hy-Vee on MacArthur", street: "2115 S MacArthur Blvd", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7730, longitude: -89.6840, date: new Date("2026-02-28"), startTime: "10:00", endTime: "15:00" },
    { troopId: troop2.id, name: "Target on Veterans", street: "3300 S Veterans Pkwy", city: "Springfield", state: "IL", zip: "62704", latitude: 39.7550, longitude: -89.6400, date: new Date("2026-03-07"), startTime: "11:00", endTime: "16:00" },
    // Troop 5612
    { troopId: troop3.id, name: "Meijer on W Iles", street: "3301 W Iles Ave", city: "Springfield", state: "IL", zip: "62711", latitude: 39.7490, longitude: -89.7150, date: new Date("2026-03-01"), startTime: "09:00", endTime: "12:00" },
    { troopId: troop3.id, name: "Menards on Wabash", street: "4101 Wabash Ave", city: "Springfield", state: "IL", zip: "62711", latitude: 39.7870, longitude: -89.7250, date: new Date("2026-03-14"), startTime: "10:00", endTime: "14:00" },
  ];

  for (const booth of booths) {
    const existing = await db.booth.findFirst({
      where: {
        troopId: booth.troopId,
        name: booth.name,
      },
    });
    if (!existing) {
      await db.booth.create({ data: booth });
    }
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
