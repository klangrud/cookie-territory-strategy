import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
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

  // 5 troops across Portland quadrants
  const troop1 = await db.troop.upsert({
    where: { troopNumber: "1147" },
    update: {},
    create: { troopNumber: "1147", name: "Laurelhurst Daisies", serviceUnitArea: "Southeast Portland" },
  });
  const troop2 = await db.troop.upsert({
    where: { troopNumber: "2263" },
    update: {},
    create: { troopNumber: "2263", name: "Alberta Brownies", serviceUnitArea: "Northeast Portland" },
  });
  const troop3 = await db.troop.upsert({
    where: { troopNumber: "3385" },
    update: {},
    create: { troopNumber: "3385", name: "Pearl District Juniors", serviceUnitArea: "Northwest Portland" },
  });
  const troop4 = await db.troop.upsert({
    where: { troopNumber: "4412" },
    update: {},
    create: { troopNumber: "4412", name: "Hillsdale Cadettes", serviceUnitArea: "Southwest Portland" },
  });
  const troop5 = await db.troop.upsert({
    where: { troopNumber: "5574" },
    update: {},
    create: { troopNumber: "5574", name: "St. Johns Seniors", serviceUnitArea: "North Portland" },
  });

  // 9 scouts per troop — fake names, real Portland residential streets
  const scouts = [
    // Troop 1147 — SE Portland
    { troopId: troop1.id, firstName: "Lily",     lastName: "Chen",      street: "3412 SE Hawthorne Blvd", city: "Portland", state: "OR", zip: "97214", latitude: 45.5121, longitude: -122.6237 },
    { troopId: troop1.id, firstName: "Sofia",    lastName: "Martinez",  street: "2345 SE Belmont St",     city: "Portland", state: "OR", zip: "97214", latitude: 45.5170, longitude: -122.6291 },
    { troopId: troop1.id, firstName: "Emma",     lastName: "Thompson",  street: "3567 SE Division St",    city: "Portland", state: "OR", zip: "97202", latitude: 45.5061, longitude: -122.6308 },
    { troopId: troop1.id, firstName: "Olivia",   lastName: "Park",      street: "4234 SE Woodstock Blvd", city: "Portland", state: "OR", zip: "97206", latitude: 45.4893, longitude: -122.6219 },
    { troopId: troop1.id, firstName: "Ava",      lastName: "Williams",  street: "1890 SE Morrison St",    city: "Portland", state: "OR", zip: "97214", latitude: 45.5192, longitude: -122.6499 },
    { troopId: troop1.id, firstName: "Isabelle", lastName: "Foster",    street: "2678 SE 32nd Ave",       city: "Portland", state: "OR", zip: "97202", latitude: 45.5089, longitude: -122.6374 },
    { troopId: troop1.id, firstName: "Zoe",      lastName: "Anderson",  street: "3901 SE Holgate Blvd",   city: "Portland", state: "OR", zip: "97202", latitude: 45.4988, longitude: -122.6182 },
    { troopId: troop1.id, firstName: "Nora",     lastName: "Jenkins",   street: "2123 SE Clinton St",     city: "Portland", state: "OR", zip: "97202", latitude: 45.5044, longitude: -122.6494 },
    { troopId: troop1.id, firstName: "Maya",     lastName: "Robinson",  street: "4456 SE Steele St",      city: "Portland", state: "OR", zip: "97206", latitude: 45.4922, longitude: -122.6138 },

    // Troop 2263 — NE Portland
    { troopId: troop2.id, firstName: "Grace",    lastName: "Kim",       street: "2345 NE Alberta St",       city: "Portland", state: "OR", zip: "97211", latitude: 45.5592, longitude: -122.6513 },
    { troopId: troop2.id, firstName: "Chloe",    lastName: "Davis",     street: "3678 NE Killingsworth St", city: "Portland", state: "OR", zip: "97211", latitude: 45.5614, longitude: -122.6398 },
    { troopId: troop2.id, firstName: "Hannah",   lastName: "Wilson",    street: "4567 NE Fremont St",       city: "Portland", state: "OR", zip: "97213", latitude: 45.5519, longitude: -122.6133 },
    { troopId: troop2.id, firstName: "Aria",     lastName: "Johnson",   street: "2890 NE Prescott St",      city: "Portland", state: "OR", zip: "97211", latitude: 45.5636, longitude: -122.6572 },
    { troopId: troop2.id, firstName: "Luna",     lastName: "Martinez",  street: "3234 NE Going St",         city: "Portland", state: "OR", zip: "97211", latitude: 45.5658, longitude: -122.6479 },
    { troopId: troop2.id, firstName: "Mia",      lastName: "Thompson",  street: "4123 NE Ainsworth St",     city: "Portland", state: "OR", zip: "97211", latitude: 45.5680, longitude: -122.6344 },
    { troopId: troop2.id, firstName: "Riley",    lastName: "Foster",    street: "2567 NE Sumner St",        city: "Portland", state: "OR", zip: "97211", latitude: 45.5703, longitude: -122.6601 },
    { troopId: troop2.id, firstName: "Stella",   lastName: "Brown",     street: "3456 NE Emerson St",       city: "Portland", state: "OR", zip: "97211", latitude: 45.5725, longitude: -122.6460 },
    { troopId: troop2.id, firstName: "Violet",   lastName: "Lee",       street: "4789 NE Mason St",         city: "Portland", state: "OR", zip: "97218", latitude: 45.5747, longitude: -122.6215 },

    // Troop 3385 — NW Portland / Pearl District
    { troopId: troop3.id, firstName: "Clara",    lastName: "Walsh",     street: "1234 NW Everett St",  city: "Portland", state: "OR", zip: "97209", latitude: 45.5256, longitude: -122.6848 },
    { troopId: troop3.id, firstName: "Penelope", lastName: "Hayes",     street: "921 NW Flanders St",  city: "Portland", state: "OR", zip: "97209", latitude: 45.5244, longitude: -122.6839 },
    { troopId: troop3.id, firstName: "Aurora",   lastName: "Reed",      street: "1845 NW Glisan St",   city: "Portland", state: "OR", zip: "97209", latitude: 45.5230, longitude: -122.6891 },
    { troopId: troop3.id, firstName: "Scarlett", lastName: "Morgan",    street: "2100 NW Hoyt St",     city: "Portland", state: "OR", zip: "97210", latitude: 45.5269, longitude: -122.6940 },
    { troopId: troop3.id, firstName: "Willow",   lastName: "Price",     street: "2234 NW Irving St",   city: "Portland", state: "OR", zip: "97210", latitude: 45.5276, longitude: -122.6958 },
    { troopId: troop3.id, firstName: "Hazel",    lastName: "Cooper",    street: "2456 NW Johnson St",  city: "Portland", state: "OR", zip: "97210", latitude: 45.5284, longitude: -122.6981 },
    { troopId: troop3.id, firstName: "Ivy",      lastName: "Bell",      street: "2789 NW Kearney St",  city: "Portland", state: "OR", zip: "97210", latitude: 45.5295, longitude: -122.7012 },
    { troopId: troop3.id, firstName: "Daisy",    lastName: "Powell",    street: "1567 NW Lovejoy St",  city: "Portland", state: "OR", zip: "97209", latitude: 45.5249, longitude: -122.6863 },
    { troopId: troop3.id, firstName: "Rosalie",  lastName: "Russell",   street: "1890 NW Marshall St", city: "Portland", state: "OR", zip: "97209", latitude: 45.5263, longitude: -122.6910 },

    // Troop 4412 — SW Portland
    { troopId: troop4.id, firstName: "Alice",     lastName: "Morgan",    street: "2345 SW Vermont St",      city: "Portland", state: "OR", zip: "97219", latitude: 45.4834, longitude: -122.7047 },
    { troopId: troop4.id, firstName: "Eleanor",   lastName: "Brooks",    street: "3456 SW Multnomah Blvd",  city: "Portland", state: "OR", zip: "97219", latitude: 45.4822, longitude: -122.7091 },
    { troopId: troop4.id, firstName: "Josephine", lastName: "Gray",      street: "4567 SW Capitol Hwy",     city: "Portland", state: "OR", zip: "97239", latitude: 45.4799, longitude: -122.7124 },
    { troopId: troop4.id, firstName: "Charlotte", lastName: "Evans",     street: "2890 SW Terwilliger Blvd",city: "Portland", state: "OR", zip: "97239", latitude: 45.4852, longitude: -122.7058 },
    { troopId: troop4.id, firstName: "Adelaide",  lastName: "Turner",    street: "3234 SW 35th Ave",        city: "Portland", state: "OR", zip: "97221", latitude: 45.4890, longitude: -122.7136 },
    { troopId: troop4.id, firstName: "Beatrice",  lastName: "Collins",   street: "4567 SW 45th Ave",        city: "Portland", state: "OR", zip: "97221", latitude: 45.4943, longitude: -122.7264 },
    { troopId: troop4.id, firstName: "Cordelia",  lastName: "Stewart",   street: "2345 SW Moss St",         city: "Portland", state: "OR", zip: "97219", latitude: 45.4856, longitude: -122.6982 },
    { troopId: troop4.id, firstName: "Diana",     lastName: "Patterson", street: "3789 SW Troy St",         city: "Portland", state: "OR", zip: "97219", latitude: 45.4831, longitude: -122.7020 },
    { troopId: troop4.id, firstName: "Frances",   lastName: "Hughes",    street: "2678 SW 26th Ave",        city: "Portland", state: "OR", zip: "97239", latitude: 45.5012, longitude: -122.7036 },

    // Troop 5574 — N Portland
    { troopId: troop5.id, firstName: "Iris",     lastName: "Sanders",  street: "2345 N Killingsworth St", city: "Portland", state: "OR", zip: "97217", latitude: 45.5624, longitude: -122.6812 },
    { troopId: troop5.id, firstName: "Juniper",  lastName: "Price",    street: "3456 N Lombard St",       city: "Portland", state: "OR", zip: "97217", latitude: 45.5800, longitude: -122.6891 },
    { troopId: troop5.id, firstName: "Marigold", lastName: "Foster",   street: "4567 N Rosa Parks Way",   city: "Portland", state: "OR", zip: "97217", latitude: 45.5682, longitude: -122.6748 },
    { troopId: troop5.id, firstName: "Clover",   lastName: "Barnes",   street: "2890 N Ainsworth St",     city: "Portland", state: "OR", zip: "97217", latitude: 45.5650, longitude: -122.6836 },
    { troopId: troop5.id, firstName: "Fern",     lastName: "Murphy",   street: "3234 N Denver Ave",       city: "Portland", state: "OR", zip: "97217", latitude: 45.5748, longitude: -122.6948 },
    { troopId: troop5.id, firstName: "Blossom",  lastName: "Reed",     street: "4567 N Farragut St",      city: "Portland", state: "OR", zip: "97217", latitude: 45.5712, longitude: -122.6872 },
    { troopId: troop5.id, firstName: "Meadow",   lastName: "Sullivan", street: "2345 N Willamette Blvd",  city: "Portland", state: "OR", zip: "97203", latitude: 45.5903, longitude: -122.7326 },
    { troopId: troop5.id, firstName: "Skye",     lastName: "Hughes",   street: "3456 N Fessenden St",     city: "Portland", state: "OR", zip: "97203", latitude: 45.5925, longitude: -122.7294 },
    { troopId: troop5.id, firstName: "Sage",     lastName: "Cooper",   street: "8765 N Lombard St",       city: "Portland", state: "OR", zip: "97203", latitude: 45.5952, longitude: -122.7260 },
  ];

  for (const scout of scouts) {
    const existing = await db.scout.findFirst({
      where: { troopId: scout.troopId, firstName: scout.firstName, lastName: scout.lastName },
    });
    if (!existing) await db.scout.create({ data: scout });
  }

  // 4 booths per troop — real Portland businesses
  const booths = [
    // Troop 1147 — SE
    { troopId: troop1.id, name: "Fred Meyer - Hawthorne",        street: "3805 SE Hawthorne Blvd", city: "Portland", state: "OR", zip: "97214", latitude: 45.5121, longitude: -122.6237, date: new Date("2026-02-07"), startTime: "10:00", endTime: "14:00", boothType: "storefront" },
    { troopId: troop1.id, name: "New Seasons Market - Division", street: "1954 SE Division St",    city: "Portland", state: "OR", zip: "97202", latitude: 45.5058, longitude: -122.6421, date: new Date("2026-02-14"), startTime: "09:00", endTime: "13:00", boothType: "storefront" },
    { troopId: troop1.id, name: "Safeway - SE Powell",           street: "3404 SE Powell Blvd",    city: "Portland", state: "OR", zip: "97202", latitude: 45.4965, longitude: -122.6362, date: new Date("2026-02-21"), startTime: "10:00", endTime: "15:00", boothType: "storefront" },
    { troopId: troop1.id, name: "WinCo Foods - SE 82nd",         street: "4233 SE 82nd Ave",       city: "Portland", state: "OR", zip: "97266", latitude: 45.4921, longitude: -122.5695, date: new Date("2026-02-28"), startTime: "11:00", endTime: "16:00", boothType: "storefront" },

    // Troop 2263 — NE
    { troopId: troop2.id, name: "New Seasons Market - Concordia", street: "5320 NE 33rd Ave",                  city: "Portland", state: "OR", zip: "97211", latitude: 45.5588, longitude: -122.6487, date: new Date("2026-02-08"), startTime: "10:00", endTime: "14:00", boothType: "storefront" },
    { troopId: troop2.id, name: "Fred Meyer - Hollywood",         street: "3030 NE Weidler St",                city: "Portland", state: "OR", zip: "97232", latitude: 45.5382, longitude: -122.6358, date: new Date("2026-02-15"), startTime: "09:00", endTime: "13:00", boothType: "storefront" },
    { troopId: troop2.id, name: "Safeway - NE Broadway",          street: "920 NE Broadway",                   city: "Portland", state: "OR", zip: "97232", latitude: 45.5398, longitude: -122.6509, date: new Date("2026-02-22"), startTime: "10:00", endTime: "15:00", boothType: "storefront" },
    { troopId: troop2.id, name: "Grocery Outlet - NE MLK",        street: "4870 NE Martin Luther King Jr Blvd",city: "Portland", state: "OR", zip: "97211", latitude: 45.5623, longitude: -122.6603, date: new Date("2026-03-01"), startTime: "11:00", endTime: "16:00", boothType: "storefront" },

    // Troop 3385 — NW
    { troopId: troop3.id, name: "Whole Foods Market - Pearl",  street: "1210 NW Couch St",    city: "Portland", state: "OR", zip: "97209", latitude: 45.5250, longitude: -122.6849, date: new Date("2026-02-07"), startTime: "09:00", endTime: "13:00", boothType: "storefront" },
    { troopId: troop3.id, name: "Trader Joe's - NW Glisan",    street: "2120 NW Glisan St",   city: "Portland", state: "OR", zip: "97210", latitude: 45.5283, longitude: -122.6921, date: new Date("2026-02-14"), startTime: "10:00", endTime: "14:00", boothType: "storefront" },
    { troopId: troop3.id, name: "Zupan's Markets - W Burnside",street: "2340 W Burnside St",  city: "Portland", state: "OR", zip: "97210", latitude: 45.5225, longitude: -122.6965, date: new Date("2026-02-21"), startTime: "11:00", endTime: "15:00", boothType: "storefront" },
    { troopId: troop3.id, name: "New Seasons Market - Slabtown",street: "3445 NW 24th Ave",   city: "Portland", state: "OR", zip: "97210", latitude: 45.5340, longitude: -122.6986, date: new Date("2026-02-28"), startTime: "09:00", endTime: "12:00", boothType: "storefront" },

    // Troop 4412 — SW
    { troopId: troop4.id, name: "Fred Meyer - Barbur",              street: "6345 SW Barbur Blvd",  city: "Portland", state: "OR", zip: "97239", latitude: 45.4783, longitude: -122.6900, date: new Date("2026-02-08"), startTime: "10:00", endTime: "14:00", boothType: "storefront" },
    { troopId: troop4.id, name: "Safeway - SW Barbur",              street: "4843 SW Barbur Blvd",  city: "Portland", state: "OR", zip: "97239", latitude: 45.4930, longitude: -122.6870, date: new Date("2026-02-15"), startTime: "09:00", endTime: "13:00", boothType: "storefront" },
    { troopId: troop4.id, name: "New Seasons Market - Multnomah",   street: "7300 SW Capitol Hwy",  city: "Portland", state: "OR", zip: "97219", latitude: 45.4791, longitude: -122.7144, date: new Date("2026-02-22"), startTime: "10:00", endTime: "15:00", boothType: "storefront" },
    { troopId: troop4.id, name: "Grocery Outlet - SW Macadam",      street: "6625 SW Macadam Ave",  city: "Portland", state: "OR", zip: "97239", latitude: 45.4760, longitude: -122.6818, date: new Date("2026-03-01"), startTime: "11:00", endTime: "16:00", boothType: "storefront" },

    // Troop 5574 — N Portland
    { troopId: troop5.id, name: "Fred Meyer - Interstate",         street: "4250 N Interstate Ave", city: "Portland", state: "OR", zip: "97217", latitude: 45.5783, longitude: -122.6758, date: new Date("2026-02-08"), startTime: "10:00", endTime: "14:00", boothType: "storefront" },
    { troopId: troop5.id, name: "New Seasons Market - St. Johns",  street: "8826 N Lombard St",     city: "Portland", state: "OR", zip: "97203", latitude: 45.5938, longitude: -122.7283, date: new Date("2026-02-15"), startTime: "09:00", endTime: "13:00", boothType: "storefront" },
    { troopId: troop5.id, name: "Grocery Outlet - N Lombard",      street: "3329 N Lombard St",     city: "Portland", state: "OR", zip: "97217", latitude: 45.5795, longitude: -122.6987, date: new Date("2026-02-22"), startTime: "10:00", endTime: "15:00", boothType: "storefront" },
    { troopId: troop5.id, name: "Safeway - N Hayden Island",       street: "1234 N Hayden Island Dr",city: "Portland", state: "OR", zip: "97217", latitude: 45.6086, longitude: -122.6898, date: new Date("2026-03-01"), startTime: "11:00", endTime: "16:00", boothType: "storefront" },
  ];

  for (const booth of booths) {
    const existing = await db.booth.findFirst({
      where: { troopId: booth.troopId, name: booth.name },
    });
    if (!existing) await db.booth.create({ data: booth });
  }

  console.log("Seed complete: 5 troops, 45 scouts, 20 booths across Portland, OR.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
