import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.WEBAPP_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.WEBAPP_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.WEBAPP_AWS_SECRET_KEY!,
  },
});

export function getS3Client() {
  return s3Client;
}
