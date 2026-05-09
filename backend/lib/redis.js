// UPSTASH_REDIS_REST_URL="https://clever-arachnid-58740.upstash.io"
// UPSTASH_REDIS_REST_TOKEN="AeV0AAIncDIwZmJjMmM3ZWU2N2Y0N2VlODFlMzJjYjg3MGU3NWFiN3AyNTg3NDA"
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_URL);
// key-value store
// await redis.set("foo", "bar");

export default redis;
