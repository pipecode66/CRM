import { seedDemoData } from "./seed-runtime";

seedDemoData()
  .then((result) => {
    console.info("Seed completed", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
